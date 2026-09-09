# 📚 Índice de Documentación

**Restaurante Codex v2.0** - Documentación Completa

---

## 🚀 Comenzar Rápido

| Documento | Descripción |
|-----------|-------------|
| **[README.md](README.md)** | Guía principal del proyecto |
| **[INSTALLATION.md](#instalacion)** | Pasos de instalación detallados |

---

## 📖 Guías Principales

### 1. **[README.md](README.md)** - Guía Completa
**Para**: Nuevos usuarios y desarrolladores

**Contenido**:
- ✅ Características principales (v2.0)
- ✅ Instalación rápida
- ✅ Estructura del proyecto
- ✅ Cómo usar cada sección
- ✅ Ejemplos de cálculos
- ✅ Esquema de base de datos
- ✅ Endpoints API básicos
- ✅ Solución de problemas
- ✅ Changelog

**Leer si**: Necesitas visión general del sistema

---

### 2. **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Guía de Migración
**Para**: Usuarios que vienen de v1.x

**Contenido**:
- ✅ Qué cambió en v2.0
- ✅ Proceso paso a paso
- ✅ Migración de datos
- ✅ Verificación post-migración
- ✅ Problemas comunes y soluciones
- ✅ Datos migrados (21 productos, 5 recetas, 6 clientes)
- ✅ Nuevas funcionalidades
- ✅ Rollback a v1.x
- ✅ Checklist

**Leer si**: Vienes de la versión anterior

---

### 3. **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Referencia API
**Para**: Desarrolladores y integradores

**Contenido**:
- ✅ Configuración de API
- ✅ Endpoints de Clientes (GET, POST, PUT)
- ✅ Endpoints de Productos (GET, POST, PUT, DELETE)
- ✅ Endpoints de Recetas (GET, POST, PUT, DELETE)
- ✅ Ejemplos con cURL
- ✅ Ejemplos con Fetch JavaScript
- ✅ Ejemplos con Postman
- ✅ Validación y límites
- ✅ Códigos HTTP
- ✅ Manejo de errores

**Leer si**: Necesitas integrar con la API

---

### 4. **[SQLITE_MIGRATION.md](SQLITE_MIGRATION.md)** - Migración a SQLite
**Para**: Administradores de base de datos

**Contenido**:
- ✅ Resumen de cambios
- ✅ Dependencias nuevas
- ✅ Esquema de base de datos
- ✅ Endpoints mantenidos
- ✅ Mejoras incluidas
- ✅ Configuración WAL
- ✅ Backup

**Leer si**: Necesitas administrar la base de datos

---

## 🎯 Por Caso de Uso

### "Quiero instalar y usar el sistema"
1. Leer: **[README.md](README.md)** - Sección Instalación
2. Ejecutar: `node db-init.js && npm run dev`
3. Acceder: http://localhost:3000

### "Vengo de v1.x y quiero actualizar"
1. Leer: **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** completamente
2. Ejecutar: `node migrate-all.js`
3. Verificar: Checklist en MIGRATION_GUIDE.md

### "Quiero integrar con la API REST"
1. Leer: **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Sección relevante
2. Ejemplos: Usar cURL o Fetch para testear
3. Integrar: Usar en tu aplicación

### "Necesito administrar la base de datos"
1. Leer: **[SQLITE_MIGRATION.md](SQLITE_MIGRATION.md)**
2. Usar: `sqlite3 codex.db` para conectar
3. Consultar: Ver ejemplos en README.md - Sección Debug

### "Tengo un problema"
1. Revisar: **[README.md](README.md)** - Solución de Problemas
2. Consultar: **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Problemas Comunes
3. Contactar: Incluir logs y describir el error

---

## 📋 Archivos de Documentación

```
documentación/
├── README.md                    ← COMIENZA AQUÍ
├── MIGRATION_GUIDE.md          ← Si vienes de v1.x
├── API_DOCUMENTATION.md        ← Para desarrolladores
├── SQLITE_MIGRATION.md         ← Detalles de BD
├── DOCUMENTATION_INDEX.md      ← Este archivo
└── scripts/
    ├── db-init.js              ← Crear BD
    ├── migrate-all.js          ← Migrar todo
    ├── migrate-excel-to-sqlite.js
    └── migrate-clientes-to-sqlite.js
```

---

## 🔄 Scripts Útiles

### Instalación y Configuración
```bash
# 1. Instalar dependencias
npm install

# 2. Crear base de datos
node db-init.js

# 3. Migrar datos (si vienes de v1.x)
node migrate-all.js

# 4. Iniciar aplicación
npm run dev
```

### Base de Datos
```bash
# Conectar a SQLite
sqlite3 codex.db

# Ver estructura
.schema

# Ver clientes
SELECT * FROM clientes;

# Ver productos
SELECT * FROM productos;

# Ver recetas
SELECT * FROM recetas;

# Contar registros
SELECT COUNT(*) FROM clientes;
SELECT COUNT(*) FROM productos;
SELECT COUNT(*) FROM recetas;

# Salir
.quit
```

### API Testing
```bash
# Ver todos los clientes
curl http://localhost:3002/api/clients

# Ver todos los productos
curl http://localhost:3002/api/products

# Ver todas las recetas
curl http://localhost:3002/api/recipes

# Crear cliente
curl -X POST http://localhost:3002/api/clients \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","celular":"123","edad":"30","correo":"test@test.com"}'
```

---

## 📊 Datos en el Sistema

**Migrados desde v1.x**:
- 📦 21 Productos
- 🍹 5 Recetas
- 👤 6 Clientes

**Clientes ejemplo**:
- Test (sin descuento)
- Rolando Mata (4% descuento)
- Carlos Mendoza (4% descuento)
- María García (5% descuento)
- Evelyn (0% descuento)
- 1 (4% descuento)

**Productos ejemplo**:
- Coca Cola - ₡1,300
- Sprite - ₡1,300
- Agua embotellada - ₡1,300
- Jugo Natural - ₡1,000
- ... y 17 más

**Recetas ejemplo**:
- Mojito
- Margarita
- Daiquiri
- Piña Colada
- Margarita Fresca

---

## 🎓 Conceptos Clave

### SQLite
- Base de datos SQL embebida
- Un archivo `codex.db` contiene todo
- WAL mode: mejor concurrencia
- Prepared statements: seguridad

### API REST
- Endpoints `/api/products`, `/api/recipes`, `/api/clients`
- Métodos: GET, POST, PUT, DELETE
- Responses en JSON
- CORS habilitado

### Gestores CRUD
- **Productos Manager** (📦): Agregar, editar, eliminar productos
- **Recipes Manager** (🍹): Agregar, editar, eliminar recetas
- Cambios en tiempo real
- Validación servidor

### Migración
- Script `migrate-all.js` importa datos automáticamente
- Soporta Excel (.xlsx) y texto (.txt)
- Validación y transformación de datos

---

## 🔗 Enlaces Rápidos

**Documentación**:
- 📖 [README](README.md) - Guía principal
- 🔄 [Migración](MIGRATION_GUIDE.md) - Guía de actualización
- 🔌 [API](API_DOCUMENTATION.md) - Referencia técnica
- 🗄️ [SQLite](SQLITE_MIGRATION.md) - Detalles BD

**Scripts**:
- 🔧 `db-init.js` - Inicializar BD
- 📦 `migrate-all.js` - Migrar datos
- 🌐 `api-server.js` - Servidor REST

**URLs**:
- 🖥️ App: http://localhost:3000
- 🔌 API: http://localhost:3002

---

## ✅ Checklist de Documentación

- ✅ README principal completo
- ✅ Guía de migración detallada
- ✅ Documentación de API REST
- ✅ Documentación de SQLite
- ✅ Ejemplos de uso
- ✅ Solución de problemas
- ✅ Índice de documentación (este archivo)

---

## 📞 Soporte

**Si tienes dudas**:
1. Revisar la sección apropiada en este índice
2. Leer el documento relevante
3. Buscar en "Solución de Problemas"
4. Consultar logs del servidor

**Información útil a incluir**:
- Qué estabas haciendo
- Qué error específico recibiste
- Output de la consola
- Versión del sistema

---

**Última actualización**: 09 de Septiembre de 2026  
**Versión**: 2.0.0  
**Estado**: ✅ Completo
