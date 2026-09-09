import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'codex.db')

console.log('Inicializando base de datos en:', dbPath)

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

// Crear tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS productos (
    codigo TEXT PRIMARY KEY,
    descripcion TEXT NOT NULL,
    precio REAL NOT NULL,
    inventario INTEGER NOT NULL,
    receta TEXT,
    peso TEXT,
    promoNombre TEXT,
    promoCantidad INTEGER,
    promoPrecio REAL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS recetas (
    codigo TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    ingredientes TEXT,
    instrucciones TEXT,
    tiempo TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    celular TEXT,
    edad TEXT,
    correo TEXT,
    descuento INTEGER DEFAULT 0,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ordenes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numeroMesa TEXT,
    cliente_id INTEGER,
    subtotal REAL,
    descuento REAL,
    impuesto REAL,
    servicio REAL,
    total REAL,
    estado TEXT DEFAULT 'pendiente',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
  );

  CREATE TABLE IF NOT EXISTS ordenes_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orden_id INTEGER NOT NULL,
    codigo TEXT NOT NULL,
    descripcion TEXT,
    cantidad INTEGER,
    precio REAL,
    isPromo INTEGER DEFAULT 0,
    FOREIGN KEY (orden_id) REFERENCES ordenes(id)
  );

  CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre);
  CREATE INDEX IF NOT EXISTS idx_clientes_celular ON clientes(celular);
  CREATE INDEX IF NOT EXISTS idx_ordenes_mesa ON ordenes(numeroMesa);
  CREATE INDEX IF NOT EXISTS idx_ordenes_fecha ON ordenes(createdAt);
`)

console.log('✅ Base de datos inicializada correctamente')
db.close()
