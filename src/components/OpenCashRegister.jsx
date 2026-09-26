import { useState } from 'react'

export default function OpenCashRegister({ onCashOpened, onCancel }) {
  const [monto, setMonto] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!monto || isNaN(monto) || parseFloat(monto) <= 0) {
      setError('Ingresa un monto válido')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/cash-register/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ montoInicial: parseFloat(monto) })
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Error al abrir la caja')
        return
      }

      const caja = await response.json()
      onCashOpened(caja)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Abrir Caja de Pago</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Monto Inicial (Efectivo)</label>
            <input
              type="number"
              placeholder="0.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              step="0.01"
              min="0"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-buttons">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Abriendo...' : 'Abrir Caja'}
            </button>
            <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
