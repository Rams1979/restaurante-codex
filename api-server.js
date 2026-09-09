import http from 'http'
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'codex.db')

console.log('API Server iniciando...')
console.log('Base de datos:', dbPath)

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

function getClients() {
  const stmt = db.prepare('SELECT * FROM clientes ORDER BY nombre')
  return stmt.all()
}

function addClient(clientData) {
  if (!clientData.nombre || !clientData.celular || !clientData.edad || !clientData.correo) {
    throw new Error('Faltan campos requeridos')
  }

  let descuento = parseInt(clientData.descuento) || 0
  if (descuento < 0 || descuento > 10) {
    throw new Error('El descuento debe estar entre 0 y 10')
  }

  const stmt = db.prepare(`
    INSERT INTO clientes (nombre, celular, edad, correo, descuento)
    VALUES (?, ?, ?, ?, ?)
  `)

  const result = stmt.run(clientData.nombre, clientData.celular, clientData.edad, clientData.correo, descuento)

  return {
    id: result.lastInsertRowid,
    nombre: clientData.nombre,
    celular: clientData.celular,
    edad: clientData.edad,
    correo: clientData.correo,
    descuento: descuento,
    fecha: new Date().toISOString()
  }
}

function updateClient(clientId, updates) {
  const allowedFields = ['celular', 'edad', 'correo', 'descuento']
  const updateParts = []
  const values = []

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      if (field === 'descuento') {
        let descuento = parseInt(updates[field]) || 0
        if (descuento < 0 || descuento > 10) {
          throw new Error('El descuento debe estar entre 0 y 10')
        }
        updateParts.push(`${field} = ?`)
        values.push(descuento)
      } else {
        updateParts.push(`${field} = ?`)
        values.push(updates[field])
      }
    }
  }

  if (updateParts.length === 0) {
    throw new Error('No hay campos para actualizar')
  }

  values.push(clientId)
  const query = `UPDATE clientes SET ${updateParts.join(', ')} WHERE id = ?`
  const stmt = db.prepare(query)
  const result = stmt.run(...values)

  if (result.changes === 0) {
    throw new Error('Cliente no encontrado')
  }

  const client = db.prepare('SELECT * FROM clientes WHERE id = ?').get(clientId)
  return client
}

// Productos (solo activos)
function getProducts() {
  const stmt = db.prepare('SELECT * FROM productos WHERE activo = 1 ORDER BY codigo')
  return stmt.all()
}

function addProduct(productData) {
  if (!productData.codigo || !productData.descripcion || !productData.precio) {
    throw new Error('Faltan campos requeridos')
  }

  const stmt = db.prepare(`
    INSERT INTO productos (codigo, descripcion, precio, inventario, receta, peso, promoNombre, promoCantidad, promoPrecio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const result = stmt.run(
    productData.codigo,
    productData.descripcion,
    productData.precio,
    productData.inventario || 0,
    productData.receta || null,
    productData.peso || null,
    productData.promoNombre || null,
    productData.promoCantidad || null,
    productData.promoPrecio || null
  )

  return db.prepare('SELECT * FROM productos WHERE codigo = ?').get(productData.codigo)
}

function updateProduct(codigo, updates) {
  const stmt = db.prepare(`
    UPDATE productos
    SET descripcion = ?, precio = ?, inventario = ?, receta = ?, peso = ?, promoNombre = ?, promoCantidad = ?, promoPrecio = ?
    WHERE codigo = ?
  `)

  const result = stmt.run(
    updates.descripcion,
    updates.precio,
    updates.inventario,
    updates.receta || null,
    updates.peso || null,
    updates.promoNombre || null,
    updates.promoCantidad || null,
    updates.promoPrecio || null,
    codigo
  )

  if (result.changes === 0) {
    throw new Error('Producto no encontrado')
  }

  return db.prepare('SELECT * FROM productos WHERE codigo = ?').get(codigo)
}

function inactiveProduct(codigo) {
  const stmt = db.prepare('UPDATE productos SET activo = 0 WHERE codigo = ?')
  const result = stmt.run(codigo)

  if (result.changes === 0) {
    throw new Error('Producto no encontrado')
  }

  return { message: 'Producto inactivado' }
}

// Recetas
function getRecipes() {
  const stmt = db.prepare('SELECT * FROM recetas ORDER BY codigo')
  return stmt.all()
}

function addRecipe(recipeData) {
  if (!recipeData.codigo || !recipeData.nombre) {
    throw new Error('Faltan campos requeridos')
  }

  const stmt = db.prepare(`
    INSERT INTO recetas (codigo, nombre, ingredientes, instrucciones, tiempo)
    VALUES (?, ?, ?, ?, ?)
  `)

  stmt.run(
    recipeData.codigo,
    recipeData.nombre,
    recipeData.ingredientes || null,
    recipeData.instrucciones || null,
    recipeData.tiempo || null
  )

  return db.prepare('SELECT * FROM recetas WHERE codigo = ?').get(recipeData.codigo)
}

function updateRecipe(codigo, updates) {
  const stmt = db.prepare(`
    UPDATE recetas
    SET nombre = ?, ingredientes = ?, instrucciones = ?, tiempo = ?
    WHERE codigo = ?
  `)

  const result = stmt.run(
    updates.nombre,
    updates.ingredientes || null,
    updates.instrucciones || null,
    updates.tiempo || null,
    codigo
  )

  if (result.changes === 0) {
    throw new Error('Receta no encontrada')
  }

  return db.prepare('SELECT * FROM recetas WHERE codigo = ?').get(codigo)
}

function deleteRecipe(codigo) {
  const stmt = db.prepare('DELETE FROM recetas WHERE codigo = ?')
  const result = stmt.run(codigo)

  if (result.changes === 0) {
    throw new Error('Receta no encontrada')
  }

  return { message: 'Receta eliminada' }
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
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
      const clients = getClients()
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
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        console.log('POST /api/clients - Datos recibidos:', body)
        if (!body) {
          res.writeHead(400)
          res.end(JSON.stringify({ error: 'Body vacío' }))
          return
        }
        const clientData = JSON.parse(body)
        console.log('Datos parseados:', clientData)
        const newClient = addClient(clientData)
        console.log('Cliente guardado exitosamente:', newClient.id)
        res.writeHead(201)
        res.end(JSON.stringify(newClient))
      } catch (err) {
        console.error('Error en POST:', err.message)
        res.writeHead(400)
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    req.on('error', err => {
      console.error('Error en request:', err.message)
      res.writeHead(500)
      res.end(JSON.stringify({ error: 'Request error' }))
    })
    return
  }

  // PUT /api/clients/:id
  const putMatch = req.url.match(/^\/api\/clients\/(\d+)$/)
  if (putMatch && req.method === 'PUT') {
    const clientId = parseInt(putMatch[1])
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        console.log('PUT /api/clients/:id - Datos recibidos:', body)
        if (!body) {
          res.writeHead(400)
          res.end(JSON.stringify({ error: 'Body vacío' }))
          return
        }
        const updateData = JSON.parse(body)
        console.log('Datos parseados:', updateData)
        const updatedClient = updateClient(clientId, updateData)
        console.log('Cliente actualizado exitosamente:', clientId)
        res.writeHead(200)
        res.end(JSON.stringify(updatedClient))
      } catch (err) {
        console.error('Error en PUT:', err.message)
        res.writeHead(400)
        res.end(JSON.stringify({ error: err.message }))
      }
    })
    req.on('error', err => {
      console.error('Error en request:', err.message)
      res.writeHead(500)
      res.end(JSON.stringify({ error: 'Request error' }))
    })
    return
  }

  // GET /api/products
  if (req.url === '/api/products' && req.method === 'GET') {
    try {
      const products = getProducts()
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
    req.on('end', () => {
      try {
        const productData = JSON.parse(body)
        const newProduct = addProduct(productData)
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
    req.on('end', () => {
      try {
        const updateData = JSON.parse(body)
        const updatedProduct = updateProduct(codigo, updateData)
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
      const result = inactiveProduct(codigo)
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
      const recipes = getRecipes()
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
    req.on('end', () => {
      try {
        const recipeData = JSON.parse(body)
        const newRecipe = addRecipe(recipeData)
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
    req.on('end', () => {
      try {
        const updateData = JSON.parse(body)
        const updatedRecipe = updateRecipe(codigo, updateData)
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
      const result = deleteRecipe(codigo)
      res.writeHead(200)
      res.end(JSON.stringify(result))
    } catch (err) {
      console.error('DELETE /api/recipes error:', err.message)
      res.writeHead(400)
      res.end(JSON.stringify({ error: err.message }))
    }
    return
  }

  res.writeHead(404)
  res.end(JSON.stringify({ error: 'Not found' }))
})

const API_PORT = 3002
server.listen(API_PORT, () => {
  console.log(`✅ API Server corriendo en http://localhost:${API_PORT}`)
})

server.on('error', (err) => {
  console.error('Server error:', err.message)
})
