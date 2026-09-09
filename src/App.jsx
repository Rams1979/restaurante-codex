import { useState } from 'react'
import FileUpload from './components/FileUpload'
import TableSelector from './components/TableSelector'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import RecipeModal from './components/RecipeModal'
import ClientRegistration from './components/ClientRegistration'
import ClientSelector from './components/ClientSelector'
import ProductsManager from './components/ProductsManager'
import RecipesManager from './components/RecipesManager'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [recipes, setRecipes] = useState({})
  const [selectedTable, setSelectedTable] = useState(null)
  const [orders, setOrders] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [recipeToShow, setRecipeToShow] = useState(null)
  const [inventoryUsed, setInventoryUsed] = useState({})
  const [showClientRegistration, setShowClientRegistration] = useState(false)
  const [showClientSelector, setShowClientSelector] = useState(false)
  const [selectedClient, setSelectedClient] = useState({})
  const [showProductsManager, setShowProductsManager] = useState(false)
  const [showRecipesManager, setShowRecipesManager] = useState(false)

  const handleFileUpload = (uploadedProducts) => {
    setProducts(uploadedProducts)
  }

  const handleLoadRecipes = (uploadedRecipes) => {
    setRecipes(uploadedRecipes)
  }

  const handleSelectTable = (table) => {
    setSelectedTable(table)
    setShowClientSelector(true)
    setSearchTerm('')
  }

  const handleClientSelected = (client) => {
    setSelectedClient(client)
    setShowClientSelector(false)
  }

  const handleClientRegistered = (client) => {
    setSelectedClient(client)
    setShowClientRegistration(false)
  }

  const handleBackToTables = () => {
    setSelectedTable(null)
  }

  const filteredProducts = products.filter(p =>
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (product) => {
    if (!selectedTable) return

    // Si el producto tiene receta, mostrarla
    if (product.receta && recipes[product.receta] && !product.isPromo) {
      setRecipeToShow({ product, recipe: recipes[product.receta] })
    }

    const tableCart = orders[selectedTable.id] || []
    const isPromo = product.isPromo || false
    const quantityToUse = isPromo ? product.promoCantidad : 1

    // Para promos, buscar por código + isPromo
    const existingItem = tableCart.find(item => item.codigo === product.codigo && item.isPromo === isPromo)
    const currentUsed = inventoryUsed[product.codigo] || 0
    const availableInventory = product.inventario - currentUsed

    if (availableInventory < quantityToUse) return

    const newCart = existingItem
      ? tableCart.map(item =>
          item.codigo === product.codigo && item.isPromo === isPromo && item.cantidad < availableInventory / quantityToUse
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      : [...tableCart, { ...product, cantidad: 1, isPromo }]

    const newUsed = existingItem
      ? inventoryUsed[product.codigo] + quantityToUse
      : (inventoryUsed[product.codigo] || 0) + quantityToUse

    setInventoryUsed({
      ...inventoryUsed,
      [product.codigo]: newUsed
    })

    setOrders({
      ...orders,
      [selectedTable.id]: newCart
    })
  }

  const removeFromCart = (codigo, isPromo = false) => {
    if (!selectedTable) return

    const tableCart = orders[selectedTable.id] || []
    const itemToRemove = tableCart.find(item => item.codigo === codigo && item.isPromo === isPromo)

    if (itemToRemove) {
      const quantityToRemove = isPromo ? itemToRemove.cantidad * itemToRemove.promoCantidad : itemToRemove.cantidad
      const newUsed = Math.max(0, (inventoryUsed[codigo] || 0) - quantityToRemove)
      setInventoryUsed({
        ...inventoryUsed,
        [codigo]: newUsed
      })
    }

    const newCart = tableCart.filter(item => !(item.codigo === codigo && item.isPromo === isPromo))
    setOrders({
      ...orders,
      [selectedTable.id]: newCart
    })
  }

  const updateQuantity = (codigo, cantidad, isPromo = false) => {
    if (!selectedTable) return

    if (cantidad <= 0) {
      removeFromCart(codigo, isPromo)
    } else {
      const tableCart = orders[selectedTable.id] || []
      const product = products.find(p => p.codigo === codigo)
      const currentItem = tableCart.find(item => item.codigo === codigo && item.isPromo === isPromo)
      const currentUsed = inventoryUsed[codigo] || 0
      const availableInventory = product.inventario - currentUsed
      const quantityUnit = isPromo ? product.promoCantidad : 1
      const maxQuantity = Math.floor(availableInventory / quantityUnit) + (currentItem?.cantidad || 0)

      if (cantidad <= maxQuantity) {
        const oldQuantity = currentItem?.cantidad || 0
        const quantityDifference = (cantidad - oldQuantity) * quantityUnit

        const newCart = tableCart.map(item =>
          item.codigo === codigo && item.isPromo === isPromo
            ? { ...item, cantidad }
            : item
        )

        setInventoryUsed({
          ...inventoryUsed,
          [codigo]: Math.max(0, currentUsed + quantityDifference)
        })

        setOrders({
          ...orders,
          [selectedTable.id]: newCart
        })
      }
    }
  }

  const clearTable = (tableId) => {
    const newOrders = { ...orders }
    delete newOrders[tableId]
    setOrders(newOrders)
    if (selectedTable?.id === tableId) {
      handleBackToTables()
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🍽️ Restaurante Codex</h1>
      </header>

      {recipeToShow && (
        <RecipeModal
          product={recipeToShow.product}
          recipe={recipeToShow.recipe}
          onClose={() => setRecipeToShow(null)}
        />
      )}

      {showClientRegistration && (
        <ClientRegistration
          onClientRegistered={handleClientRegistered}
          onCancel={() => setShowClientRegistration(false)}
        />
      )}

      {showClientSelector && (
        <ClientSelector
          onSelectClient={handleClientSelected}
          onCancel={() => {
            setShowClientSelector(false)
            setSelectedTable(null)
          }}
        />
      )}

      {showProductsManager && (
        <ProductsManager onClose={() => setShowProductsManager(false)} />
      )}

      {showRecipesManager && (
        <RecipesManager onClose={() => setShowRecipesManager(false)} />
      )}

      <div className="container">
        {!selectedTable ? (
          <>
            <div className="top-buttons">
              <FileUpload
                onFileUpload={handleFileUpload}
                onLoadRecipes={handleLoadRecipes}
                onShowProductsManager={() => setShowProductsManager(true)}
                onShowRecipesManager={() => setShowRecipesManager(true)}
              />
              <button
                className="btn-new-client-top"
                onClick={() => setShowClientRegistration(true)}
                title="Registrar nuevo cliente"
              >
                ➕ Nuevo Cliente
              </button>
            </div>
            {products.length > 0 && (
              <TableSelector
                onSelectTable={handleSelectTable}
                orders={orders}
                onClearTable={clearTable}
                onShowClientRegistration={() => setShowClientRegistration(true)}
              />
            )}
            {products.length === 0 && (
              <div className="empty-state">
                <p>Carga un archivo Excel para comenzar</p>
              </div>
            )}
          </>
        ) : (
          <div className="main-content">
            <div className="products-section">
              <div className="top-bar">
                <button className="back-btn" onClick={handleBackToTables}>
                  ← Mesas
                </button>
                <div>
                  <h2 className="table-title">{selectedTable.name}</h2>
                  {selectedClient?.nombre && (
                    <p className="client-title">👤 {selectedClient.isContado ? 'Cliente de Contado' : selectedClient.nombre}</p>
                  )}
                </div>
              </div>

              <div className="search-box">
                <input
                  type="text"
                  placeholder="Buscar por código o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <ProductList
                products={filteredProducts}
                onAddToCart={addToCart}
                recipes={recipes}
                inventoryUsed={inventoryUsed}
                onShowRecipe={(product) => {
                  if (product.receta && recipes[product.receta]) {
                    setRecipeToShow({ product, recipe: recipes[product.receta] })
                  }
                }}
              />
            </div>

            <Cart
              items={orders[selectedTable.id] || []}
              tableInfo={selectedTable.name}
              locationType={selectedTable.type}
              clientInfo={selectedClient}
              onRemove={removeFromCart}
              onUpdateQuantity={updateQuantity}
              onClear={() => clearTable(selectedTable.id)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
