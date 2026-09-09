import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'codex.db')

console.log('🔄 Agregando columna activo a tabla productos...\n')

const db = new Database(dbPath)

try {
  // Agregar columna activo (por defecto true)
  db.exec(`
    ALTER TABLE productos ADD COLUMN activo INTEGER DEFAULT 1;
  `)
  console.log('✅ Columna activo agregada correctamente')

  // Verificar
  const count = db.prepare('SELECT COUNT(*) as c FROM productos').get().c
  console.log(`✅ Total de productos activos: ${count}`)
} catch (err) {
  if (err.message.includes('duplicate column')) {
    console.log('ℹ️  La columna activo ya existe')
  } else {
    console.error('❌ Error:', err.message)
  }
}

db.close()
console.log('\n✅ Migración completada')
