# 🔌 Documentación API REST

**Restaurante Codex - API Server v2.0**

---

## 📍 Configuración

**Base URL**: `http://localhost:3002`  
**CORS**: Habilitado para `*`  
**Content-Type**: `application/json`  

---

## 👤 Clientes

### GET /api/clients
Obtiene la lista completa de clientes registrados.

**Método**: GET  
**Autenticación**: No requerida  

**Respuesta**: 200 OK
```json
[
  {
    "id": 1788886879105,
    "nombre": "Rolando Mata",
    "celular": "89121826",
    "edad": "40",
    "correo": "rolandomata@hotmail.com",
    "descuento": 4,
    "fecha": "2026-09-08T17:04:04.681Z"
  },
  {
    "id": 1788913679519,
    "nombre": "Evelyn",
    "celular": "123459",
    "edad": "40",
    "correo": "evelyngr_7@yahoo.es",
    "descuento": 0,
    "fecha": "2026-09-09T00:27:59.519Z"
  }
]
```

**Error**: 500 Server Error
```json
{"error": "Server error"}
```

---

### POST /api/clients
Registra un nuevo cliente.

**Método**: POST  
**Content-Type**: `application/json`  

**Body Requerido**:
```json
{
  "nombre": "Juan García",
  "celular": "50377778888",
  "edad": "35",
  "correo": "juan@email.com",
  "descuento": 5
}
```

**Campos**:
| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|-----------|
| `nombre` | string | ✅ | Único, no vacío |
| `celular` | string | ✅ | No vacío |
| `edad` | string | ✅ | No vacío |
| `correo` | string | ✅ | No vacío |
| `descuento` | number | ❌ | 0-10 (default: 0) |

**Respuesta**: 201 Created
```json
{
  "id": 1726950873450,
  "nombre": "Juan García",
  "celular": "50377778888",
  "edad": "35",
  "correo": "juan@email.com",
  "descuento": 5,
  "fecha": "2026-09-22T14:47:53.450Z"
}
```

**Errores**:
```json
// 400 - Campos faltantes
{"error": "Faltan campos requeridos"}

// 400 - Descuento inválido
{"error": "El descuento debe estar entre 0 y 10"}

// 400 - Nombre duplicado
{"error": "Cliente ya existe"}
```

**Ejemplo cURL**:
```bash
curl -X POST http://localhost:3002/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María López",
    "celular": "50399998888",
    "edad": "28",
    "correo": "maria@email.com",
    "descuento": 5
  }'
```

---

### PUT /api/clients/:id
Actualiza datos de un cliente existente.

**Método**: PUT  
**URL Parámetro**: `id` (ID del cliente)  

**Body** (todos los campos opcionales):
```json
{
  "celular": "50399998888",
  "edad": "29",
  "correo": "maria.nueva@email.com",
  "descuento": 7
}
```

**Restricciones**:
- ❌ No se puede cambiar `nombre`
- ✅ Se pueden cambiar `celular`, `edad`, `correo`, `descuento`
- ✅ `descuento` debe estar entre 0-10

**Respuesta**: 200 OK
```json
{
  "id": 1788968877372,
  "nombre": "María García",
  "celular": "50399998888",
  "edad": "29",
  "correo": "maria.nueva@email.com",
  "descuento": 7,
  "fecha": "2026-09-09T15:47:57.372Z"
}
```

**Errores**:
```json
// 400 - Descuento inválido
{"error": "El descuento debe estar entre 0 y 10"}

// 400 - No hay campos para actualizar
{"error": "No hay campos para actualizar"}

// 400 - Cliente no encontrado
{"error": "Cliente no encontrado"}
```

**Ejemplo cURL**:
```bash
curl -X PUT http://localhost:3002/api/clients/1788968877372 \
  -H "Content-Type: application/json" \
  -d '{
    "edad": "30",
    "descuento": 8
  }'
```

---

## 📦 Productos

### GET /api/products
Obtiene el catálogo completo de productos.

**Método**: GET  

**Respuesta**: 200 OK
```json
[
  {
    "codigo": "1",
    "descripcion": "Coca Cola",
    "precio": 1300,
    "inventario": 50,
    "receta": null,
    "peso": null,
    "promoNombre": null,
    "promoCantidad": null,
    "promoPrecio": null,
    "createdAt": "2026-09-09T15:00:00.000Z"
  },
  {
    "codigo": "RC001",
    "descripcion": "Mojito",
    "precio": 3500,
    "inventario": 100,
    "receta": "RC001",
    "peso": null,
    "promoNombre": "2x1",
    "promoCantidad": 2,
    "promoPrecio": 5000,
    "createdAt": "2026-09-09T15:00:00.000Z"
  }
]
```

---

### POST /api/products
Crea un nuevo producto.

**Método**: POST  

**Body Requerido**:
```json
{
  "codigo": "COCA002",
  "descripcion": "Coca Cola Zero",
  "precio": 1300,
  "inventario": 30,
  "receta": null,
  "peso": "355ml",
  "promoNombre": null,
  "promoCantidad": null,
  "promoPrecio": null
}
```

**Campos**:
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `codigo` | string | ✅ | ID único del producto |
| `descripcion` | string | ✅ | Nombre del producto |
| `precio` | number | ✅ | Precio en ₡ |
| `inventario` | number | ❌ | Stock disponible (default: 0) |
| `receta` | string | ❌ | Código de receta para cócteles |
| `peso` | string | ❌ | Volumen o peso |
| `promoNombre` | string | ❌ | Nombre de promoción |
| `promoCantidad` | number | ❌ | Cantidad en promo |
| `promoPrecio` | number | ❌ | Precio de promo |

**Respuesta**: 201 Created
```json
{
  "codigo": "COCA002",
  "descripcion": "Coca Cola Zero",
  "precio": 1300,
  "inventario": 30,
  "receta": null,
  "peso": "355ml",
  "promoNombre": null,
  "promoCantidad": null,
  "promoPrecio": null,
  "createdAt": "2026-09-22T15:00:00.000Z"
}
```

**Errores**:
```json
// 400 - Campos faltantes
{"error": "Faltan campos requeridos"}

// 400 - Código duplicado
{"error": "Producto ya existe"}
```

---

### PUT /api/products/:codigo
Actualiza un producto existente.

**Método**: PUT  
**URL Parámetro**: `codigo` (código del producto)  

**Body**:
```json
{
  "descripcion": "Coca Cola actualizada",
  "precio": 1350,
  "inventario": 45,
  "receta": null,
  "peso": "355ml",
  "promoNombre": "Combo 2x1",
  "promoCantidad": 2,
  "promoPrecio": 2200
}
```

**Respuesta**: 200 OK
```json
{
  "codigo": "COCA002",
  "descripcion": "Coca Cola actualizada",
  "precio": 1350,
  "inventario": 45,
  "receta": null,
  "peso": "355ml",
  "promoNombre": "Combo 2x1",
  "promoCantidad": 2,
  "promoPrecio": 2200,
  "createdAt": "2026-09-22T15:00:00.000Z"
}
```

**Errores**:
```json
// 400 - Producto no encontrado
{"error": "Producto no encontrado"}
```

---

### DELETE /api/products/:codigo
Elimina un producto del catálogo.

**Método**: DELETE  

**Respuesta**: 200 OK
```json
{"message": "Producto eliminado"}
```

**Errores**:
```json
// 400 - Producto no encontrado
{"error": "Producto no encontrado"}
```

---

## 🍹 Recetas

### GET /api/recipes
Obtiene todas las recetas de cócteles.

**Método**: GET  

**Respuesta**: 200 OK
```json
[
  {
    "codigo": "RC001",
    "nombre": "Mojito",
    "ingredientes": "Ron blanco, azúcar, lima, menta, soda, hielo",
    "instrucciones": "1. Exprimir lima. 2. Agregar azúcar y menta. 3. Macerar...",
    "tiempo": "5 min",
    "createdAt": "2026-09-09T15:00:00.000Z"
  }
]
```

---

### POST /api/recipes
Crea una nueva receta.

**Método**: POST  

**Body Requerido**:
```json
{
  "codigo": "RC003",
  "nombre": "Daiquiri",
  "ingredientes": "Ron blanco, jugo de lima fresco, jarabe simple",
  "instrucciones": "1. Llenar vaso de hielo. 2. Verter ron y jugo de lima...",
  "tiempo": "3 min"
}
```

**Campos**:
| Campo | Tipo | Requerido |
|-------|------|-----------|
| `codigo` | string | ✅ |
| `nombre` | string | ✅ |
| `ingredientes` | string | ❌ |
| `instrucciones` | string | ❌ |
| `tiempo` | string | ❌ |

**Respuesta**: 201 Created
```json
{
  "codigo": "RC003",
  "nombre": "Daiquiri",
  "ingredientes": "Ron blanco, jugo de lima fresco, jarabe simple",
  "instrucciones": "1. Llenar vaso de hielo. 2. Verter ron y jugo de lima...",
  "tiempo": "3 min",
  "createdAt": "2026-09-22T15:00:00.000Z"
}
```

---

### PUT /api/recipes/:codigo
Actualiza una receta existente.

**Método**: PUT  

**Body**:
```json
{
  "nombre": "Daiquiri Premium",
  "ingredientes": "Ron premium, jugo de lima fresco, azúcar blanca",
  "instrucciones": "Versión mejorada...",
  "tiempo": "4 min"
}
```

**Respuesta**: 200 OK

---

### DELETE /api/recipes/:codigo
Elimina una receta.

**Método**: DELETE  

**Respuesta**: 200 OK
```json
{"message": "Receta eliminada"}
```

---

## 🧪 Testing

### Con cURL

```bash
# Obtener todos los productos
curl http://localhost:3002/api/products

# Obtener todos los clientes
curl http://localhost:3002/api/clients

# Obtener todas las recetas
curl http://localhost:3002/api/recipes

# Crear producto
curl -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -d '{"codigo":"TEST","descripcion":"Test","precio":1000,"inventario":10}'

# Actualizar cliente
curl -X PUT http://localhost:3002/api/clients/1788886879105 \
  -H "Content-Type: application/json" \
  -d '{"descuento":7}'

# Eliminar producto
curl -X DELETE http://localhost:3002/api/products/TEST
```

### Con Postman

1. Importar colección: [Postman Collection JSON]
2. Configurar variable base: `{{baseUrl}}` = `http://localhost:3002`
3. Probar endpoints

### Con JavaScript/Fetch

```javascript
// Obtener productos
fetch('/api/products')
  .then(r => r.json())
  .then(products => console.log(products))

// Crear cliente
fetch('/api/clients', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    nombre: 'Juan García',
    celular: '50377778888',
    edad: '35',
    correo: 'juan@email.com',
    descuento: 5
  })
})
  .then(r => r.json())
  .then(client => console.log('Cliente creado:', client))

// Actualizar producto
fetch('/api/products/1', {
  method: 'PUT',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    precio: 1400,
    inventario: 60
  })
})
  .then(r => r.json())
  .then(product => console.log('Producto actualizado:', product))
```

---

## 🔒 Manejo de Errores

Todos los endpoints devuelven errores en este formato:

```json
{
  "error": "Descripción del error"
}
```

### Códigos HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Server Error - Error del servidor |

---

## 📊 Límites y Validación

### Clientes
- **Nombre**: Máximo 100 caracteres, debe ser único
- **Celular**: Máximo 20 caracteres
- **Edad**: Máximo 3 caracteres
- **Correo**: Máximo 100 caracteres
- **Descuento**: 0-10 (rango validado)

### Productos
- **Código**: Máximo 50 caracteres, debe ser único
- **Descripción**: Máximo 200 caracteres
- **Precio**: Número positivo
- **Inventario**: Número no negativo

### Recetas
- **Código**: Máximo 50 caracteres, debe ser único
- **Nombre**: Máximo 100 caracteres
- **Ingredientes**: Máximo 1000 caracteres
- **Instrucciones**: Máximo 2000 caracteres
- **Tiempo**: Máximo 50 caracteres

---

## 🔄 Rate Limiting

Actualmente no hay limitación de requests. Se recomienda implementar en producción.

---

## 📝 Versión API

**API Version**: 2.0.0  
**Fecha de lanzamiento**: 09 Septiembre 2026  
**Servidor**: Node.js + better-sqlite3  

---

## 🚀 Mejoras Futuras

- [ ] Autenticación (JWT)
- [ ] Rate limiting
- [ ] Paginación
- [ ] Filtros avanzados
- [ ] Búsqueda full-text
- [ ] Webhooks
- [ ] Versioning en URL

---

**Última actualización**: 09 de Septiembre de 2026
