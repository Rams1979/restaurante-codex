# 📚 Guía de Migración v1.x → v2.0

Migración de **Restaurante Codex** desde sistema basado en archivos a **SQLite**.

---

## ¿Qué Cambió?

| Aspecto | v1.x | v2.0 |
|--------|------|------|
| **Productos** | `productos.xlsx` | Tabla SQLite |
| **Recetas** | `recetas.xlsx` | Tabla SQLite |
| **Clientes** | `clientes.txt` | Tabla SQLite |
| **Órdenes** | No guardadas | Tabla SQLite |
| **API** | Archivos | REST con Endpoints |
| **Gestión** | Carga manual | Gestores CRUD |

---

## 🔄 Proceso de Migración

### Paso 1: Actualizar Código
```bash
# Descargar nueva versión (v2.0)
# o hacer pull si está en git
git pull origin main
```

### Paso 2: Instalar Dependencias Nuevas
```bash
npm install
```

Nuevas dependencias:
- `better-sqlite3` - Base de datos SQLite rápida
- `sqlite3` - Driver alternativo

### Paso 3: Crear Nueva Base de Datos
```bash
node db-init.js
```

Esto crea:
- 📦 Tabla `productos`
- 🍹 Tabla `recetas`
- 👤 Tabla `clientes`
- 📋 Tabla `órdenes`
- 📝 Tabla `órdenes_items`

### Paso 4: Migrar Tus Datos
```bash
# Opción 1: Migrar todo (RECOMENDADO)
node migrate-all.js

# Opción 2: Migrar por separado
node migrate-excel-to-sqlite.js      # Productos + Recetas
node migrate-clientes-to-sqlite.js   # Clientes
```

### Paso 5: Verificar Migración
```bash
sqlite3 codex.db

# Ver si hay datos
SELECT COUNT(*) as productos FROM productos;
SELECT COUNT(*) as recetas FROM recetas;
SELECT COUNT(*) as clientes FROM clientes;

# Ver clientes migrados
SELECT nombre, descuento FROM clientes;

# Salir
.quit
```

### Paso 6: Iniciar Aplicación
```bash
npm run dev
```

---

## ✅ Verificación Post-Migración

### En la Aplicación
1. ✅ Abrir http://localhost:3000
2. ✅ Ver mesas y asientos de barra
3. ✅ Ver botón "📦 Gestionar Productos"
4. ✅ Hacer clic y ver lista de productos
5. ✅ Verificar clientes en selector

### En el Terminal
```bash
# Verificar API funcionando
curl http://localhost:3002/api/products
# Debe devolver JSON con productos

# Verificar clientes
curl http://localhost:3002/api/clients
# Debe devolver JSON con clientes
```

---

## 🆘 Problemas Comunes

### "migrate-all.js no encuentra archivos"
**Causa**: Archivos Excel/txt no están en la carpeta `codex-pos/`

**Solución**:
```bash
# Copiar archivos a la carpeta correcta
cp /ruta/antigua/productos.xlsx ./codex-pos/
cp /ruta/antigua/recetas.xlsx ./codex-pos/
cp /ruta/antigua/clientes.txt ./codex-pos/

# Luego ejecutar migración
node migrate-all.js
```

### "Error: SQLITE_CANTOPEN"
**Causa**: Permiso de escritura o BD corrompida

**Solución**:
```bash
# Eliminar BD actual (cuidado: perderás datos!)
rm codex.db

# Recrear desde cero
node db-init.js
node migrate-all.js
```

### "Los productos no aparecen en la app"
**Causa**: BD no se migró correctamente

**Solución**:
```bash
# 1. Verificar datos en BD
sqlite3 codex.db "SELECT COUNT(*) FROM productos;"

# 2. Si dice 0, la migración falló
# 3. Revisar que los archivos Excel existen
# 4. Reintentar migración
node migrate-all.js

# 5. Si sigue fallando, hacerlo manual:
# Abrir ProductsManager en la app y agregar productos uno por uno
```

### "No puedo editar productos"
**Causa**: Posible falta de permisos en BD

**Solución**:
```bash
# Cambiar permisos (si es necesario)
chmod 666 codex.db

# Reiniciar app
npm run dev
```

---

## 📊 Datos Migrados (v2.0.0)

```
✅ Productos migrados:        21
✅ Recetas migradas:           5
✅ Clientes migrados:          6
✅ Total de registros:        32

Clientes:
  - Test
  - Rolando Mata (desc 4%)
  - Carlos Mendoza (desc 4%)
  - María García (desc 5%)
  - Evelyn (desc 0%)
  - 1 (test, desc 4%)
```

---

## 🆕 Nuevas Funcionalidades en v2.0

### 1. Gestión CRUD de Productos
```
📦 Gestionar Productos → Agregar/Editar/Eliminar en tiempo real
```
Antes: Carga única desde Excel  
Ahora: Gestión dinámica en BD

### 2. Gestión CRUD de Recetas
```
🍹 Gestionar Recetas → Crear cócteles sobre la marcha
```
Antes: Carga única desde Excel  
Ahora: Gestión dinámica en BD

### 3. Carga Automática
```
Al iniciar app → Carga productos desde BD automáticamente
```
Antes: Necesario cargar Excel  
Ahora: Datos listos al iniciar

### 4. Historial de Órdenes
```
Tabla órdenes → Guarda todas las transacciones
```
Antes: No se guardaban  
Ahora: Disponible para reportes futuros

### 5. API REST
```
http://localhost:3002/api/products  → CRUD de productos
http://localhost:3002/api/recipes   → CRUD de recetas
http://localhost:3002/api/clients   → CRUD de clientes
```

---

## 🔄 Rollback (Volver a v1.x)

Si necesitas volver a la versión anterior:

```bash
# 1. Hacer backup de BD
cp codex.db codex.db.backup

# 2. Cambiar a rama anterior
git checkout v1.1.1

# 3. Limpiar dependencias
rm -rf node_modules
npm install

# 4. Reiniciar
npm run dev
```

⚠️ **Nota**: Los datos guardados en órdenes (v2.0) se perderán.

---

## 📋 Checklist Post-Migración

- [ ] Base de datos inicializada (`codex.db` existe)
- [ ] Datos migrados (21 productos, 5 recetas, 6 clientes)
- [ ] App abre en http://localhost:3000
- [ ] API responde en http://localhost:3002
- [ ] Productos visibles en pantalla principal
- [ ] Clientes visibles en selector
- [ ] Botones 📦 Productos y 🍹 Recetas funcionan
- [ ] Se pueden agregar nuevos productos
- [ ] Se pueden agregar nuevos clientes
- [ ] Órdenes se crean correctamente
- [ ] Cálculos de descuentos correctos

---

## 🎯 Próximos Pasos

Después de migrar exitosamente:

1. **Backup Automático**
   ```bash
   # Hacer backup periódico
   cp codex.db codex.db.$(date +%Y%m%d).backup
   ```

2. **Limpiar Archivos Antiguos** (Opcional)
   ```bash
   # Ya no se necesitan
   rm productos.xlsx
   rm recetas.xlsx
   rm clientes.txt
   ```

3. **Actualizar Documentos Internos**
   - Cambiar guías de usuario
   - Entrenar personal
   - Actualizar procesos

4. **Configurar Reportes**
   - Ver historial de órdenes
   - Análisis de ventas
   - Inventario por período

---

## 📞 Soporte

Si tienes problemas durante la migración:

1. **Ver logs del servidor**
   ```bash
   node api-server.js
   # Observar mensajes de error
   ```

2. **Revisar BD directamente**
   ```bash
   sqlite3 codex.db
   .schema  # Ver estructura
   SELECT * FROM productos LIMIT 5;  # Ver datos
   ```

3. **Contactar desarrollador**
   - Adjuntar los logs
   - Indicar qué error específico sale
   - Mencionar qué versión anterior usabas

---

**¡Migración completada! 🎉**

Tu sistema está listo para usar con todas las ventajas de SQLite.
