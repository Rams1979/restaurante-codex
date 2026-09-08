# 🍽️ Restaurante Codex - Sistema POS

Sistema de Punto de Venta (POS) completo para restaurantes, desarrollado con React y Vite.

## 📋 Características Principales

### Sistema de Ventas
- **15 Mesas**: Gestión independiente de órdenes por mesa
- **10 Asientos de Barra**: Independientes con gestión de clientes
- **21 Productos**: Con código, descripción, precio e inventario
- **Inventario Dinámico**: Actualización automática al agregar/remover productos
- **Promociones**: Sistema de promos con precios especiales

### Gestión de Clientes
- **Registro de Clientes**: Nombre, celular, edad, correo
- **Selector de Clientes**: Accesible en mesas y barra
- **Búsqueda**: Filtra clientes por nombre o celular
- **Cliente de Contado**: Opción por defecto para ventas rápidas
- **Persistencia**: Datos guardados en archivo (clientes.txt)

### Facturación
- **Impuesto de Ventas**: 13% calculado automáticamente
- **Servicio**: 10% solo para mesas (no incluido en barra)
- **Información del Cliente**: Mostrada en la factura impresa
- **Ticket de Venta**: Con fecha, hora y detalles de la orden
- **Impresión**: Compatible con impresoras térmicas

### Interfaz de Usuario
- **Responsive**: Funciona en diferentes tamaños de pantalla
- **Búsqueda**: De productos por código o descripción
- **Gestión Visual**: Indicadores de stock y ocupación
- **Modo Impresión**: Estilos optimizados para tickets

## 🚀 Instalación

### Requisitos Previos
- Node.js 16+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
```bash
cd codex-pos
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar los servidores**
```bash
npm run dev
```

O usar el script PowerShell:
```powershell
.\start.ps1
```

## 📁 Estructura del Proyecto

```
codex-pos/
├── src/
│   ├── components/
│   │   ├── Cart.jsx                 # Carrito de compras
│   │   ├── ClientRegistration.jsx   # Formulario de registro
│   │   ├── ClientSelector.jsx       # Selector de clientes
│   │   ├── FileUpload.jsx          # Carga de archivos Excel
│   │   ├── ProductList.jsx         # Lista de productos
│   │   ├── RecipeModal.jsx         # Modal de recetas
│   │   └── TableSelector.jsx       # Selector de mesas/barra
│   ├── App.jsx                     # Componente principal
│   ├── App.css                     # Estilos globales
│   └── main.jsx                    # Punto de entrada
├── api-server.js                   # Servidor API Node.js
├── vite.config.js                  # Configuración Vite
├── package.json                    # Dependencias del proyecto
├── clientes.txt                    # Base de datos de clientes
└── README.md                       # Este archivo
```

## 💻 Uso del Sistema

### Cargar Productos
1. Preparar archivo Excel con columnas:
   - `codigo`: ID único del producto
   - `descripcion`: Nombre del producto
   - `precio`: Precio unitario
   - `inventario`: Stock disponible
   - `receta`: Código de receta (opcional, para cócteles)
   - `peso`: Peso del producto (opcional)
   - `promoNombre`: Nombre de la promoción (opcional)
   - `promoCantidad`: Cantidad en la promo (opcional)
   - `promoPrecio`: Precio de la promo (opcional)

2. Hacer clic en "📁 Cargar Productos"
3. Seleccionar el archivo Excel

### Registrar Clientes
1. Hacer clic en "➕ Nuevo Cliente"
2. Completar formulario con:
   - Nombre
   - Celular
   - Edad
   - Correo Electrónico
3. Hacer clic en "✅ Registrar"

### Crear Orden
1. Seleccionar Mesa o Asiento de Barra
2. Elegir cliente de la lista o usar "Cliente de Contado"
3. Buscar y agregar productos
4. Ajustar cantidades si es necesario
5. Hacer clic en "🖨️ Imprimir" para generar ticket

## 📊 Cálculos

### Ejemplo de Orden
```
Producto: Coca Cola
Cantidad: 1
Precio Unitario: $1,300.00
Subtotal: $1,300.00

Impuesto (13%): $169.00
Servicio (10% - solo mesas): $130.00

TOTAL: $1,599.00
```

### Impuesto
- **Tasa**: 13% del subtotal
- **Se aplica**: Siempre (mesas y barra)

### Servicio
- **Tasa**: 10% del subtotal
- **Se aplica**: Solo en mesas
- **No se aplica**: En barra

## 🗄️ Base de Datos

### Formato de Clientes (clientes.txt)
```json
{"id":1234567890,"nombre":"Juan García","celular":"50377778888","edad":"35","correo":"juan@email.com","fecha":"2026-09-08T15:30:45.123Z"}
```

Cada línea es un cliente registrado en formato JSON.

## 🔌 API Server

### Puerto
- **Puerto**: 3002
- **Proxy en Vite**: /api → http://localhost:3002

### Endpoints

#### GET /api/clients
Obtiene la lista de clientes registrados.

**Respuesta:**
```json
[
  {
    "id": 1234567890,
    "nombre": "Juan García",
    "celular": "50377778888",
    "edad": "35",
    "correo": "juan@email.com",
    "fecha": "2026-09-08T15:30:45.123Z"
  }
]
```

#### POST /api/clients
Registra un nuevo cliente.

**Body:**
```json
{
  "nombre": "María López",
  "celular": "50377779999",
  "edad": "28",
  "correo": "maria@email.com"
}
```

**Respuesta:**
```json
{
  "id": 1234567891,
  "nombre": "María López",
  "celular": "50377779999",
  "edad": "28",
  "correo": "maria@email.com",
  "fecha": "2026-09-08T16:45:30.456Z"
}
```

## 🎨 Interfaz de Usuario

### Pantalla Principal
- Botones: Cargar Productos, Cargar Recetas, Nuevo Cliente
- Grid de Mesas: 15 mesas en 4 filas
- Grid de Barra: 10 asientos en 1 fila

### Pantalla de Orden
- Búsqueda de productos
- Grid de productos con:
  - Código
  - Descripción
  - Precio
  - Stock disponible
  - Botón Agregar
  - Ícono de receta (si aplica)
  - Sección de promociones

### Carrito
- Información de la orden (mesa/barra y cliente)
- Lista de items con:
  - Producto
  - Cantidad
  - Precio unitario
  - Precio total
  - Botón para remover
- Resumen:
  - Subtotal
  - Impuesto (13%)
  - Servicio (10% - si aplica)
  - Total
- Botones: Imprimir, Cobrar

## 🖨️ Ticket Impreso

El ticket incluye:
```
═════════════════════════
   🍽️ Restaurante Codex
       Ticket de Venta
═════════════════════════

Mesa: 5
Cliente: Rolando Mata
Celular: 89121826
Correo: rolandomata@hotmail.com

Fecha: 08/09/2026
Hora: 16:45:30

─────────────────────────
Código  Descripción  Cant   Total
1       Coca Cola    1      $1,300.00
─────────────────────────

Subtotal:          $1,300.00
Impuesto (13%):      $169.00
Servicio (10%):      $130.00
═════════════════════════
TOTAL:             $1,599.00
═════════════════════════
```

## ⚙️ Configuración

### vite.config.js
```javascript
server: {
  port: 3000,
  open: true,
  proxy: {
    '/api': {
      target: 'http://localhost:3002',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '/api')
    }
  }
}
```

## 🔐 Seguridad

- Los datos de clientes se guardan localmente en el servidor
- Las transacciones se procesan localmente
- No hay transmisión a servidores externos
- Los datos de inventario se resetean al reiniciar

## 📱 Dispositivos Soportados

- Desktop (principal)
- Tablet
- Mobile (interfaz responsive)

## 🐛 Solución de Problemas

### "API Server no disponible"
1. Verificar que el proceso Node.js está corriendo
2. Revisar que el puerto 3002 está libre
3. Reiniciar el servidor: `npm run dev`

### "No se cargan los productos"
1. Verificar que el archivo Excel tiene el formato correcto
2. Revisar que las columnas tienen nombres exactos
3. Intentar con el archivo de ejemplo

### "El cliente no se guarda"
1. Verificar conexión al API Server
2. Revisar que todos los campos están completos
3. Revisar los logs del servidor en la consola

## 📝 Notas de Desarrollo

- **Estado Global**: Se usa React hooks (useState)
- **Estilos**: CSS puro (sin frameworks de CSS)
- **Persistencia**: Archivos de texto con formato JSON
- **Formato de Impresión**: CSS @media print
- **Inventario**: Se rastrea en `inventoryUsed` state

## 🤝 Contribuciones

Para reportar bugs o sugerir mejoras, contactar con el equipo de desarrollo.

## 📄 Licencia

Proyecto desarrollado para Restaurante Codex.

---

**Última actualización**: 08 de Septiembre de 2026
**Versión**: 1.0.0
**Estado**: ✅ Producción
