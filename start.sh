#!/bin/bash
set -e

echo "📦 Instalando dependencias..."
npm ci --only=production

echo "🔨 Compilando React..."
npm run build

echo "🚀 Iniciando servidor..."
node api-server.js
