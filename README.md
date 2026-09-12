# 🍽️ Restaurante Codex - Sistema POS v2.3

**Sistema de Punto de Venta (POS) moderno para restaurantes** deployado en la nube con PostgreSQL, gestión completa de inventario con rebajo automático, clientes, facturación y control de productos activos/inactivos.

**Versión**: 2.3.0  
**Estado**: ✅ Producción - Sistema en internet con PostgreSQL, rebajo automático de inventario, deploy en Railway  
**Última actualización**: 12 de Septiembre de 2026  
**GitHub**: Lee `GITHUB_SETUP.md` para sincronizar entre 2 computadoras  
**🌐 URL Pública**: https://restaurante-codex-production.up.railway.app

---

## 📋 Características Principales

### 💼 Sistema de Ventas
- **15 Mesas Independientes**: Gestión de órdenes por mesa con estado de ocupación
- **10 Asientos de Barra**: Independientes con gestión de clientes registrados
- **21 Productos en BD**: Catálogo completo con código, descripción, precio e inventario
- **Inventario Dinámico**: Actualización en tiempo real al agregar/remover productos
- **Rebajo Automático**: Al cobrar/imprimir, se actualiza automáticamente en SQLite
- **Persistencia de Inventario**: Al cerrar y reabrirse, los cambios se mantienen
- **Promociones**: Sistema integrado de promos con precios especiales por cantidad

### 👥 Gestión de Clientes (SQLite)
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
- **Moneda**: Colones Costarricenses (₡)

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

# 3. Crear base de datos
node db-init.js

# 4. Migrar datos (si tienes archivos antigios)
node migrate-all.js

# 5. Iniciar
npm run dev
```

O con PowerShell:
```powershell
.\start.ps1
```

**Frontend**: http://localhost:3001  
**API**: http://localhost:3003  
**Base de Datos**: SQLite local (codex.db)

---

## 📁 Estructura del Proyecto

```
codex-pos/
├── src/
│   ├── components/
│   │   ├── Cart.jsx                    # Carrito con cálculos
│   │   ├── ClientRegistration.jsx      # Registro de clientes
│   │   ├── ClientSelector.jsx          # Selector con búsqueda
│   │   ├── FileUpload.jsx              # Carga Excel (opcional)
│   │   ├── ProductList.jsx             # Grid de productos
│   │   ├── ProductsManager.jsx         # CRUD de productos ⭐
│   │   ├── RecipesManager.jsx          # CRUD de recetas ⭐
│   │   ├── RecipeModal.jsx             # Modal de recetas
│   │   └── TableSelector.jsx           # Grid de mesas/barra
│   ├── App.jsx                         # Componente principal
│   ├── App.css                         # Estilos globales
│   └── main.jsx                        # Punto de entrada
├── api-server.js                       # API REST Node.js ⭐
├── db-init.js                          # Creación de BD
├── migrate-all.js                      # Migración completa ⭐
├── migrate-excel-to-sqlite.js         # Migración productos/recetas
├── migrate-clientes-to-sqlite.js      # Migración clientes
├── vite.config.js                      # Config Vite
├── codex.db                            # Base de datos SQLite
├── package.json                        # Dependencias
└── README.md                           # Este archivo

⭐ = Nuevo en v2.0
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
Los cambios se guardan inmediatamente en SQLite.

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
Se guardan automáticamente en SQLite.

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

## 🗄️ Base de Datos SQLite

### Tablas

#### `productos`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `codigo` | TEXT PK | ID único del producto |
| `descripcion` | TEXT | Nombre del producto |
| `precio` | REAL | Precio unitario en ₡ |
| `inventario` | INT | Stock disponible |
| `receta` | TEXT | Código de receta (cócteles) |
| `peso` | TEXT | Peso o volumen |
| `promoNombre` | TEXT | Nombre de la promoción |
| `promoCantidad` | INT | Cantidad en promo |
| `promoPrecio` | REAL | Precio de promo |

#### `recetas`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `codigo` | TEXT PK | ID único de receta |
| `nombre` | TEXT | Nombre del cóctel |
| `ingredientes` | TEXT | Lista de ingredientes |
| `instrucciones` | TEXT | Pasos de preparación |
| `tiempo` | TEXT | Tiempo de preparación |

#### `clientes`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT PK | ID único |
| `nombre` | TEXT UNIQUE | Nombre completo |
| `celular` | TEXT | Número de contacto |
| `edad` | TEXT | Edad del cliente |
| `correo` | TEXT | Email |
| `descuento` | INT | % descuento (0-10) |
| `fecha` | DATETIME | Fecha de registro |

#### `órdenes`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT PK | ID de orden |
| `numeroMesa` | TEXT | Mesa o asiento |
| `cliente_id` | INT FK | Referencia a cliente |
| `subtotal` | REAL | Antes de impuesto |
| `descuento` | REAL | Monto de descuento |
| `impuesto` | REAL | Impuesto (13%) |
| `servicio` | REAL | Servicio (10% mesas) |
| `total` | REAL | Total final |
| `estado` | TEXT | pendiente/cobrado |
| `createdAt` | DATETIME | Fecha/hora |

#### `órdenes_items`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT PK | ID del item |
| `orden_id` | INT FK | Orden asociada |
| `codigo` | TEXT | Producto |
| `descripcion` | TEXT | Nombre producto |
| `cantidad` | INT | Cantidad |
| `precio` | REAL | Precio unitario |
| `isPromo` | INT | Es promoción? |

---

## 🔌 API REST

### Servidor
- **Dirección**: http://localhost:3003
- **Puerto**: 3003
- **CORS**: Habilitado para localhost

### Endpoints

#### Productos
```
GET    /api/products              # Obtener todos
POST   /api/products              # Crear producto
PUT    /api/products/:codigo      # Actualizar
DELETE /api/products/:codigo      # Eliminar
```

#### Recetas
```
GET    /api/recipes               # Obtener todas
POST   /api/recipes               # Crear receta
PUT    /api/recipes/:codigo       # Actualizar
DELETE /api/recipes/:codigo       # Eliminar
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

### Ejemplo: Agregar Producto
```bash
curl -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "COCA001",
    "descripcion": "Coca Cola",
    "precio": 1300,
    "inventario": 50
  }'
```

---

## 🔄 Migración de Datos

### Script Unificado (Recomendado)
```bash
node migrate-all.js
```
Migra automáticamente:
- ✅ 21 productos desde `productos.xlsx`
- ✅ 5 recetas desde `recetas.xlsx`
- ✅ 6 clientes desde `clientes.txt`

### Scripts Individuales
```bash
node migrate-excel-to-sqlite.js      # Solo productos + recetas
node migrate-clientes-to-sqlite.js   # Solo clientes
```

### Resultado Esperado
```
🔄 Iniciando migración de datos a SQLite...

📦 Migrando productos...
  ✅ 21 productos

🍹 Migrando recetas...
  ✅ 5 recetas

👤 Migrando clientes...
  ✅ 6 clientes

═══════════════════════════════════
✅ Migración completada!
═══════════════════════════════════
```

---

## ⚙️ Configuración

### Vite (vite.config.js)
```javascript
server: {
  port: 3000,                    // Puerto frontend
  open: true,                    // Abrir navegador
  proxy: {
    '/api': {
      target: 'http://localhost:3002',
      changeOrigin: true
    }
  }
}
```

### Base de Datos (api-server.js)
```javascript
db.pragma('journal_mode = WAL')  // Write-Ahead Logging
                                 // Mejor concurrencia
```

---

## 🛡️ Seguridad

✅ **Prepared Statements**: Prevención de SQL injection  
✅ **Validación Servidor**: Todos los datos validados  
✅ **CORS Habilitado**: Solo localhost  
✅ **Descuentos Validados**: Rango 0-10% forzado  
✅ **Nombres Únicos**: No se permiten clientes duplicados  

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
# Verificar puerto 3002
netstat -ano | findstr :3002

# Reiniciar servidor
npm run dev
```

### "No se cargan productos"
```bash
# Verificar BD existe
ls -la codex.db

# Reinicializar
node db-init.js
node migrate-all.js
```

### "Cliente no se guarda"
```bash
# Ver logs
node api-server.js

# Verificar conexión BD
sqlite3 codex.db ".tables"
```

### "Error de CORS"
```bash
# Ya está configurado, pero si falla:
# Verificar que API está en http://localhost:3002
# Verificar proxy en vite.config.js
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
sqlite3 codex.db

# Ver tablas
.tables

# Contar registros
SELECT COUNT(*) FROM productos;
SELECT COUNT(*) FROM clientes;
SELECT COUNT(*) FROM recetas;

# Ver clientes
SELECT nombre, descuento FROM clientes;
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
- Consultar base de datos SQLite

---

## 📄 Licencia

Proyecto desarrollado para **Restaurante Codex**.

---

## 📋 Changelog

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
