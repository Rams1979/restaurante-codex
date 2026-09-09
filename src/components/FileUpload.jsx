import { useRef } from 'react'
import * as XLSX from 'xlsx'

function FileUpload({ onFileUpload, onLoadRecipes, onShowProductsManager, onShowRecipesManager }) {
  const fileInputRef = useRef(null)
  const recipeFileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = event.target.result
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        console.log('Datos de productos cargados:', jsonData)

        const products = jsonData
          .filter(row => row.codigo || row.Codigo)
          .map(row => {
            const codigo = String(row.codigo || row.Codigo || '').trim()
            const descripcion = String(row.descripcion || row.Descripcion || '').trim()
            const precio = parseFloat(row.precio || row.Precio || 0)
            const inventario = parseInt(row.inventario || row.Inventario || 0)
            const receta = String(row.receta || row.Receta || '').trim()
            const peso = String(row.peso || row.Peso || '').trim()
            const promoNombre = String(row.promoNombre || row.PromoNombre || '').trim()
            const promoCantidad = parseInt(row.promoCantidad || row.PromoCantidad || 0)
            const promoPrecio = row.promoPrecio || row.PromoPrecio ? parseFloat(row.promoPrecio || row.PromoPrecio) : precio * promoCantidad

            return { codigo, descripcion, precio, inventario, receta, peso, promoNombre, promoCantidad, promoPrecio }
          })

        console.log('Productos procesados:', products)

        if (products.length === 0) {
          alert('No se encontraron productos válidos en el archivo')
          return
        }

        onFileUpload(products)
        alert(`✅ Se cargaron ${products.length} productos`)
      } catch (error) {
        console.error('Error:', error)
        alert('Error al leer el archivo: ' + error.message)
      }
    }

    reader.readAsArrayBuffer(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRecipeFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = event.target.result
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        const recipes = {}
        jsonData.forEach(row => {
          const codigo = String(row.codigo || row.Codigo || '').trim()
          if (codigo) {
            recipes[codigo] = {
              nombre: String(row.nombre || row.Nombre || '').trim(),
              ingredientes: String(row.ingredientes || row.Ingredientes || '').trim(),
              instrucciones: String(row.instrucciones || row.Instrucciones || '').trim(),
              tiempo: String(row.tiempo || row.Tiempo || '').trim()
            }
          }
        })

        console.log('Recetas cargadas:', recipes)
        onLoadRecipes(recipes)
        alert(`✅ Se cargaron ${Object.keys(recipes).length} recetas`)
      } catch (error) {
        console.error('Error:', error)
        alert('Error al leer el archivo de recetas: ' + error.message)
      }
    }

    reader.readAsArrayBuffer(file)
    if (recipeFileInputRef.current) recipeFileInputRef.current.value = ''
  }

  return (
    <div className="file-upload">
      <div className="upload-buttons">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            id="file-input"
          />
          <label htmlFor="file-input" className="upload-button">
            📁 Cargar Productos
          </label>
        </div>
        <div>
          <input
            ref={recipeFileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleRecipeFileChange}
            id="recipe-input"
          />
          <label htmlFor="recipe-input" className="upload-button">
            📖 Cargar Recetas
          </label>
        </div>
        <button className="upload-button" onClick={onShowProductsManager}>
          📦 Gestionar Productos
        </button>
        <button className="upload-button" onClick={onShowRecipesManager}>
          🍹 Gestionar Recetas
        </button>
      </div>
    </div>
  )
}

export default FileUpload
