# 🗄️ Migración a SQLite

## Resumen
El sistema POS ha sido migrado de archivos de texto plano a una base de datos **SQLite**, eliminando la dependencia de archivos Excel y archivos .txt.

## Cambios Implementados

### 📦 Dependencias Agregadas
- `better-sqlite3` - Driver SQLite optimizado para Node.js
- `sqlite3` - Alternativa tradicional de SQLite

### 📄 Archivos Creados
1. **db-init.js** - Script de inicialización de la base de datos
2. **api-server.js** - Nuevo servidor API con SQLite
3. **codex.db** - Base de datos SQLite (generada automáticamente)

### 📊 Esquema de Base de Datos

#### Tabla: `productos`
```sql
- codigo (PRIMARY KEY)
- descripcion
- precio
- inventario
- receta
- peso
- promoNombre
- promoCantidad
- promoPrecio
- createdAt
```

#### Tabla: `recetas`
```sql
- codigo (PRIMARY KEY)
- nombre
- ingredientes
- instrucciones
- tiempo
- createdAt
```

#### Tabla: `clientes`
```sql
- id (PRIMARY KEY)
- nombre (UNIQUE)
- celular
- edad
- correo
- descuento
- fecha
```

#### Tabla: `ordenes`
```sql
- id (PRIMARY KEY)
- numeroMesa
- cliente_id (FOREIGN KEY)
- subtotal
- descuento
- impuesto
- servicio
- total
- estado
- createdAt
```

#### Tabla: `ordenes_items`
```sql
- id (PRIMARY KEY)
- orden_id (FOREIGN KEY)
- codigo
- descripcion
- cantidad
- precio
- isPromo
```

### ✅ Endpoints API (Mantenidos)
- `GET /api/clients` - Obtener lista de clientes
- `POST /api/clients` - Crear nuevo cliente
- `PUT /api/clients/:id` - Actualizar cliente existente

## 🚀 Cómo Iniciar

1. **Inicializar base de datos (si es nueva):**
```bash
node db-init.js
```

2. **Iniciar servidor API:**
```bash
node api-server.js
```

3. **Iniciar aplicación React:**
```bash
npm run dev
```

## 📋 Mejoras Incluidas

✅ **Eliminación de archivos**
- Ya no usa clientes.txt
- Ya no depende de archivos Excel
- Base de datos centralizada y estructurada

✅ **Mejor rendimiento**
- Consultas indexadas
- Transacciones ACID
- WAL mode para mejor concurrencia

✅ **Escalabilidad**
- Fácil de migrar a PostgreSQL en el futuro
- Estructura preparada para múltiples sucursales
- Historial completo de órdenes

✅ **Seguridad**
- Prepared statements (previene SQL injection)
- Validación de datos en la base de datos
- Índices para búsquedas rápidas

## 🔄 Migración de Datos (Si necesitas importar datos antiguos)

Si tienes datos en archivos antiguos, puedes crear un script de migración:

```javascript
import Database from 'better-sqlite3'
import fs from 'fs'

const db = new Database('codex.db')

// Leer clientes.txt y copiar a base de datos
const data = fs.readFileSync('clientes.txt', 'utf-8')
const lines = data.trim().split('\n')

for (const line of lines) {
  if (line.trim()) {
    const client = JSON.parse(line)
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO clientes 
      (nombre, celular, edad, correo, descuento, fecha)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    stmt.run(
      client.nombre,
      client.celular,
      client.edad,
      client.correo,
      client.descuento || 0,
      client.fecha
    )
  }
}
```

## ⚙️ Configuración

La base de datos usa WAL (Write-Ahead Logging) para mejor performance:
```javascript
db.pragma('journal_mode = WAL')
```

## 🔒 Backup

Para hacer backup de la base de datos:
```bash
cp codex.db codex.db.backup
```

## 📝 Notas
- Todos los endpoints mantienen la misma interfaz
- El frontend no necesita cambios
- La migración es transparente para el usuario
