# 📚 Índice de Documentación

**Restaurante Codex v2.4** - Documentación Completa

> ⚠️ El sistema migró de SQLite a **PostgreSQL** en la v2.3.0 (deploy en Railway). Los documentos **MIGRATION_GUIDE.md** y **SQLITE_MIGRATION.md** describen la arquitectura anterior y se conservan solo como referencia histórica — no reflejan cómo funciona el sistema hoy. Para la configuración actual, usa **README.md** y **API_DOCUMENTATION.md**.

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

### 2. **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Guía de Migración (histórica, v1.x → v2.0/SQLite)
**Para**: Referencia histórica únicamente — la migración real a producción hoy es PostgreSQL/Railway, no SQLite

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

### 4. **[SQLITE_MIGRATION.md](SQLITE_MIGRATION.md)** - Migración a SQLite (histórica, obsoleta)
**Para**: Referencia histórica — describe la arquitectura de la v2.0, **reemplazada por PostgreSQL** desde la v2.3.0

**Leer si**: Quieres entender la evolución del proyecto. Para administrar la base de datos actual, usa `psql "$DATABASE_URL"` (ver README.md → Solución de Problemas)

---

## 🎯 Por Caso de Uso

### "Quiero instalar y usar el sistema"
1. Leer: **[README.md](README.md)** - Sección Instalación
2. Configurar `DATABASE_URL` (PostgreSQL) y ejecutar: `npm install && npm run dev`
3. Acceder: http://localhost:3000

### "Quiero integrar con la API REST"
1. Leer: **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Sección relevante
2. Ejemplos: Usar cURL o Fetch para testear
3. Integrar: Usar en tu aplicación

### "Necesito administrar la base de datos"
1. Usar: `psql "$DATABASE_URL"` para conectar a PostgreSQL
2. Consultar: Ver ejemplos en README.md - Sección "Logs y Debug"

### "Tengo un problema"
1. Revisar: **[README.md](README.md)** - Solución de Problemas
2. Contactar: Incluir logs y describir el error

### "Quiero entender cómo era el sistema antes de PostgreSQL"
1. Leer (histórico): **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** y **[SQLITE_MIGRATION.md](SQLITE_MIGRATION.md)**

---

## 📋 Archivos de Documentación

```
documentación/
├── README.md                    ← COMIENZA AQUÍ
├── API_DOCUMENTATION.md         ← Para desarrolladores (endpoints REST)
├── DOCUMENTATION_INDEX.md       ← Este archivo
├── GITHUB_SETUP.md              ← Sincronizar entre computadoras
├── MIGRATION_GUIDE.md           ← Histórico (v1.x → v2.0/SQLite, obsoleto)
└── SQLITE_MIGRATION.md          ← Histórico (detalles de la BD SQLite, obsoleto)
```

---

## 🔄 Scripts Útiles

### Instalación y Configuración
```bash
# 1. Instalar dependencias
npm install

# 2. Configurar DATABASE_URL apuntando a PostgreSQL (local o Railway)
#    Las tablas se crean automáticamente al iniciar api-server.js

# 3. Iniciar API server + frontend
node api-server.js   # en una terminal (puerto 3003)
npm run dev           # en otra terminal (puerto 3000)
```

### Base de Datos (PostgreSQL)
```bash
# Conectar
psql "$DATABASE_URL"

# Ver tablas
\dt

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
\q
```

### API Testing
```bash
# Ver todos los clientes
curl http://localhost:3003/api/clients

# Ver todos los productos
curl http://localhost:3003/api/products

# Ver todas las recetas
curl http://localhost:3003/api/recipes

# Crear cliente
curl -X POST http://localhost:3003/api/clients \
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

### PostgreSQL
- Base de datos relacional en la nube (Railway)
- Conexión vía `DATABASE_URL` con el driver `pg`
- Tablas auto-creadas al iniciar `api-server.js`
- Prepared statements (`$1, $2...`): seguridad

### API REST
- Endpoints `/api/products`, `/api/recipes`, `/api/clients`, `/api/inventory`, `/api/cash-register/*`
- Métodos: GET, POST, PUT, DELETE
- Responses en JSON
- CORS habilitado para cualquier origen

### Gestores CRUD
- **Productos Manager** (📦): Agregar, editar, inactivar productos
- **Recipes Manager** (🍹): Agregar, editar, eliminar recetas
- **Sistema de Caja** (💰): Apertura, dashboard, cierre validado, historial
- Cambios en tiempo real
- Validación servidor

### Carga de Datos
- Botón "📁 Cargar Excel" en la app lee productos desde `.xlsx` en el navegador
- Los scripts `migrate-*.js` (SQLite) están obsoletos, no se usan hoy

---

## 🔗 Enlaces Rápidos

**Documentación**:
- 📖 [README](README.md) - Guía principal
- 🔌 [API](API_DOCUMENTATION.md) - Referencia técnica
- 🔄 [Migración histórica](MIGRATION_GUIDE.md) - Solo referencia (obsoleta)

**Scripts**:
- 🌐 `api-server.js` - Servidor REST + inicialización de BD PostgreSQL
- 📄 `reportGenerator` (dentro de `src/`) - Generación de PDFs de comprobante/cierre

**URLs**:
- 🖥️ App (dev): http://localhost:3000
- 🔌 API (dev): http://localhost:3003
- 🌐 Producción: https://restaurante-codex-production.up.railway.app

---

## ✅ Checklist de Documentación

- ✅ README principal completo
- ✅ Documentación de API REST
- ✅ Ejemplos de uso
- ✅ Solución de problemas
- ✅ Índice de documentación (este archivo)
- ⚠️ Guías de SQLite/migración marcadas como históricas (arquitectura reemplazada por PostgreSQL)

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

**Última actualización**: 28 de Septiembre de 2026  
**Versión**: 2.4.0  
**Estado**: ✅ Completo
