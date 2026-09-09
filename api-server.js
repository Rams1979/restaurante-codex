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
