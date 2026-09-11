# 🚀 Configurar Restaurante Codex en GitHub

## Objetivo
Sincronizar el proyecto entre 2 computadoras usando GitHub

---

## PASO 1: Crear Repositorio en GitHub

### 1.1 Ir a GitHub.com
1. Abre https://github.com
2. Inicia sesión o crea una cuenta
3. Haz clic en el ícono **+** arriba a la derecha
4. Selecciona **New repository**

### 1.2 Crear el repositorio
- **Nombre del repositorio**: `restaurante-codex` (o el que prefieras)
- **Descripción**: "Sistema POS para Restaurante Codex con SQLite, React y Node.js"
- **Privado o Público**: Elige **Privado** (solo tú y tu equipo)
- **NO inicialices con README** (ya tenemos archivos)
- Haz clic en **Create repository**

### 1.3 GitHub te mostrará 3 comandos
Copia estos comandos, los necesitarás en el Paso 2

---

## PASO 2: Conectar el Proyecto Local a GitHub

Abre PowerShell en la carpeta del proyecto (`C:\Users\rolando.mata\OneDrive - asembis\Codex\codex-pos`)

### 2.1 Agregar el remote de GitHub
Reemplaza `TU_USUARIO` y `restaurante-codex` según corresponda:

```powershell
git remote add origin https://github.com/TU_USUARIO/restaurante-codex.git
git branch -M main
git push -u origin main
```

**Ejemplo real**:
```powershell
git remote add origin https://github.com/rolando-mata/restaurante-codex.git
git branch -M main
git push -u origin main
```

### 2.2 Ingresar credenciales
GitHub te pedirá:
- **Username**: Tu usuario de GitHub
- **Password**: Tu token de acceso personal (copia desde https://github.com/settings/tokens)

---

## PASO 3: Clonar en la Segunda Computadora

En la **segunda computadora**, abre PowerShell:

```powershell
# Ir a la carpeta donde quieres el proyecto
cd C:\Users\TU_USUARIO\OneDrive

# Clonar el repositorio
git clone https://github.com/TU_USUARIO/restaurante-codex.git codex-pos

# Entrar en la carpeta
cd codex-pos

# Instalar dependencias
npm install

# Crear base de datos (si no existe)
node db-init.js

# Iniciar la aplicación
npm run dev
```

---

## PASO 4: Sincronización Diaria

### 4.1 En la Computadora 1 (después de hacer cambios)
```powershell
cd C:\Users\rolando.mata\OneDrive - asembis\Codex\codex-pos

# Ver qué cambió
git status

# Agregar cambios
git add .

# Hacer commit
git commit -m "Tu mensaje descriptivo"

# Subir a GitHub
git push
```

### 4.2 En la Computadora 2 (para traer cambios)
```powershell
cd C:\Users\TU_USUARIO\OneDrive\codex-pos

# Traer cambios de GitHub
git pull

# Si algo cambió en dependencias
npm install

# Reiniciar aplicación
npm run dev
```

---

## 🔑 Crear Token de Acceso Personal en GitHub

1. Ve a https://github.com/settings/tokens
2. Haz clic en **Generate new token**
3. Dale un nombre: "Restaurante Codex"
4. Selecciona permisos:
   - ✅ repo (full control)
   - ✅ workflow
5. Haz clic en **Generate token**
6. **Copia el token inmediatamente** (solo aparece una vez)
7. Usa este token como contraseña en `git push`

---

## 📋 Workflow Recomendado

### Computadora 1 (Producción/Principal)
```
1. Haz cambios
2. git add .
3. git commit -m "descripción"
4. git push
```

### Computadora 2 (Secundaria)
```
1. git pull (al inicio del día)
2. npm install (si cambió package.json)
3. Usa la app
4. Si haces cambios:
   - git add .
   - git commit -m "descripción"
   - git push
```

---

## ⚠️ Resolver Conflictos

Si ambas computadoras modifican el mismo archivo:

```powershell
# Traer cambios
git pull

# Git te mostrará conflictos
# Edita los archivos manualmente
# Busca las líneas con <<<<<<, ======, >>>>>>

# Después de resolver
git add .
git commit -m "Resolver conflictos en [archivo]"
git push
```

---

## 🗄️ Lo que NO se sincroniza (en .gitignore)

- `node_modules/` (se regeneran con `npm install`)
- `codex.db-shm` y `codex.db-wal` (archivos temporales)
- `.env` (configuración local)
- `*.pdf` (archivos generados)

La base de datos `codex.db` SÍ se sincroniza para compartir datos.

---

## ✅ Verificar Conexión

```powershell
git remote -v
```

Deberías ver:
```
origin  https://github.com/TU_USUARIO/restaurante-codex.git (fetch)
origin  https://github.com/TU_USUARIO/restaurante-codex.git (push)
```

---

## 🆘 Problemas Comunes

### "Error: fatal: remote origin already exists"
```powershell
git remote remove origin
# Luego repite el comando git remote add origin ...
```

### "Error: authentication failed"
Usa tu token de GitHub, no tu contraseña

### "Error: merge conflicts"
```powershell
git status  # Ver archivos en conflicto
# Editar los archivos manualmente
git add .
git commit -m "Resolver conflictos"
git push
```

---

## 📞 Comandos Útiles

```powershell
# Ver estado
git status

# Ver historial
git log --oneline

# Ver cambios pendientes
git diff

# Ver cambios preparados
git diff --staged

# Traer cambios sin mergear
git fetch

# Ver rama actual
git branch
```

---

**¡Con esto podrás sincronizar el proyecto en 2 computadoras! 🎉**
