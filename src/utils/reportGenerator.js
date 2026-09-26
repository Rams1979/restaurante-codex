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

export function generateReceiptPDF(saleData) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPos = 10

  // Header
  doc.setFontSize(18)
  doc.setFont(undefined, 'bold')
  doc.text('RESTAURANTE CODEX', pageWidth / 2, yPos, { align: 'center' })
  yPos += 8

  doc.setFontSize(11)
  doc.setFont(undefined, 'normal')
  doc.text('TICKET DE VENTA', pageWidth / 2, yPos, { align: 'center' })
  yPos += 10

  // Info de la venta
  doc.setFontSize(10)
  const timestamp = new Date()
  doc.text(`Fecha: ${timestamp.toLocaleDateString('es-ES')}`, 15, yPos)
  yPos += 5
  doc.text(`Hora: ${timestamp.toLocaleTimeString('es-ES')}`, 15, yPos)
  yPos += 5
  doc.text(`Lugar: ${saleData.tableInfo}`, 15, yPos)
  yPos += 7

  // Info del cliente si existe
  if (saleData.clientInfo?.nombre && !saleData.clientInfo?.isContado) {
    doc.setFont(undefined, 'bold')
    doc.text('CLIENTE:', 15, yPos)
    doc.setFont(undefined, 'normal')
    yPos += 5
    doc.text(saleData.clientInfo.nombre, 20, yPos)
    if (saleData.clientInfo.celular) {
      yPos += 5
      doc.text(`Tel: ${saleData.clientInfo.celular}`, 20, yPos)
    }
    yPos += 7
  }

  // Línea separadora
  doc.setDrawColor(0)
  doc.line(15, yPos, pageWidth - 15, yPos)
  yPos += 5

  // Items
  doc.setFont(undefined, 'bold')
  doc.setFontSize(9)
  doc.text('DESCRIPCIÓN', 15, yPos)
  doc.text('CANT', 110, yPos)
  doc.text('PRECIO', 140, yPos)
  doc.text('SUBTOTAL', 170, yPos)
  yPos += 5

  doc.setDrawColor(200)
  doc.line(15, yPos, pageWidth - 15, yPos)
  yPos += 4

  doc.setFont(undefined, 'normal')
  saleData.items.forEach(item => {
    const itemPrice = item.isPromo ? item.promoPrecio : item.precio
    const itemTotal = itemPrice * item.cantidad
    const desc = item.isPromo ? `${item.promoNombre}` : item.descripcion

    // Truncar descripción si es muy larga
    const maxDescWidth = 90
    const descLines = doc.splitTextToSize(desc, maxDescWidth)

    descLines.forEach((line, idx) => {
      doc.text(line, 15, yPos, { maxWidth: maxDescWidth })
      if (idx === 0) {
        doc.text(item.cantidad.toString(), 115, yPos)
        doc.text(`₡${itemPrice.toFixed(2)}`, 145, yPos)
        doc.text(`₡${itemTotal.toFixed(2)}`, 175, yPos)
      }
      yPos += 4
    })
  })

  // Línea separadora
  doc.setDrawColor(0)
  doc.line(15, yPos, pageWidth - 15, yPos)
  yPos += 4

  // Resumen
  doc.setFontSize(10)
  doc.text('Subtotal:', 120, yPos)
  doc.text(`₡${saleData.subtotal.toFixed(2)}`, 170, yPos)
  yPos += 5

  if (saleData.descuentoPorcentaje > 0) {
    doc.text(`Descuento (${saleData.descuentoPorcentaje}%):`, 120, yPos)
    doc.text(`-₡${saleData.descuento.toFixed(2)}`, 170, yPos)
    yPos += 5
  }

  doc.text('Impuesto (13%):', 120, yPos)
  doc.text(`₡${saleData.impuesto.toFixed(2)}`, 170, yPos)
  yPos += 5

  if (saleData.servicio > 0) {
    doc.text('Servicio (10%):', 120, yPos)
    doc.text(`₡${saleData.servicio.toFixed(2)}`, 170, yPos)
    yPos += 5
  }

  // Total
  doc.setFont(undefined, 'bold')
  doc.setFontSize(12)
  doc.line(120, yPos, pageWidth - 15, yPos)
  yPos += 5
  doc.text('TOTAL:', 120, yPos)
  doc.text(`₡${saleData.total.toFixed(2)}`, 170, yPos)
  yPos += 8

  // Footer
  doc.setFont(undefined, 'normal')
  doc.setFontSize(9)
  doc.setTextColor(128, 128, 128)
  doc.text('¡Gracias por su compra!', pageWidth / 2, pageHeight - 15, { align: 'center' })
  doc.text(`#${new Date().getTime()}`, pageWidth / 2, pageHeight - 10, { align: 'center' })

  // Download
  const filename = `Comprobante_${new Date().getTime()}.pdf`
  doc.save(filename)
}
