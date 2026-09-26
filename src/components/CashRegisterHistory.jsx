import { useState, useEffect } from 'react'

export default function CashRegisterHistory({ onClose }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch('/api/cash-register/history')
        if (!response.ok) throw new Error('Error cargando historial')
        const data = await response.json()
        setHistory(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadHistory()
  }, [])

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>Cargando historial...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <h2>Historial de Cajas Cerradas</h2>

        {error && <div className="error-message">{error}</div>}

        {history.length === 0 ? (
          <p>No hay cajas cerradas aún.</p>
        ) : (
          <table className="cash-table">
            <thead>
              <tr>
                <th>Caja ID</th>
                <th>Fecha Apertura</th>
                <th>Monto Inicial</th>
                <th>Monto Cierre</th>
                <th>Efectivo Real</th>
                <th>Diferencia</th>
                <th>Fecha Cierre</th>
              </tr>
            </thead>
            <tbody>
              {history.map(caja => (
                <tr key={caja.id}>
                  <td>#{caja.id}</td>
                  <td>{new Date(caja.fecha_apertura).toLocaleString()}</td>
                  <td>${parseFloat(caja.monto_inicial).toFixed(2)}</td>
                  <td>${parseFloat(caja.monto_cierre).toFixed(2)}</td>
                  <td>${parseFloat(caja.efectivo_real).toFixed(2)}</td>
                  <td className={parseFloat(caja.diferencia) === 0 ? 'green' : 'red'}>
                    ${parseFloat(caja.diferencia).toFixed(2)}
                  </td>
                  <td>{new Date(caja.fecha_cierre).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="modal-buttons">
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
