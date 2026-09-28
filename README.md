# 🍽️ Restaurante Codex - Sistema POS v2.4

**Sistema de Punto de Venta (POS) moderno para restaurantes** deployado en la nube con PostgreSQL, gestión completa de inventario, clientes, facturación, sistema de caja avanzado con cierre automático, y generación de reportes PDF.

**Versión**: 2.4.0  
**Estado**: ✅ Producción - Sistema completo en internet con PostgreSQL, caja avanzada, reportes PDF, deploy en Railway  
**Última actualización**: 26 de Septiembre de 2026  
**GitHub**: Lee `GITHUB_SETUP.md` para sincronizar entre 2 computadoras  
**🌐 URL Pública**: https://restaurante-codex-production.up.railway.app

---

## 📋 Características Principales

### 💼 Sistema de Ventas
- **15 Mesas Independientes**: Gestión de órdenes por mesa con estado de ocupación
- **10 Asientos de Barra**: Independientes con gestión de clientes registrados
- **21 Productos en BD**: Catálogo completo con código, descripción, precio e inventario
- **Inventario Dinámico**: Actualización en tiempo real al agregar/remover productos
- **Rebajo Automático**: Al cobrar/imprimir, se actualiza automáticamente en la base de datos
- **Persistencia de Inventario**: Al cerrar y reabrirse, los cambios se mantienen
- **Promociones**: Sistema integrado de promos con precios especiales por cantidad

### 👥 Gestión de Clientes
- **Registro Completo**: Nombre, celular, edad, correo (persisten en BD)
- **Sistema de Descuentos**: Descuentos personalizados por cliente (0-10%)
- **Edición de Clientes**: Modificar datos con botón ✏️ (excepto nombre)
- **Selector de Clientes**: Búsqueda por nombre o celular en tiempo real
- **Cliente de Contado**: Opción para ventas sin registro
- **6 Clientes Migrados**: Test, Rolando Mata, Carlos Mendoza, María García, Evelyn, 1

### 📊 Facturación Inteligente
- **Impuesto de Ventas**: 13% calculado automáticamente
- **Servicio**: 10% (solo mesas, no incluido en barra)
- **Descuentos Automáticos**: Aplicados según perfil del cliente
- **Ticket de Venta**: Formato térmico con fecha, hora, detalles
- **Comprobante PDF Automático**: Generación automática al cobrar
- **Moneda**: Colones Costarricenses (₡)

### 💰 Sistema Avanzado de Caja
- **Apertura de Caja**: Ingreso de monto inicial de efectivo
- **Dashboard en Tiempo Real**: Visualización de estado actual (ventas, retiros, gastos)
- **Movimientos de Caja**: Registro de ventas por método (efectivo, tarjeta, SINPE)
- **Validación Automática**: Cálculo automático de efectivo esperado
- **Cierre Seguro**: Solo cierra si el efectivo contado = efectivo esperado
- **Arqueo Parcial**: Consulta sin cerrar caja
- **Reporte PDF Automático**: Generación de reporte al cierre
- **Historial Auditable**: Registro completo de todas las cajas cerradas
- **Diferencias Detectadas**: Alerta si hay faltante o sobrante

### 📄 Reportes y Comprobantes
- **Comprobante de Venta**: PDF automático al cobrar con detalles completos
- **Reporte de Cierre de Caja**: PDF con información financiera del día
- **Detalles en PDF**: Items, precios, descuentos, impuestos, total
- **Descarga Automática**: Se guarda en descargas sin intervención del usuario

### 🎨 Interfaz de Usuario
- **Responsive**: Funciona en desktop, tablet y móvil
- **Búsqueda Rápida**: Filtros por código o descripción de producto
- **Encabezado Dinámico**: Muestra mesa/barra y cliente actual
- **Gestión Visual**: Indicadores de stock y ocupación
- **Botones Optimizados**: Edición (✏️) e inactivación (⊘) compactos
- **Diseño Intuitivo**: Interfaz limpia y fácil de usar
- **Tema Oscuro**: Fondo gris difuminado con textos con sombra

### 🔒 Gestión de Productos Activos/Inactivos
- **Inactivar en lugar de eliminar**: Soft delete, datos persistentes
- **Filtrado automático**: Solo productos activos en órdenes
- **Recuperación posible**: Productos inactivos recuperables
- **Gestión segura**: No se pueden seleccionar en órdenes

### 🗄️ Base de Datos PostgreSQL (en la Nube)
- **5 Tablas**: productos, recetas, clientes, órdenes, órdenes_items
- **Alojado en Railway**: Base de datos en la nube, sincronizada automáticamente
- **Acceso Remoto**: Datos disponibles desde cualquier dispositivo
- **Prepared Statements**: Prevención de SQL injection
- **Backups Automáticos**: Railway mantiene backups de seguridad

---

## 🌐 Sincronizar en GitHub

Para ejecutar desde 2 computadoras diferentes, mira **`GITHUB_SETUP.md`** que incluye:
- ✅ Crear repositorio en GitHub
- ✅ Conectar proyecto local
- ✅ Clonar en segunda computadora
- ✅ Workflow de sincronización diaria
- ✅ Resolver conflictos

---

## 🚀 Instalación Rápida

### Opción 1: Usar en Internet (Recomendado) 🌐
**No requiere instalación. Solo abre el navegador:**
```
https://restaurante-codex-production.up.railway.app
```
- ✅ Acceso desde cualquier dispositivo
- ✅ Datos sincronizados automáticamente
- ✅ Base de datos en la nube (PostgreSQL)
- ✅ Siempre disponible

### Opción 2: Instalación Local

#### Requisitos
- Node.js 16+ (v24.20.0 recomendado)
- npm o yarn (11.19.0 recomendado)

#### Pasos

```bash
# 1. Descargar el proyecto
cd codex-pos

# 2. Instalar dependencias
npm install

# 3. Configurar la conexión a PostgreSQL
#    Crea un archivo .env (o exporta la variable) con:
#    DATABASE_URL=postgresql://usuario:password@host:5432/nombre_bd
#    Puede apuntar a un PostgreSQL local o a la instancia de Railway.
#    Las tablas se crean automáticamente al iniciar el servidor
#    (no hace falta correr ningún script de inicialización).

# 4. Iniciar el API server (puerto 3003)
node api-server.js

# 5. En otra terminal, iniciar el frontend (puerto 3000)
npm run dev
```

O con PowerShell (inicia ambos procesos):
```powershell
.\start.ps1
```

**Frontend (Vite dev server)**: http://localhost:3000  
**API**: http://localhost:3003  
**Base de Datos**: PostgreSQL (local o Railway, según `DATABASE_URL`)

> ℹ️ Los scripts `db-init.js` y `migrate-all.js` son de la versión antigua basada en SQLite (`better-sqlite3`, que ya no es una dependencia del proyecto) y **no funcionan** con la base de datos actual. Se conservan solo como referencia histórica — ver [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md).

---

## 📁 Estructura del Proyecto

```
codex-pos/
├── src/
│   ├── components/
│   │   ├── Cart.jsx                       # Carrito con cálculos
│   │   ├── ClientRegistration.jsx         # Registro de clientes
│   │   ├── ClientSelector.jsx             # Selector con búsqueda
│   │   ├── FileUpload.jsx                 # Carga Excel (opcional)
│   │   ├── ProductList.jsx                # Grid de productos
│   │   ├── ProductsManager.jsx            # CRUD de productos
│   │   ├── RecipesManager.jsx             # CRUD de recetas
│   │   ├── RecipeModal.jsx                # Modal de recetas
│   │   ├── TableSelector.jsx              # Grid de mesas/barra
│   │   ├── OpenCashRegister.jsx           # Modal de apertura de caja ⭐
│   │   ├── CashRegisterDashboard.jsx      # Dashboard de caja en tiempo real ⭐
│   │   ├── CloseCashRegister.jsx          # Cierre de caja con validación ⭐
│   │   └── CashRegisterHistory.jsx        # Historial de cajas cerradas ⭐
│   ├── App.jsx                            # Componente principal
│   ├── App.css                            # Estilos globales
│   └── main.jsx                           # Punto de entrada
├── api-server.js                          # API REST + servidor (Node.js + PostgreSQL)
├── vite.config.js                         # Config Vite (dev server + proxy /api)
├── Procfile                               # Comando de arranque en Railway (npm start)
├── dist/                                  # Build de producción del frontend (servido por api-server.js)
├── db-init.js, migrate-*.js               # Scripts históricos de la era SQLite (obsoletos)
├── package.json                           # Dependencias
└── README.md                              # Este archivo

⭐ = Nuevo en v2.4 (sistema de caja + reportes PDF)
```

---

## 💻 Uso del Sistema

### 1️⃣ Pantalla Principal
Al abrir la app, ves:
- Botones de gestión (📦 Productos, 🍹 Recetas, 📁 Cargar Excel)
- Botón ➕ Nuevo Cliente
- Grid de 15 mesas + 10 asientos de barra
- Órdenes activas por mesa

### 2️⃣ Gestionar Productos (Base de Datos)
```
Hacer clic en "📦 Gestionar Productos":
├── Agregar: Formulario → ➕ Agregar Producto
├── Editar: Clic en ✏️ → Modificar → 💾 Guardar
└── Eliminar: Clic en 🗑️ → Confirmar
```
Los cambios se guardan inmediatamente en la base de datos.

### 3️⃣ Gestionar Recetas (Base de Datos)
```
Hacer clic en "🍹 Gestionar Recetas":
├── Agregar: Código, nombre, ingredientes, instrucciones
├── Editar: Clic en ✏️ → Modificar → 💾 Guardar
└── Inactivar: Clic en ⊘ → Confirmar (soft delete)
```
Soporta cócteles y bebidas especiales.

### 4️⃣ Inactivar Productos
```
En "📦 Gestionar Productos":
├── Clic en ⊘ (botón amarillo)
├── Confirmar inactivación
└── Producto NO aparece en órdenes
```
- ✅ Datos NO se pierden
- ✅ Recuperables si es necesario
- ✅ No seleccionables en nuevas órdenes

### 4️⃣ Registrar Clientes
```
Clic en "➕ Nuevo Cliente":
├── Nombre (obligatorio, único)
├── Celular
├── Edad
├── Correo
└── Descuento 0-10% (opcional)
```
Se guardan automáticamente en la base de datos.

### 5️⃣ Crear Orden
```
Clic en mesa o asiento de barra:
├── Seleccionar cliente (o "Cliente de Contado")
├── Buscar producto por código/descripción
├── Agregar a carrito
├── Ajustar cantidades
└── 🖨️ Imprimir ticket
```

### 6️⃣ Cargar desde Excel (Opcional)
```
Si tienes archivos antiguos:
├── Clic en "📁 Cargar Productos"
├── Seleccionar archivo Excel
└── Clic en "📦 Gestionar Productos" para guardar en BD
```

### 7️⃣ Sistema de Caja (NUEVO)

#### Abrir Caja
```
Clic en "🏪 Abrir Caja":
├── Ingresa monto inicial en efectivo
├── Clic en "Abrir Caja"
└── Caja #ID abierta y lista para ventas
```

#### Ver Estado de Caja
```
Clic en "💰 Caja Abierta (#ID)":
├── Dashboard mostrando:
│   ├── Monto inicial
│   ├── Ventas por método (efectivo, tarjeta, SINPE)
│   ├── Retiros y gastos
│   └── Efectivo esperado (calculado automáticamente)
├── Botones:
│   ├── 💰 Cerrar Caja
│   ├── 📄 Generar Reporte
│   └── 📋 Historial
```

#### Cobrar y Generar Comprobante
```
Al hacer clic en "💰 Cobrar":
1. Sistema actualiza inventario automáticamente
2. Genera PDF de comprobante con:
   ├── Datos del restaurante
   ├── Fecha y hora
   ├── Cliente (si aplica)
   ├── Todos los items con cantidad y precio
   ├── Descuentos, impuestos y servicio
   └── Total final
3. Se descarga automáticamente
4. Orden se limpia y lista para nueva venta
```

#### Cerrar Caja
```
Clic en "💰 Cerrar Caja":
├── Ingresa efectivo contado (obligatorio)
├── Ingresa pagos tarjeta (opcional)
├── Ingresa pagos SINPE (opcional)
├── Agrega notas (opcional)
├── Sistema valida: efectivo = efectivo esperado
├── Si diferencia = 0:
│   ├── Genera PDF de reporte de cierre
│   ├── Cierra caja automáticamente
│   └── Registra en historial
└── Si diferencia ≠ 0:
    └── Bloquea cierre y muestra diferencia
```

#### Ver Historial
```
Clic en "📋 Historial":
├── Tabla con todas las cajas cerradas
├── Columnas: ID, fechas, montos, diferencia
├── Color verde: diferencia = 0 (correcto)
├── Color rojo: diferencia ≠ 0 (revisión necesaria)
```

---

## 📊 Ejemplos de Cálculo

### Orden Sin Descuento
```
Producto: Coca Cola
Cantidad: 1
Precio Unitario: ₡1,300.00

Subtotal:          ₡1,300.00
Impuesto (13%):       ₡169.00
Servicio (10%):       ₡130.00
────────────────────────────
TOTAL:             ₡1,599.00
```

### Orden Con Descuento (Cliente: Rolando Mata, 4%)
```
Producto: Coca Cola
Cantidad: 1
Precio Unitario: ₡1,300.00

Subtotal:          ₡1,300.00
Descuento (4%):      -₡52.00
────────────────────────────
Subtotal c/ Desc:  ₡1,248.00
Impuesto (13%):      ₡162.24
Servicio (10%):      ₡124.80
────────────────────────────
TOTAL:             ₡1,535.04
```

### Orden en Barra (Sin Servicio)
```
Producto: Mojito
Cantidad: 2
Precio Unitario: ₡3,500.00

Subtotal:          ₡7,000.00
Impuesto (13%):      ₡910.00
Servicio:               ₡0.00
────────────────────────────
TOTAL:             ₡7,910.00
```

---

## 🗄️ Base de Datos PostgreSQL

Las tablas se crean automáticamente (`CREATE TABLE IF NOT EXISTS`) la primera vez que arranca `api-server.js`, usando la conexión definida en `DATABASE_URL`.

### Tablas

#### `productos`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL PK | ID interno autogenerado |
| `codigo` | VARCHAR(50) UNIQUE | Código del producto |
| `descripcion` | TEXT | Nombre del producto |
| `precio` | DECIMAL(10,2) | Precio unitario en ₡ |
| `inventario` | INT | Stock disponible |
| `receta` | TEXT | Código de receta (cócteles) |
| `peso` | VARCHAR(50) | Peso o volumen |
| `promoNombre` | VARCHAR(255) | Nombre de la promoción |
| `promoCantidad` | INT | Cantidad en promo |
| `promoPrecio` | DECIMAL(10,2) | Precio de promo |
| `activo` | INT | 1 = activo, 0 = inactivado (soft delete) |

#### `recetas`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL PK | ID interno autogenerado |
| `codigo` | VARCHAR(50) UNIQUE | Código de la receta |
| `nombre` | VARCHAR(255) | Nombre del cóctel |
| `ingredientes` | TEXT | Lista de ingredientes |
| `instrucciones` | TEXT | Pasos de preparación |
| `tiempo` | INT | Tiempo de preparación (minutos) |

#### `clientes`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL PK | ID único |
| `nombre` | VARCHAR(255) | Nombre completo (no obligado a ser único en BD) |
| `celular` | VARCHAR(20) | Número de contacto |
| `edad` | INT | Edad del cliente |
| `correo` | VARCHAR(255) | Email |
| `descuento` | INT | % descuento (0-10) |
| `fecha` | TIMESTAMP | Fecha de registro |

> ⚠️ **Nota**: las órdenes/ventas en curso viven solo en el estado de React (memoria del navegador) y se documentan como comprobante en el PDF generado al cobrar — **no se persisten en tablas `órdenes`/`órdenes_items`**. Guardar el historial de órdenes en base de datos sigue pendiente (ver "Próximas Mejoras Sugeridas").

#### `cajas`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL PK | ID único de caja |
| `monto_inicial` | DECIMAL | Efectivo inicial |
| `monto_cierre` | DECIMAL | Efectivo + tarjeta + SINPE |
| `efectivo_esperado` | DECIMAL | Calculado automáticamente |
| `efectivo_real` | DECIMAL | Efectivo contado |
| `diferencia` | DECIMAL | efectivo_real - efectivo_esperado |
| `estado` | VARCHAR | 'abierta' o 'cerrada' |
| `fecha_apertura` | TIMESTAMP | Fecha/hora de apertura |
| `fecha_cierre` | TIMESTAMP | Fecha/hora de cierre |
| `notas` | TEXT | Notas del cierre |

#### `movimientos_caja` (NUEVO)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL PK | ID único |
| `caja_id` | INT FK | Caja asociada |
| `tipo` | VARCHAR | venta_efectivo/venta_tarjeta/venta_sinpe/retiro/gasto |
| `monto` | DECIMAL | Monto del movimiento |
| `descripcion` | TEXT | Detalle del movimiento |
| `fecha` | TIMESTAMP | Fecha/hora del movimiento |

---

## 🔌 API REST

### Servidor
- **Dirección**: http://localhost:3003 (local) — configurable con la variable `PORT`
- **Puerto**: 3003
- **CORS**: Habilitado para cualquier origen (`Access-Control-Allow-Origin: *`)

### Endpoints

#### Productos
```
GET    /api/products              # Obtener todos los productos activos
POST   /api/products              # Crear producto
PUT    /api/products/:codigo      # Actualizar
DELETE /api/products/:codigo      # Inactivar (soft delete, no elimina el registro)
```

#### Recetas
```
GET    /api/recipes               # Obtener todas
POST   /api/recipes               # Crear receta
PUT    /api/recipes/:codigo       # Actualizar
DELETE /api/recipes/:codigo       # Eliminar definitivamente
```

#### Clientes
```
GET    /api/clients               # Obtener todos
POST   /api/clients               # Crear cliente
PUT    /api/clients/:id           # Actualizar
```

#### Inventario
```
POST   /api/inventory             # Actualizar inventario (rebajo automático)
```

#### Caja (NUEVO)
```
POST   /api/cash-register/open              # Abrir caja con monto inicial
GET    /api/cash-register/current           # Obtener estado actual
POST   /api/cash-register/movement          # Registrar movimiento (venta/retiro/gasto)
POST   /api/cash-register/close             # Cerrar caja con validación
GET    /api/cash-register/history           # Obtener historial de cajas cerradas
```

### Ejemplo: Agregar Producto
```bash
curl -X POST http://localhost:3003/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "COCA001",
    "descripcion": "Coca Cola",
    "precio": 1300,
    "inventario": 50
  }'
```

---

## 🔄 Migración de Datos (histórico, era SQLite)

Los scripts `migrate-all.js`, `migrate-excel-to-sqlite.js` y `migrate-clientes-to-sqlite.js` importaban datos de Excel/texto hacia la antigua base **SQLite** (`codex.db`). Dependen de `better-sqlite3`, que **ya no está instalado** (no aparece en `package.json`), así que actualmente **no funcionan**. Se conservan como referencia histórica — ver [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md). Para cargar productos hoy, usa el botón "📁 Cargar Excel" en la app (lee el archivo en el navegador) y luego "📦 Gestionar Productos" para guardarlos en PostgreSQL vía la API.

---

## ⚙️ Configuración

### Variables de Entorno (api-server.js)
| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `DATABASE_URL` | ✅ | Cadena de conexión a PostgreSQL (local o Railway) |
| `PORT` | ❌ | Puerto del API server (default: `3003`) |

### Vite (vite.config.js)
```javascript
server: {
  port: 3000,                    // Puerto frontend
  open: true,                    // Abrir navegador
  proxy: {
    '/api': {
      target: 'http://localhost:3003',
      changeOrigin: true
    }
  }
}
```

En producción (Railway) no se usa Vite ni el proxy: `npm start` corre `api-server.js`, que sirve el build estático (`dist/`) y la API en el mismo puerto (`PORT`).

---

## 🛡️ Seguridad

✅ **Prepared Statements**: Prevención de SQL injection (`pg` con parámetros `$1, $2...`)  
✅ **Validación Servidor**: Todos los datos validados  
✅ **CORS Habilitado**: Para cualquier origen (`*`) — sin restricción a localhost  
✅ **Descuentos Validados**: Rango 0-10% forzado  
⚠️ **Nombres de Cliente No Únicos**: la tabla `clientes` ya no tiene constraint `UNIQUE` en `nombre` (sí lo tenía en la versión SQLite); el servidor no valida duplicados  
⚠️ **Sin autenticación**: La API no requiere login ni API key (ver "Próximas Mejoras Sugeridas")  

---

## 📱 Dispositivos Soportados

| Dispositivo | Estado |
|------------|--------|
| 🖥️ Desktop | ✅ Óptimo |
| 📱 Tablet | ✅ Responsive |
| 📱 Móvil | ✅ Compatible |

---

## 🐛 Solución de Problemas

### "API no disponible"
```bash
# Verificar puerto 3003
netstat -ano | findstr :3003

# Reiniciar el API server
node api-server.js
```

### "AggregateError [ECONNREFUSED]" / "No se cargan productos"
Causa más común: `DATABASE_URL` no está definida o el PostgreSQL destino no está accesible.
```bash
# Verificar que la variable está definida (PowerShell)
echo $env:DATABASE_URL

# Probar conexión directa
psql "$env:DATABASE_URL" -c "\dt"
```
Si no tienes PostgreSQL local ni Docker, puedes instalar PostgreSQL (`winget install PostgreSQL.PostgreSQL`) o usar el `DATABASE_URL` de la base de Railway.

### "Cliente no se guarda"
```bash
# Ver logs del servidor
node api-server.js

# Verificar tablas en PostgreSQL
psql "$env:DATABASE_URL" -c "\dt"
```

### "Error de CORS"
```bash
# El servidor ya envía Access-Control-Allow-Origin: * en todas las respuestas.
# Si falla, verifica que el frontend apunte al puerto correcto (3003)
# y que el proxy '/api' en vite.config.js tenga ese mismo puerto.
```

---

## 📝 Logs y Debug

### Ver requests HTTP
```javascript
// api-server.js tiene logs de cada endpoint
console.log('POST /api/clients - Datos recibidos:', body)
console.log('Cliente guardado exitosamente:', newClient.id)
```

### Ver estado de BD
```bash
psql "$env:DATABASE_URL"

# Ver tablas
\dt

# Contar registros
SELECT COUNT(*) FROM productos;
SELECT COUNT(*) FROM clientes;
SELECT COUNT(*) FROM recetas;

# Ver clientes
SELECT nombre, descuento FROM clientes;

# Salir
\q
```

---

## 🚀 Próximas Mejoras Sugeridas

- [ ] Historial de órdenes con gráficos
- [ ] Reportes diarios/mensuales
- [ ] Gestión de usuarios con permisos
- [ ] Backup automático de BD
- [ ] Integración con impresora térmica
- [ ] App móvil nativa
- [ ] Sincronización multi-sucursal
- [ ] Integración pagos online

---

## 📞 Soporte

Para reportar bugs o sugerir mejoras:
- Contactar equipo de desarrollo
- Revisar logs en consola del navegador
- Consultar la base de datos PostgreSQL (`psql "$DATABASE_URL"`)

---

## 📄 Licencia

Proyecto desarrollado para **Restaurante Codex**.

---

## 📋 Changelog

### v2.4.0 (26 Septiembre 2026)
✅ **Sistema Avanzado de Caja de Pago**
- Apertura de caja con monto inicial
- Dashboard con estado en tiempo real (ventas, retiros, gastos)
- Cierre con validación automática de cuadre
- Archiveo parcial sin cerrar
- Historial auditable de cajas cerradas

✅ **Generación Automática de PDF**
- Comprobante PDF al cobrar (con detalles completos)
- Reporte PDF al cierre de caja
- Información financiera, cliente, items, totales
- Descarga automática sin intervención del usuario

✅ **Base de Datos PostgreSQL**
- Tablas cajas y movimientos_caja
- 6 nuevos endpoints REST (/api/cash-register/*)
- Cálculo automático de efectivo esperado
- Validación de cuadre (diferencia = 0)

✅ **Componentes React Nuevos**
- OpenCashRegister.jsx (modal de apertura)
- CashRegisterDashboard.jsx (dashboard en tiempo real)
- CloseCashRegister.jsx (cierre con validación)
- CashRegisterHistory.jsx (tabla de historial)
- reportGenerator.js (generación de PDFs)

✅ **Correción de Bugs**
- Parser de precios para evitar error toFixed()
- Integración correcta de jsPDF
- Estilos responsivos para modal de caja

### v2.3.0 (12 Septiembre 2026)
✅ **🌐 Deploy exitoso en Railway** - Aplicación disponible en internet  
✅ **Migración a PostgreSQL** - Base de datos en la nube  
✅ **Frontend estático compilado** - Servido directamente desde API  
✅ **Acceso desde cualquier dispositivo** - Sin necesidad de instalación local  
✅ **URL Pública**: https://restaurante-codex-production.up.railway.app  
✅ **Documentación actualizada** con instrucciones de internet y local  

### v2.2.1 (11 Septiembre 2026)
✅ Guía completa GITHUB_SETUP.md para sincronizar entre 2 computadoras  
✅ .gitignore configurado para evitar sincronizar archivos temporales  
✅ Documentación actualizada con URLs correctas (3001/3003)  
✅ Sistema probado y verificado en funcionamiento  

### v2.2.0 (09 Septiembre 2026)
✅ Rebajo automático de inventario al cobrar/imprimir  
✅ Endpoint POST /api/inventory para actualización en BD  
✅ Persistencia de inventario en SQLite  
✅ Verificación exitosa: inventario rebajado correctamente  
✅ Puerto API cambiado a 3003 para evitar conflictos  

### v2.1.0 (09 Septiembre 2026)
✅ Sistema activo/inactivo para productos  
✅ Soft delete (datos no se pierden)  
✅ Inactivación en lugar de eliminación  
✅ Filtrado automático en órdenes  
✅ Tema oscuro con gradiente gris difuminado  
✅ Interfaz mejorada con alineación perfecta  

### v2.0.0 (09 Septiembre 2026)
✅ Migración completa a SQLite  
✅ Gestores CRUD para productos y recetas  
✅ Carga automática de productos al iniciar  
✅ Migración de 21 productos, 5 recetas, 6 clientes  
✅ Documentación completa  

### v1.1.1
- Sistema basado en archivos de texto
- Carga de Excel manual

---

**Desarrollado con ❤️ para Restaurante Codex**
