import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pkg from 'pg'
const { Pool } = pkg

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, 'dist')

console.log('API Server iniciando...')
console.log('Base de datos: PostgreSQL')
console.log('Sirviendo archivos desde:', distPath)

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

pool.on('error', (err) => {
  console.error('Pool error:', err.message)
})

async function initializeDatabase() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        celular VARCHAR(20),
        edad INTEGER,
        correo VARCHAR(255),
        descuento INTEGER DEFAULT 0,
        fecha TIMESTAMP DEFAULT NOW()
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        codigo VARCHAR(50) UNIQUE NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10, 2),
        inventario INTEGER DEFAULT 0,
        receta TEXT,
        peso VARCHAR(50),
        promoNombre VARCHAR(255),
        promoCantidad INTEGER,
        promoPrecio DECIMAL(10, 2),
        activo INTEGER DEFAULT 1
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS recetas (
        id SERIAL PRIMARY KEY,
        codigo VARCHAR(50) UNIQUE NOT NULL,
        nombre VARCHAR(255),
        ingredientes TEXT,
        instrucciones TEXT,
        tiempo INTEGER
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS cajas (
        id SERIAL PRIMARY KEY,
        monto_inicial DECIMAL(10, 2) NOT NULL,
        monto_cierre DECIMAL(10, 2),
        efectivo_esperado DECIMAL(10, 2),
        efectivo_real DECIMAL(10, 2),
        diferencia DECIMAL(10, 2),
        estado VARCHAR(50) DEFAULT 'abierta',
        fecha_apertura TIMESTAMP DEFAULT NOW(),
        fecha_cierre TIMESTAMP,
        notas TEXT
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS movimientos_caja (
        id SERIAL PRIMARY KEY,
        caja_id INTEGER NOT NULL REFERENCES cajas(id),
        tipo VARCHAR(50),
        monto DECIMAL(10, 2),
        descripcion TEXT,
        fecha TIMESTAMP DEFAULT NOW()
      )
    `)

    console.log('✅ Tablas inicializadas')
  } finally {
    client.release()
  }
}

await initializeDatabase()

async function getClients() {
  const result = await pool.query('SELECT * FROM clientes ORDER BY nombre')
  return result.rows
}

async function addClient(clientData) {
  if (!clientData.nombre || !clientData.celular || !clientData.edad || !clientData.correo) {
    throw new Error('Faltan campos requeridos')
  }

  let descuento = parseInt(clientData.descuento) || 0
  if (descuento < 0 || descuento > 10) {
    throw new Error('El descuento debe estar entre 0 y 10')
  }

  const result = await pool.query(
    'INSERT INTO clientes (nombre, celular, edad, correo, descuento) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [clientData.nombre, clientData.celular, clientData.edad, clientData.correo, descuento]
  )

  return result.rows[0]
}

async function updateClient(clientId, updates) {
  const allowedFields = ['celular', 'edad', 'correo', 'descuento']
  const updateParts = []
  const values = []
  let paramCount = 1

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      if (field === 'descuento') {
        let descuento = parseInt(updates[field]) || 0
        if (descuento < 0 || descuento > 10) {
          throw new Error('El descuento debe estar entre 0 y 10')
        }
        updateParts.push(`${field} = $${paramCount}`)
        values.push(descuento)
      } else {
        updateParts.push(`${field} = $${paramCount}`)
        values.push(updates[field])
      }
      paramCount++
    }
  }

  if (updateParts.length === 0) {
    throw new Error('No hay campos para actualizar')
  }

  values.push(clientId)
  const query = `UPDATE clientes SET ${updateParts.join(', ')} WHERE id = $${paramCount} RETURNING *`
  const result = await pool.query(query, values)

  if (result.rows.length === 0) {
    throw new Error('Cliente no encontrado')
  }

  return result.rows[0]
}

async function getProducts() {
  const result = await pool.query('SELECT * FROM productos WHERE activo = 1 ORDER BY codigo')
  return result.rows
}

async function addProduct(productData) {
  if (!productData.codigo || !productData.descripcion || !productData.precio) {
    throw new Error('Faltan campos requeridos')
  }

  const result = await pool.query(
    `INSERT INTO productos (codigo, descripcion, precio, inventario, receta, peso, promoNombre, promoCantidad, promoPrecio)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [
      productData.codigo,
      productData.descripcion,
      productData.precio,
      productData.inventario || 0,
      productData.receta || null,
      productData.peso || null,
      productData.promoNombre || null,
      productData.promoCantidad || null,
      productData.promoPrecio || null
    ]
  )

  return result.rows[0]
}

async function updateProduct(codigo, updates) {
  const result = await pool.query(
    `UPDATE productos
     SET descripcion = $1, precio = $2, inventario = $3, receta = $4, peso = $5, promoNombre = $6, promoCantidad = $7, promoPrecio = $8
     WHERE codigo = $9 RETURNING *`,
    [
      updates.descripcion,
      updates.precio,
      updates.inventario,
      updates.receta || null,
      updates.peso || null,
      updates.promoNombre || null,
      updates.promoCantidad || null,
      updates.promoPrecio || null,
      codigo
    ]
  )

  if (result.rows.length === 0) {
    throw new Error('Producto no encontrado')
  }

  return result.rows[0]
}

async function inactiveProduct(codigo) {
  const result = await pool.query('UPDATE productos SET activo = 0 WHERE codigo = $1 RETURNING *', [codigo])

  if (result.rows.length === 0) {
    throw new Error('Producto no encontrado')
  }

  return { message: 'Producto inactivado' }
}

async function getRecipes() {
  const result = await pool.query('SELECT * FROM recetas ORDER BY codigo')
  return result.rows
}

async function addRecipe(recipeData) {
  if (!recipeData.codigo || !recipeData.nombre) {
    throw new Error('Faltan campos requeridos')
  }

  const result = await pool.query(
    `INSERT INTO recetas (codigo, nombre, ingredientes, instrucciones, tiempo)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [
      recipeData.codigo,
      recipeData.nombre,
      recipeData.ingredientes || null,
      recipeData.instrucciones || null,
      recipeData.tiempo || null
    ]
  )

  return result.rows[0]
}

async function updateRecipe(codigo, updates) {
  const result = await pool.query(
    `UPDATE recetas
     SET nombre = $1, ingredientes = $2, instrucciones = $3, tiempo = $4
     WHERE codigo = $5 RETURNING *`,
    [
      updates.nombre,
      updates.ingredientes || null,
      updates.instrucciones || null,
      updates.tiempo || null,
      codigo
    ]
  )

  if (result.rows.length === 0) {
    throw new Error('Receta no encontrada')
  }

  return result.rows[0]
}

async function deleteRecipe(codigo) {
  const result = await pool.query('DELETE FROM recetas WHERE codigo = $1', [codigo])

  if (result.rowCount === 0) {
    throw new Error('Receta no encontrada')
  }

  return { message: 'Receta eliminada' }
}

async function updateInventory(items) {
  for (const item of items) {
    const result = await pool.query(
      'UPDATE productos SET inventario = inventario - $1 WHERE codigo = $2 RETURNING *',
      [item.cantidad, item.codigo]
    )
    if (result.rows.length === 0) {
      throw new Error(`Producto no encontrado: ${item.codigo}`)
    }
  }
  return { message: 'Inventario actualizado' }
}

async function openCashRegister(montoInicial) {
  if (!montoInicial || isNaN(montoInicial)) {
    throw new Error('Monto inicial debe ser un número válido')
  }
  const result = await pool.query(
    'INSERT INTO cajas (monto_inicial, estado) VALUES ($1, $2) RETURNING *',
    [parseFloat(montoInicial), 'abierta']
  )
  return result.rows[0]
}

async function getCurrentCashRegister() {
  const result = await pool.query(
    `SELECT c.*,
      COALESCE(SUM(CASE WHEN m.tipo = 'venta_efectivo' THEN m.monto ELSE 0 END), 0) as ventas_efectivo,
      COALESCE(SUM(CASE WHEN m.tipo = 'venta_tarjeta' THEN m.monto ELSE 0 END), 0) as ventas_tarjeta,
      COALESCE(SUM(CASE WHEN m.tipo = 'venta_sinpe' THEN m.monto ELSE 0 END), 0) as ventas_sinpe,
      COALESCE(SUM(CASE WHEN m.tipo = 'retiro' THEN m.monto ELSE 0 END), 0) as retiros,
      COALESCE(SUM(CASE WHEN m.tipo = 'gasto' THEN m.monto ELSE 0 END), 0) as gastos
     FROM cajas c
     LEFT JOIN movimientos_caja m ON c.id = m.caja_id
     WHERE c.estado = 'abierta'
     GROUP BY c.id
     ORDER BY c.fecha_apertura DESC
     LIMIT 1`
  )
  if (result.rows.length === 0) return null

  const caja = result.rows[0]
  const efectivoEsperado = parseFloat(caja.monto_inicial) +
    parseFloat(caja.ventas_efectivo) -
    parseFloat(caja.retiros) -
    parseFloat(caja.gastos)

  return {
    ...caja,
    efectivo_esperado: efectivoEsperado,
    ventas_efectivo: parseFloat(caja.ventas_efectivo),
    ventas_tarjeta: parseFloat(caja.ventas_tarjeta),
    ventas_sinpe: parseFloat(caja.ventas_sinpe),
    retiros: parseFloat(caja.retiros),
    gastos: parseFloat(caja.gastos)
  }
}

async function registerCashMovement(cajaId, tipo, monto, descripcion) {
  const result = await pool.query(
    'INSERT INTO movimientos_caja (caja_id, tipo, monto, descripcion) VALUES ($1, $2, $3, $4) RETURNING *',
    [cajaId, tipo, parseFloat(monto), descripcion]
  )
  return result.rows[0]
}

async function closeCashRegister(cajaId, efectivoReal, pagosTarjeta, pagosSinpe, notas) {
  const caja = await getCurrentCashRegister()

  if (!caja || caja.id !== cajaId) {
    throw new Error('Caja no encontrada o ya está cerrada')
  }

  const ventasEfectivo = parseFloat(caja.ventas_efectivo)
  const retiros = parseFloat(caja.retiros)
  const gastos = parseFloat(caja.gastos)
  const montoInicial = parseFloat(caja.monto_inicial)

  const efectivoEsperado = montoInicial + ventasEfectivo - retiros - gastos
  const diferencia = parseFloat(efectivoReal) - efectivoEsperado

  if (Math.abs(diferencia) > 0.01) {
    throw new Error(`Diferencia en caja detectada: ${diferencia.toFixed(2)}. No se puede cerrar.`)
  }

  const montoCierre = parseFloat(efectivoReal) + parseFloat(pagosTarjeta) + parseFloat(pagosSinpe)

  const result = await pool.query(
    `UPDATE cajas
     SET estado = 'cerrada',
         monto_cierre = $1,
         efectivo_real = $2,
         efectivo_esperado = $3,
         diferencia = $4,
         fecha_cierre = NOW(),
         notas = $5
     WHERE id = $6
     RETURNING *`,
    [montoCierre, parseFloat(efectivoReal), efectivoEsperado, diferencia, notas, cajaId]
  )

  return result.rows[0]
}

async function getCashRegisterHistory() {
  const result = await pool.query(
    'SELECT * FROM cajas WHERE estado = $1 ORDER BY fecha_cierre DESC',
    ['cerrada']
  )
  return result.rows.map(caja => ({
    ...caja,
    monto_inicial: parseFloat(caja.monto_inicial),
    monto_cierre: parseFloat(caja.monto_cierre),
    efectivo_esperado: parseFloat(caja.efectivo_esperado),
    efectivo_real: parseFloat(caja.efectivo_real),
    diferencia: parseFloat(caja.diferencia)
  }))
}

function serveStaticFile(filePath, res) {
  try {
    if (!fs.existsSync(filePath)) return false
    const content = fs.readFileSync(filePath, 'utf8')
    const ext = path.extname(filePath)
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    }
    const contentType = mimeTypes[ext] || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(content)
    return true
  } catch (err) {
    return false
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  // GET /api/clients
  if (req.url === '/api/clients' && req.method === 'GET') {
    try {
      const clients = await getClients()
      res.writeHead(200)
      res.end(JSON.stringify(clients))
    } catch (err) {
      console.error('GET error:', err)
      res.writeHead(500)
      res.end(JSON.stringify({ error: 'Server error' }))
    }
    return
  }

  // POST /api/clients
  if (req.url === '/api/clients' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk.toString() })
    req.on('end', async () => {
      try {
        console.log('POST /api/clients - Datos recibidos:', body)
        if (!body) {
          res.writeHead(400)
          res.end(JSON.stringify({ error: 'Body vacío' }))
          return
        }
        const clientData = JSON.parse(body)
        const newClient = await addClient(clientData)
        console.log('Cliente guardado exitosamente:', newClient.id)
        res.writeHead(201)
        res.end(JSON.stringify(newClient))
      } catch (err) {
        console.error('Error en POST:', err.message)
        res.writeHead(400)
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  // PUT /api/clients/:id
  const putMatch = req.url.match(/^\/api\/clients\/(\d+)$/)
  if (putMatch && req.method === 'PUT') {
    const clientId = parseInt(putMatch[1])
    let body = ''
    req.on('data', chunk => { body += chunk.toString() })
    req.on('end', async () => {
      try {
        if (!body) {
          res.writeHead(400)
          res.end(JSON.stringify({ error: 'Body vacío' }))
          return
        }
        const updateData = JSON.parse(body)
        const updatedClient = await updateClient(clientId, updateData)
        res.writeHead(200)
        res.end(JSON.stringify(updatedClient))
      } catch (err) {
        console.error('Error en PUT:', err.message)
        res.writeHead(400)
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  // GET /api/products
  if (req.url === '/api/products' && req.method === 'GET') {
    try {
      const products = await getProducts()
      res.writeHead(200)
      res.end(JSON.stringify(products))
    } catch (err) {
      console.error('GET /api/products error:', err)
      res.writeHead(500)
      res.end(JSON.stringify({ error: 'Server error' }))
    }
    return
  }

  // POST /api/products
  if (req.url === '/api/products' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk.toString() })
    req.on('end', async () => {
      try {
        const productData = JSON.parse(body)
        const newProduct = await addProduct(productData)
        res.writeHead(201)
        res.end(JSON.stringify(newProduct))
      } catch (err) {
        console.error('POST /api/products error:', err.message)
        res.writeHead(400)
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  // PUT /api/products/:codigo
  const putProductMatch = req.url.match(/^\/api\/products\/(.+)$/)
  if (putProductMatch && req.method === 'PUT') {
    const codigo = decodeURIComponent(putProductMatch[1])
    let body = ''
    req.on('data', chunk => { body += chunk.toString() })
    req.on('end', async () => {
      try {
        const updateData = JSON.parse(body)
        const updatedProduct = await updateProduct(codigo, updateData)
        res.writeHead(200)
        res.end(JSON.stringify(updatedProduct))
      } catch (err) {
        console.error('PUT /api/products error:', err.message)
        res.writeHead(400)
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  // DELETE /api/products/:codigo (Inactivar en lugar de eliminar)
  const deleteProductMatch = req.url.match(/^\/api\/products\/(.+)$/)
  if (deleteProductMatch && req.method === 'DELETE') {
    try {
      const codigo = decodeURIComponent(deleteProductMatch[1])
      const result = await inactiveProduct(codigo)
      res.writeHead(200)
      res.end(JSON.stringify(result))
    } catch (err) {
      console.error('DELETE /api/products error:', err.message)
      res.writeHead(400)
      res.end(JSON.stringify({ error: err.message }))
    }
    return
  }

  // GET /api/recipes
  if (req.url === '/api/recipes' && req.method === 'GET') {
    try {
      const recipes = await getRecipes()
      res.writeHead(200)
      res.end(JSON.stringify(recipes))
    } catch (err) {
      console.error('GET /api/recipes error:', err)
      res.writeHead(500)
      res.end(JSON.stringify({ error: 'Server error' }))
    }
    return
  }

  // POST /api/recipes
  if (req.url === '/api/recipes' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk.toString() })
    req.on('end', async () => {
      try {
        const recipeData = JSON.parse(body)
        const newRecipe = await addRecipe(recipeData)
        res.writeHead(201)
        res.end(JSON.stringify(newRecipe))
      } catch (err) {
        console.error('POST /api/recipes error:', err.message)
        res.writeHead(400)
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  // PUT /api/recipes/:codigo
  const putRecipeMatch = req.url.match(/^\/api\/recipes\/(.+)$/)
  if (putRecipeMatch && req.method === 'PUT') {
    const codigo = decodeURIComponent(putRecipeMatch[1])
    let body = ''
    req.on('data', chunk => { body += chunk.toString() })
    req.on('end', async () => {
      try {
        const updateData = JSON.parse(body)
        const updatedRecipe = await updateRecipe(codigo, updateData)
        res.writeHead(200)
        res.end(JSON.stringify(updatedRecipe))
      } catch (err) {
        console.error('PUT /api/recipes error:', err.message)
        res.writeHead(400)
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  // DELETE /api/recipes/:codigo
  const deleteRecipeMatch = req.url.match(/^\/api\/recipes\/(.+)$/)
  if (deleteRecipeMatch && req.method === 'DELETE') {
    try {
      const codigo = decodeURIComponent(deleteRecipeMatch[1])
      const result = await deleteRecipe(codigo)
      res.writeHead(200)
      res.end(JSON.stringify(result))
    } catch (err) {
      console.error('DELETE /api/recipes error:', err.message)
      res.writeHead(400)
      res.end(JSON.stringify({ error: err.message }))
    }
    return
  }

  // POST /api/inventory (Actualizar inventario al cobrar)
  if (req.url === '/api/inventory' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk.toString() })
    req.on('end', async () => {
      try {
        const items = JSON.parse(body)
        const result = await updateInventory(items)
        res.writeHead(200)
        res.end(JSON.stringify(result))
      } catch (err) {
        console.error('POST /api/inventory error:', err.message)
        res.writeHead(400)
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  // POST /api/cash-register/open
  if (req.url === '/api/cash-register/open' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk.toString() })
    req.on('end', async () => {
      try {
        const { montoInicial } = JSON.parse(body)
        const caja = await openCashRegister(montoInicial)
        res.writeHead(201)
        res.end(JSON.stringify(caja))
      } catch (err) {
        console.error('POST /api/cash-register/open error:', err.message)
        res.writeHead(400)
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  // GET /api/cash-register/current
  if (req.url === '/api/cash-register/current' && req.method === 'GET') {
    try {
      const caja = await getCurrentCashRegister()
      res.writeHead(200)
      res.end(JSON.stringify(caja || {}))
    } catch (err) {
      console.error('GET /api/cash-register/current error:', err.message)
      res.writeHead(500)
      res.end(JSON.stringify({ error: err.message }))
    }
    return
  }

  // POST /api/cash-register/movement
  if (req.url === '/api/cash-register/movement' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk.toString() })
    req.on('end', async () => {
      try {
        const { cajaId, tipo, monto, descripcion } = JSON.parse(body)
        const movimiento = await registerCashMovement(cajaId, tipo, monto, descripcion)
        res.writeHead(201)
        res.end(JSON.stringify(movimiento))
      } catch (err) {
        console.error('POST /api/cash-register/movement error:', err.message)
        res.writeHead(400)
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  // POST /api/cash-register/close
  if (req.url === '/api/cash-register/close' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk.toString() })
    req.on('end', async () => {
      try {
        const { cajaId, efectivoReal, pagosTarjeta, pagosSinpe, notas } = JSON.parse(body)
        const cajaClosing = await closeCashRegister(cajaId, efectivoReal, pagosTarjeta, pagosSinpe, notas)
        res.writeHead(200)
        res.end(JSON.stringify(cajaClosing))
      } catch (err) {
        console.error('POST /api/cash-register/close error:', err.message)
        res.writeHead(400)
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    return
  }

  // GET /api/cash-register/history
  if (req.url === '/api/cash-register/history' && req.method === 'GET') {
    try {
      const history = await getCashRegisterHistory()
      res.writeHead(200)
      res.end(JSON.stringify(history))
    } catch (err) {
      console.error('GET /api/cash-register/history error:', err.message)
      res.writeHead(500)
      res.end(JSON.stringify({ error: err.message }))
    }
    return
  }

  // Servir archivos estáticos
  if (req.method === 'GET') {
    let urlPath = req.url === '/' ? '/index.html' : req.url

    // Evitar directory traversal
    if (urlPath.includes('..')) {
      res.writeHead(404)
      res.end(JSON.stringify({ error: 'Not found' }))
      return
    }

    const filePath = path.join(distPath, urlPath)
    if (serveStaticFile(filePath, res)) return

    // Si no encuentra el archivo exacto, intenta index.html (para rutas SPA)
    if (!path.extname(urlPath)) {
      if (serveStaticFile(path.join(distPath, 'index.html'), res)) return
    }
  }

  res.writeHead(404)
  res.end(JSON.stringify({ error: 'Not found' }))
})

const API_PORT = process.env.PORT || 3003
server.listen(API_PORT, () => {
  console.log(`✅ API Server corriendo en puerto ${API_PORT}`)
})

server.on('error', (err) => {
  console.error('Server error:', err.message)
})
