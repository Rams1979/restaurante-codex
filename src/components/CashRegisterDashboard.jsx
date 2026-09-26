import { useState, useEffect } from 'react'
import { generateCashClosureReport } from '../utils/reportGenerator'

export default function CashRegisterDashboard({ caja, onClose, onShowCloseCash, onShowHistory }) {
  const [currentCaja, setCurrentCaja] = useState(caja)

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/cash-register/current')
        if (response.ok) {
          const data = await response.json()
          setCurrentCaja(data)
        }
      } catch (err) {
        console.error('Error actualizando caja:', err)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!currentCaja || !currentCaja.id) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>Cargando información de caja...</p>
        </div>
      </div>
    )
  }

  const montoInicial = parseFloat(currentCaja.monto_inicial) || 0
  const ventasEfectivo = parseFloat(currentCaja.ventas_efectivo) || 0
  const ventasTarjeta = parseFloat(currentCaja.ventas_tarjeta) || 0
  const ventasSinpe = parseFloat(currentCaja.ventas_sinpe) || 0
  const retiros = parseFloat(currentCaja.retiros) || 0
  const gastos = parseFloat(currentCaja.gastos) || 0
  const efectivoEsperado = parseFloat(currentCaja.efectivo_esperado) || 0

  const handleGenerateReport = async () => {
    try {
      await generateCashClosureReport(currentCaja)
    } catch (err) {
      console.error('Error generando reporte:', err)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Estado de Caja #{currentCaja.id}</h2>

        <div className="cash-grid">
          <div className="cash-item">
            <label>Monto Inicial</label>
            <p className="value">${montoInicial.toFixed(2)}</p>
          </div>

          <div className="cash-item green">
            <label>Ventas Efectivo</label>
            <p className="value">${ventasEfectivo.toFixed(2)}</p>
          </div>

          <div className="cash-item green">
            <label>Ventas Tarjeta</label>
            <p className="value">${ventasTarjeta.toFixed(2)}</p>
          </div>

          <div className="cash-item green">
            <label>Ventas SINPE</label>
            <p className="value">${ventasSinpe.toFixed(2)}</p>
          </div>

          <div className="cash-item red">
            <label>Retiros</label>
            <p className="value">${retiros.toFixed(2)}</p>
          </div>

          <div className="cash-item red">
            <label>Gastos</label>
            <p className="value">${gastos.toFixed(2)}</p>
          </div>

          <div className="cash-item blue">
            <label>Efectivo Esperado</label>
            <p className="value">${efectivoEsperado.toFixed(2)}</p>
          </div>
        </div>

        <div className="modal-buttons">
          <button className="btn-primary" onClick={onShowCloseCash}>
            💰 Cerrar Caja
          </button>
          <button className="btn-success" onClick={handleGenerateReport}>
            📄 Generar Reporte
          </button>
          <button className="btn-info" onClick={onShowHistory}>
            📋 Historial
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
