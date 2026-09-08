function TableSelector({ onSelectTable, orders, onClearTable, onShowClientRegistration }) {
  const tables = Array.from({ length: 15 }, (_, i) => ({
    id: `mesa-${i + 1}`,
    name: `Mesa ${i + 1}`,
    type: 'table'
  }))

  const barSeats = Array.from({ length: 10 }, (_, i) => ({
    id: `barra-${i + 1}`,
    name: `Barra ${i + 1}`,
    type: 'bar'
  }))

  const allLocations = [...tables, ...barSeats]

  const getLocationStatus = (locationId) => {
    return orders[locationId]?.length > 0
  }

  const getTotalItems = (locationId) => {
    return orders[locationId]?.reduce((sum, item) => sum + item.cantidad, 0) || 0
  }

  return (
    <div className="table-selector">
      <div className="section">
        <h3>🪑 Mesas</h3>
        <div className="tables-grid">
          {tables.map(table => (
            <div key={table.id} className="location-container">
              <button
                className={`location-btn ${getLocationStatus(table.id) ? 'occupied' : ''}`}
                onClick={() => onSelectTable(table)}
              >
                <span className="location-name">{table.name}</span>
                {getLocationStatus(table.id) && (
                  <span className="item-count">{getTotalItems(table.id)} items</span>
                )}
              </button>
              {getLocationStatus(table.id) && (
                <button
                  className="clear-btn"
                  onClick={() => onClearTable(table.id)}
                  title="Limpiar mesa"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="section bar">
        <h3>🍹 Barra</h3>
        <div className="bar-grid">
          {barSeats.map(seat => (
            <div key={seat.id} className="location-container">
              <button
                className={`location-btn bar ${getLocationStatus(seat.id) ? 'occupied' : ''}`}
                onClick={() => onSelectTable(seat)}
              >
                <span className="location-name">{seat.name}</span>
                {getLocationStatus(seat.id) && (
                  <span className="item-count">{getTotalItems(seat.id)} items</span>
                )}
              </button>
              {getLocationStatus(seat.id) && (
                <button
                  className="clear-btn"
                  onClick={() => onClearTable(seat.id)}
                  title="Limpiar lugar"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TableSelector
