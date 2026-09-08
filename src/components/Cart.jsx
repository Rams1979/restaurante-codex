function Cart({ items, tableInfo, locationType, clientInfo, onRemove, onUpdateQuantity, onClear }) {
  console.log('Cart items recibidos:', items)
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.isPromo ? item.promoPrecio : item.precio
    return sum + itemPrice * item.cantidad
  }, 0)

  const impuesto = subtotal * 0.13
  const servicio = locationType === 'table' ? subtotal * 0.10 : 0
  const total = subtotal + impuesto + servicio

  const handlePrint = () => {
    window.print()
    setTimeout(() => {
      onClear()
    }, 500)
  }

  const handleCloseSale = () => {
    if (confirm('¿Cobrar esta orden?')) {
      alert(`✅ Orden de ${tableInfo} cobrada por $${total.toFixed(2)}`)
      onClear()
    }
  }

  return (
    <div className="cart">
      <div className="print-header">
        <h1>🍽️ Restaurante Codex</h1>
        <p className="print-subtitle">Ticket de Venta</p>
        <p className="print-location">{tableInfo}</p>
        {clientInfo?.nombre && !clientInfo.isContado && (
          <div className="print-client-info">
            <p><strong>Cliente:</strong> {clientInfo.nombre}</p>
            {clientInfo.celular && <p><strong>Celular:</strong> {clientInfo.celular}</p>}
            {clientInfo.correo && <p><strong>Correo:</strong> {clientInfo.correo}</p>}
          </div>
        )}
        <p className="print-datetime">
          {new Date().toLocaleDateString('es-ES')} - {new Date().toLocaleTimeString('es-ES')}
        </p>
      </div>

      <div className="cart-header">
        <div>
          <h2>📋 Orden</h2>
          <p className="table-label">{tableInfo}</p>
          {clientInfo?.nombre && (
            <p className="client-label">👤 {clientInfo.isContado ? 'Cliente de Contado' : clientInfo.nombre}</p>
          )}
        </div>
        <span className="cart-count">{items.length}</span>
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">
          <p>El carrito está vacío</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map(item => {
              const isPromo = item.isPromo || false
              const itemPrice = isPromo ? item.promoPrecio : item.precio
              const itemDesc = isPromo ? `🎁 ${item.promoNombre}` : item.descripcion
              return (
              <div key={`${item.codigo}-${isPromo}`} className={`cart-item ${isPromo ? 'promo-item' : ''}`}>
                <div className="item-info">
                  <p className="item-code">{item.codigo}</p>
                  <p className="item-desc">{itemDesc}</p>
                  <p className="item-price">${itemPrice.toFixed(2)}</p>
                </div>

                <div className="item-quantity">
                  <button
                    onClick={() => onUpdateQuantity(item.codigo, item.cantidad - 1, isPromo)}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={item.cantidad}
                    onChange={(e) => onUpdateQuantity(item.codigo, parseInt(e.target.value) || 0, isPromo)}
                    className="qty-input"
                  />
                  <button
                    onClick={() => onUpdateQuantity(item.codigo, item.cantidad + 1, isPromo)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  ${(itemPrice * item.cantidad).toFixed(2)}
                </div>

                <button
                  onClick={() => onRemove(item.codigo, isPromo)}
                  className="remove-btn"
                >
                  ✕
                </button>
              </div>
            )
            })}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Impuesto (13%):</span>
              <span>${impuesto.toFixed(2)}</span>
            </div>
            {locationType === 'table' && (
              <div className="summary-row">
                <span>Servicio (10%):</span>
                <span>${servicio.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="cart-actions">
            <button onClick={handlePrint} className="btn btn-print">
              🖨️ Imprimir
            </button>
            <button onClick={handleCloseSale} className="btn btn-close">
              💰 Cobrar
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
