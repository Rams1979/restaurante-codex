import { useState, useEffect } from 'react'
import FileUpload from './components/FileUpload'
import TableSelector from './components/TableSelector'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import RecipeModal from './components/RecipeModal'
import ClientRegistration from './components/ClientRegistration'
import ClientSelector from './components/ClientSelector'
import ProductsManager from './components/ProductsManager'
import RecipesManager from './components/RecipesManager'
import OpenCashRegister from './components/OpenCashRegister'
import CashRegisterDashboard from './components/CashRegisterDashboard'
import CloseCashRegister from './components/CloseCashRegister'
import CashRegisterHistory from './components/CashRegisterHistory'
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
  const [showOpenCash, setShowOpenCash] = useState(false)
  const [showCashDashboard, setShowCashDashboard] = useState(false)
  const [showCloseCash, setShowCloseCash] = useState(false)
  const [showCashHistory, setShowCashHistory] = useState(false)
  const [currentCaja, setCurrentCaja] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (err) {
        console.error('Error loading products:', err)
      }
    }
    loadProducts()

    const loadCurrentCaja = async () => {
      try {
        const response = await fetch('/api/cash-register/current')
        if (response.ok) {
          const data = await response.json()
          if (data && data.id) {
            setCurrentCaja(data)
          }
        }
      } catch (err) {
        console.error('Error loading cash register:', err)
      }
    }
    loadCurrentCaja()
  }, [])

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

  const handleOpenCash = (caja) => {
    setCurrentCaja(caja)
    setShowOpenCash(false)
    setShowCashDashboard(true)
  }

  const handleCloseCashSuccess = (caja) => {
    setShowCloseCash(false)
    setShowCashDashboard(false)
    setCurrentCaja(null)
  }

  const parseProduct = (product) => ({
    ...product,
    precio: parseFloat(product.precio),
    promoPrecio: product.promoPrecio ? parseFloat(product.promoPrecio) : null,
    inventario: parseInt(product.inventario) || 0
  })

  const parsedProducts = products.map(parseProduct)

  const filteredProducts = parsedProducts.filter(p =>
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

      {showOpenCash && (
        <OpenCashRegister
          onCashOpened={handleOpenCash}
          onCancel={() => setShowOpenCash(false)}
        />
      )}

      {showCashDashboard && currentCaja && (
        <CashRegisterDashboard
          caja={currentCaja}
          onClose={() => setShowCashDashboard(false)}
          onShowCloseCash={() => setShowCloseCash(true)}
          onShowHistory={() => setShowCashHistory(true)}
        />
      )}

      {showCloseCash && currentCaja && (
        <CloseCashRegister
          caja={currentCaja}
          onClosed={handleCloseCashSuccess}
          onCancel={() => setShowCloseCash(false)}
        />
      )}

      {showCashHistory && (
        <CashRegisterHistory onClose={() => setShowCashHistory(false)} />
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
              {!currentCaja ? (
                <button
                  className="btn-cash-register"
                  onClick={() => setShowOpenCash(true)}
                  title="Abrir caja de pago"
                >
                  🏪 Abrir Caja
                </button>
              ) : (
                <button
                  className="btn-cash-register active"
                  onClick={() => setShowCashDashboard(true)}
                  title="Ver estado de caja"
                >
                  💰 Caja Abierta (#{currentCaja.id})
                </button>
              )}
            </div>
            <TableSelector
              onSelectTable={handleSelectTable}
              orders={orders}
              onClearTable={clearTable}
              onShowClientRegistration={() => setShowClientRegistration(true)}
            />
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
