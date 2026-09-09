import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'codex.db')

console.log('🔄 Iniciando migración de clientes a SQLite...\n')

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

let clientesCount = 0

// Migrar clientes desde clientes.txt
const clientesFilePath = path.join(__dirname, 'clientes.txt')

if (fs.existsSync(clientesFilePath)) {
  console.log('👤 Leyendo: clientes.txt')
  try {
    const fileContent = fs.readFileSync(clientesFilePath, 'utf-8')
    const lines = fileContent.trim().split('\n')

    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO clientes
      (id, nombre, celular, edad, correo, descuento, fecha)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    for (const line of lines) {
      if (!line.trim()) continue

      try {
        // Remover número de línea si existe
        let jsonStr = line.trim()
        if (/^\d+\t/.test(jsonStr)) {
          jsonStr = jsonStr.split('\t')[1]
        }

        const clientData = JSON.parse(jsonStr)

        if (clientData.nombre) {
          const id = clientData.id || Date.now()
          const nombre = String(clientData.nombre).trim()
          const celular = String(clientData.celular || '').trim()
          const edad = String(clientData.edad || '').trim()
          const correo = String(clientData.correo || '').trim()
          const descuento = parseInt(clientData.descuento) || 0
          const fecha = clientData.fecha || new Date().toISOString()

          insertStmt.run(id, nombre, celular, edad, correo, descuento, fecha)
          clientesCount++
        }
      } catch (err) {
        console.warn(`  ⚠️  Error parsando línea: ${line.substring(0, 50)}...`)
      }
    }

    console.log(`  ✅ ${clientesCount} clientes insertados\n`)
  } catch (err) {
    console.error(`  ❌ Error: ${err.message}\n`)
  }
} else {
  console.log('  ⚠️  Archivo clientes.txt no encontrado\n')
}

db.close()

console.log('✅ Migración completada!')
console.log(`   👤 Clientes: ${clientesCount}`)
