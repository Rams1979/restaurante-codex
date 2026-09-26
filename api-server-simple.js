import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pkg from 'pg'
const { Pool } = pkg

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, 'dist')

console.log('🚀 API Server iniciando...')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function initializeDatabase() {
  const client = await pool.connect()
  try {
    console.log('🔄 Inicializando tablas...')

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
    console.log('✅ Tabla clientes OK')

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
    console.log('✅ Tabla productos OK')

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
    console.log('✅ Tabla recetas OK')

    console.log('✅✅✅ Base de datos lista')
  } catch (err) {
    console.error('❌ Error:', err.message)
  } finally {
    client.release()
  }
}

await initializeDatabase()

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  // API: GET /api/products
  if (req.url === '/api/products' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify([]))
    return
  }

  // API: GET /api/clients
  if (req.url === '/api/clients' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify([]))
    return
  }

  // Servir index.html para SPA
  if (req.method === 'GET') {
    const filePath = path.join(distPath, 'index.html')
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(content)
      return
    } catch (err) {
      console.error('Error sirviendo HTML:', err)
    }
  }

  res.writeHead(404)
  res.end(JSON.stringify({ error: 'Not found' }))
})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log(`✅ API Server corriendo en puerto ${PORT}`)
})
