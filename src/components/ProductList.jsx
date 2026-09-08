function ProductList({ products, onAddToCart, recipes = {}, onShowRecipe, inventoryUsed = {} }) {
  return (
    <div className="product-list">
      <h2>Productos ({products.length})</h2>
      <div className="products-grid">
        {products.map(product => {
          const availableInventory = product.inventario - (inventoryUsed[product.codigo] || 0)
          return (
          <div
            key={product.codigo}
            className={`product-card ${availableInventory <= 0 ? 'out-of-stock' : ''}`}
          >
            <div className="product-header">
              <span className="product-code">{product.codigo}</span>
              {product.receta && recipes[product.receta] && (
                <button
                  className="recipe-badge"
                  onClick={() => onShowRecipe(product)}
                  title="Ver receta"
                >
                  🍹
                </button>
              )}
              <span className={`stock-badge ${availableInventory === 0 ? 'low' : 'available'}`}>
                {availableInventory} disponibles
              </span>
            </div>

            <h3 className="product-description">{product.descripcion}</h3>
            {product.peso && (
              <p className="product-peso">Peso: {product.peso}</p>
            )}

            {product.promoNombre && product.promoCantidad > 0 && (
              <div className="product-promo">
                <p className="promo-name">🎁 {product.promoNombre}</p>
                <p className="promo-info">{product.promoCantidad} x ₡{product.precio.toFixed(2)} = ₡{product.promoPrecio.toFixed(2)}</p>
                <button
                  className="add-button promo-button"
                  onClick={() => onAddToCart({ ...product, isPromo: true })}
                  disabled={availableInventory < product.promoCantidad}
                >
                  {availableInventory < product.promoCantidad ? 'Sin stock' : 'Promo'}
                </button>
              </div>
            )}

            <div className="product-footer">
              <span className="product-price">
                ₡{product.precio.toFixed(2)}
              </span>
              <button
                className="add-button"
                onClick={() => onAddToCart(product)}
                disabled={availableInventory <= 0}
              >
                {availableInventory <= 0 ? 'Agotado' : 'Agregar'}
              </button>
            </div>
          </div>
        )
        })}
      </div>
    </div>
  )
}

export default ProductList
