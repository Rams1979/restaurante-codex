# Script para iniciar tanto el API server como Vite dev server

Write-Host "🚀 Iniciando Codex POS System..." -ForegroundColor Green
Write-Host ""

# Obtener la ruta del directorio actual
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Iniciar API server en background
Write-Host "📡 Iniciando API Server en puerto 3002..." -ForegroundColor Cyan
$apiProcess = Start-Process node -ArgumentList "$rootDir\api-server.js" -NoNewWindow -PassThru

Start-Sleep -Seconds 2

# Iniciar Vite dev server
Write-Host "⚡ Iniciando Vite dev server en puerto 3000..." -ForegroundColor Cyan
Set-Location $rootDir
& npm run dev

# Limpiar al salir
$apiProcess | Stop-Process -Force -ErrorAction SilentlyContinue
