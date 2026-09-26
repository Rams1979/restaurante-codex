import jsPDF from 'jspdf'

export async function generateCashClosureReport(cajaData) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPos = 15

  // Header
  doc.setFontSize(20)
  doc.text('REPORTE DE CIERRE DE CAJA', pageWidth / 2, yPos, { align: 'center' })
  yPos += 15

  // Info general
  doc.setFontSize(12)
  doc.text(`Caja ID: ${cajaData.id}`, 15, yPos)
  yPos += 7

  doc.setFontSize(10)
  const fechaApertura = new Date(cajaData.fecha_apertura)
  doc.text(`Fecha Apertura: ${fechaApertura.toLocaleString()}`, 15, yPos)
  yPos += 6

  const fechaCierre = new Date(cajaData.fecha_cierre)
  doc.text(`Fecha Cierre: ${fechaCierre.toLocaleString()}`, 15, yPos)
  yPos += 6

  const duracion = Math.round((fechaCierre - fechaApertura) / 60000)
  doc.text(`Duración: ${duracion} minutos`, 15, yPos)
  yPos += 10

  // Movimiento de efectivo
  doc.setFontSize(12)
  doc.text('MOVIMIENTO DE EFECTIVO', 15, yPos)
  yPos += 8

  doc.setFontSize(10)
  const montoInicial = parseFloat(cajaData.monto_inicial)
  doc.text(`Monto Inicial: $${montoInicial.toFixed(2)}`, 20, yPos)
  yPos += 6

  const ventasEfectivo = parseFloat(cajaData.ventas_efectivo) || 0
  doc.text(`+ Ventas Efectivo: $${ventasEfectivo.toFixed(2)}`, 20, yPos)
  yPos += 6

  const retiros = parseFloat(cajaData.retiros) || 0
  doc.text(`- Retiros: $${retiros.toFixed(2)}`, 20, yPos)
  yPos += 6

  const gastos = parseFloat(cajaData.gastos) || 0
  doc.text(`- Gastos: $${gastos.toFixed(2)}`, 20, yPos)
  yPos += 8

  const efectivoEsperado = parseFloat(cajaData.efectivo_esperado)
  doc.setFont(undefined, 'bold')
  doc.text(`Efectivo Esperado: $${efectivoEsperado.toFixed(2)}`, 20, yPos)
  doc.setFont(undefined, 'normal')
  yPos += 10

  // Resumen de pagos
  doc.setFontSize(12)
  doc.text('RESUMEN DE PAGOS', 15, yPos)
  yPos += 8

  doc.setFontSize(10)
  const efectivoReal = parseFloat(cajaData.efectivo_real)
  doc.text(`Efectivo Real Contado: $${efectivoReal.toFixed(2)}`, 20, yPos)
  yPos += 6

  const ventasTarjeta = parseFloat(cajaData.ventas_tarjeta) || 0
  doc.text(`Ventas Tarjeta: $${ventasTarjeta.toFixed(2)}`, 20, yPos)
  yPos += 6

  const ventasSinpe = parseFloat(cajaData.ventas_sinpe) || 0
  doc.text(`Ventas SINPE: $${ventasSinpe.toFixed(2)}`, 20, yPos)
  yPos += 8

  const montoCierre = parseFloat(cajaData.monto_cierre)
  doc.setFont(undefined, 'bold')
  doc.text(`Monto Total Cierre: $${montoCierre.toFixed(2)}`, 20, yPos)
  doc.setFont(undefined, 'normal')
  yPos += 10

  // Validación
  doc.setFontSize(12)
  doc.text('VALIDACIÓN', 15, yPos)
  yPos += 8

  doc.setFontSize(10)
  const diferencia = parseFloat(cajaData.diferencia)
  const diferenciaTxt = diferencia === 0 ? '✓ CUADRE CORRECTO' : `✗ DIFERENCIA: $${diferencia.toFixed(2)}`
  const diferenciaColor = diferencia === 0 ? [0, 128, 0] : [255, 0, 0]
  doc.setTextColor(...diferenciaColor)
  doc.text(diferenciaTxt, 20, yPos, { maxWidth: pageWidth - 40 })
  doc.setTextColor(0, 0, 0)
  yPos += 10

  // Notas
  if (cajaData.notas) {
    doc.setFontSize(12)
    doc.text('NOTAS', 15, yPos)
    yPos += 6
    doc.setFontSize(10)
    const splitNotes = doc.splitTextToSize(cajaData.notas, pageWidth - 30)
    doc.text(splitNotes, 20, yPos)
    yPos += splitNotes.length * 6 + 5
  }

  // Footer
  doc.setFontSize(9)
  doc.setTextColor(128, 128, 128)
  const timestamp = new Date().toLocaleString()
  doc.text(`Generado: ${timestamp}`, pageWidth / 2, pageHeight - 10, { align: 'center' })

  // Download
  const filename = `Cierre_Caja_${cajaData.id}_${new Date().getTime()}.pdf`
  doc.save(filename)
}
