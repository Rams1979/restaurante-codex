import { useState } from 'react'
import { generateCashClosureReport } from '../utils/reportGenerator'

export default function CloseCashRegister({ caja, onClosed, onCancel }) {
  const [efectivoContado, setEfectivoContado] = useState('')
  const [pagosTarjeta, setPagosTarjeta] = useState('0')
  const [pagosSinpe, setPagosSinpe] = useState('0')
  const [notas, setNotas] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const efectivoEsperado = parseFloat(caja.efectivo_esperado) || 0
  const efectivoReal = parseFloat(efectivoContado) || 0
  const diferencia = efectivoReal - efectivoEsperado

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!efectivoContado || isNaN(efectivoContado)) {
      setError('Ingresa el efectivo contado')
      return
    }

    if (Math.abs(diferencia) > 0.01) {
      setError(`Diferencia: $${diferencia.toFixed(2)}. No se puede cerrar con diferencia.`)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/cash-register/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cajaId: caja.id,
          efectivoReal: parseFloat(efectivoContado),
          pagosTarjeta: parseFloat(pagosTarjeta),
          pagosSinpe: parseFloat(pagosSinpe),
          notas
        })
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Error al cerrar la caja')
        return
      }

      const cajaClosed = await response.json()
      await generateCashClosureReport(cajaClosed)
      onClosed(cajaClosed)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Cerrar Caja #{caja.id}</h2>

        <div className="cash-info">
          <p><strong>Efectivo Esperado:</strong> ${efectivoEsperado.toFixed(2)}</p>
          <p><strong>Diferencia:</strong> <span className={diferencia === 0 ? 'green' : 'red'}>
            ${diferencia.toFixed(2)}
          </span></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Efectivo Contado *</label>
              <input
                type="number"
                placeholder="0.00"
                value={efectivoContado}
                onChange={(e) => setEfectivoContado(e.target.value)}
                step="0.01"
                min="0"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Pagos Tarjeta</label>
              <input
                type="number"
                placeholder="0.00"
                value={pagosTarjeta}
                onChange={(e) => setPagosTarjeta(e.target.value)}
                step="0.01"
                min="0"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Pagos SINPE</label>
              <input
                type="number"
                placeholder="0.00"
                value={pagosSinpe}
                onChange={(e) => setPagosSinpe(e.target.value)}
                step="0.01"
                min="0"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notas</label>
            <textarea
              placeholder="Observaciones del cierre..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              disabled={loading}
              rows="3"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-buttons">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || Math.abs(diferencia) > 0.01}
            >
              {loading ? 'Cerrando...' : 'Cerrar Caja'}
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
