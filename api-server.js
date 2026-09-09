import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CLIENTS_FILE = path.join(__dirname, 'clientes.txt')

console.log('API Server iniciando...')
console.log('Directorio de trabajo:', __dirname)
console.log('Archivo de clientes:', CLIENTS_FILE)

function readClients() {
  try {
    if (!fs.existsSync(CLIENTS_FILE)) {
      console.log('Archivo de clientes no existe, creando archivo vacío')
      fs.writeFileSync(CLIENTS_FILE, '', 'utf-8')
      return []
    }
    const data = fs.readFileSync(CLIENTS_FILE, 'utf-8')
    if (!data.trim()) return []
    return data.trim().split('\n').filter(line => line.trim()).map(line => {
      try {
        return JSON.parse(line)
      } catch (e) {
        console.warn('Línea inválida en clientes.txt:', line)
        return null
      }
    }).filter(c => c !== null)
  } catch (err) {
    console.error('Error leyendo clientes:', err.message)
    return []
  }
}

function saveClient(client) {
  try {
    if (!client.nombre || !client.celular || !client.edad || !client.correo) {
      throw new Error('Faltan campos requeridos')
    }

    let descuento = parseInt(client.descuento) || 0
    if (descuento < 0 || descuento > 10) {
      throw new Error('El descuento debe estar entre 0 y 10')
    }

    const clients = readClients()
    const newClient = {
      id: Date.now(),
      nombre: client.nombre,
      celular: client.celular,
      edad: client.edad,
      correo: client.correo,
      descuento: descuento,
      fecha: new Date().toISOString()
    }
    clients.push(newClient)

    const lines = clients.map(c => JSON.stringify(c))
    fs.writeFileSync(CLIENTS_FILE, lines.join('\n') + '\n', 'utf-8')

    console.log('Cliente guardado:', newClient.id)
    return newClient
  } catch (err) {
    console.error('Error guardando cliente:', err.message)
    throw err
  }
}

function updateClient(clientId, updates) {
  try {
    const clients = readClients()
    const clientIndex = clients.findIndex(c => c.id === clientId)

    if (clientIndex === -1) {
      throw new Error('Cliente no encontrado')
    }

    const client = clients[clientIndex]

    // Solo actualizar campos permitidos (no el nombre ni el ID)
    if (updates.celular !== undefined) client.celular = updates.celular
    if (updates.edad !== undefined) client.edad = updates.edad
    if (updates.correo !== undefined) client.correo = updates.correo
    if (updates.descuento !== undefined) {
      let descuento = parseInt(updates.descuento) || 0
      if (descuento < 0 || descuento > 10) {
        throw new Error('El descuento debe estar entre 0 y 10')
      }
      client.descuento = descuento
    }

    const lines = clients.map(c => JSON.stringify(c))
    fs.writeFileSync(CLIENTS_FILE, lines.join('\n') + '\n', 'utf-8')

    console.log('Cliente actualizado:', clientId)
    return client
  } catch (err) {
    console.error('Error actualizando cliente:', err.message)
    throw err
  }
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

  if (req.url === '/api/clients' && req.method === 'GET') {
    try {
      const clients = readClients()
      res.writeHead(200)
      res.end(JSON.stringify(clients))
    } catch (err) {
      console.error('GET error:', err)
      res.writeHead(500)
      res.end(JSON.stringify({ error: 'Server error' }))
    }
    return
  }

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
        const newClient = saveClient(clientData)
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
