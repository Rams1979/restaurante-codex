import Database from 'better-sqlite3'
import XLSX from 'xlsx'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'codex.db')

console.log('🔄 Iniciando migración de Excel a SQLite...\n')

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

let productosCount = 0
let recetasCount = 0

// Migrar productos
const productosFiles = ['productos.xlsx', path.join('codex-pos', 'productos.xlsx')]
for (const file of productosFiles) {
  const filePath = path.join(__dirname, file)
  if (fs.existsSync(filePath)) {
    console.log(`📦 Leyendo: ${file}`)
    try {
      const workbook = XLSX.readFile(filePath)
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      const insertStmt = db.prepare(`
        INSERT OR REPLACE INTO productos
        (codigo, descripcion, precio, inventario, receta, peso, promoNombre, promoCantidad, promoPrecio)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      for (const row of jsonData) {
        if (row.codigo || row.Codigo) {
          const codigo = String(row.codigo || row.Codigo || '').trim()
          const descripcion = String(row.descripcion || row.Descripcion || '').trim()
          const precio = parseFloat(row.precio || row.Precio || 0)
          const inventario = parseInt(row.inventario || row.Inventario || 0)
          const receta = String(row.receta || row.Receta || '').trim() || null
          const peso = String(row.peso || row.Peso || '').trim() || null
          const promoNombre = String(row.promoNombre || row.PromoNombre || '').trim() || null
          const promoCantidad = parseInt(row.promoCantidad || row.PromoCantidad || 0) || null
          const promoPrecio = (row.promoPrecio || row.PromoPrecio) ? parseFloat(row.promoPrecio || row.PromoPrecio) : (promoCantidad ? precio * promoCantidad : null)

          insertStmt.run(codigo, descripcion, precio, inventario, receta, peso, promoNombre, promoCantidad, promoPrecio)
          productosCount++
        }
      }
      console.log(`  ✅ ${productosCount} productos insertados\n`)
      break
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}\n`)
    }
  }
}

// Migrar recetas
const recetasFiles = ['recetas.xlsx', path.join('codex-pos', 'recetas.xlsx')]
for (const file of recetasFiles) {
  const filePath = path.join(__dirname, file)
  if (fs.existsSync(filePath)) {
    console.log(`🍹 Leyendo: ${file}`)
    try {
      const workbook = XLSX.readFile(filePath, { raw: false })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      const insertStmt = db.prepare(`
        INSERT OR REPLACE INTO recetas
        (codigo, nombre, ingredientes, instrucciones, tiempo)
        VALUES (?, ?, ?, ?, ?)
      `)

      for (const row of jsonData) {
        // Manejar columnas con clave única (CSV en una línea)
        const rowStr = Object.keys(row)[0]
        let codigo, nombre, ingredientes, instrucciones, tiempo

        if (rowStr && rowStr.includes(',')) {
          const parts = rowStr.split(',')
          codigo = parts[0] || ''
          nombre = parts[1] || ''
          ingredientes = parts[2] ? parts[2].replace(/"/g, '').trim() : null
          instrucciones = parts[3] ? parts[3].replace(/"/g, '').trim() : null
          tiempo = parts[4] ? parts[4].replace(/"/g, '').trim() : null
        } else {
          codigo = String(row.codigo || row.Codigo || '').trim()
          nombre = String(row.nombre || row.Nombre || '').trim()
          ingredientes = String(row.ingredientes || row.Ingredientes || '').trim() || null
          instrucciones = String(row.instrucciones || row.Instrucciones || '').trim() || null
          tiempo = String(row.tiempo || row.Tiempo || '').trim() || null
        }

        if (codigo) {
          insertStmt.run(codigo, nombre, ingredientes, instrucciones, tiempo)
          recetasCount++
        }
      }
      console.log(`  ✅ ${recetasCount} recetas insertadas\n`)
      break
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}\n`)
    }
  }
}

db.close()

console.log('✅ Migración completada!')
console.log(`   📦 Productos: ${productosCount}`)
console.log(`   🍹 Recetas: ${recetasCount}`)
