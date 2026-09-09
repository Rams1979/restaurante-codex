import { useState, useEffect } from 'react'

function ProductsManager({ onClose }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: '',
    precio: '',
    inventario: '',
    receta: '',
    peso: '',
    promoNombre: '',
    promoCantidad: '',
    promoPrecio: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (err) {
      setError('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setEditingId(product.codigo)
    setFormData({
      codigo: product.codigo,
      descripcion: product.descripcion,
      precio: product.precio,
      inventario: product.inventario,
      receta: product.receta || '',
      peso: product.peso || '',
      promoNombre: product.promoNombre || '',
      promoCantidad: product.promoCantidad || '',
      promoPrecio: product.promoPrecio || ''
    })
  }

  const handleInactive = async (codigo) => {
    if (confirm(`¿Inactivar producto ${codigo}?`)) {
      try {
        const response = await fetch(`/api/products/${codigo}`, { method: 'DELETE' })
        if (response.ok) {
          setProducts(products.filter(p => p.codigo !== codigo))
        }
      } catch (err) {
        setError('Error al inactivar producto')
      }
    }
  }

  const handleSave = async () => {
    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products'
      const method = editingId ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setEditingId(null)
        setFormData({
          codigo: '',
          descripcion: '',
          precio: '',
          inventario: '',
          receta: '',
          peso: '',
          promoNombre: '',
          promoCantidad: '',
          promoPrecio: ''
        })
        fetchProducts()
      }
    } catch (err) {
      setError('Error al guardar producto')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2>📦 Gestión de Productos</h2>

        {error && <div className="error-message">{error}</div>}

        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Agregar/Editar Producto</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Código"
              value={formData.codigo}
              onChange={(e) => setFormData({...formData, codigo: e.target.value})}
              disabled={editingId !== null}
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              style={{ padding: '0.5rem' }}
            />
            <input
              type="number"
              placeholder="Precio"
              value={formData.precio}
              onChange={(e) => setFormData({...formData, precio: e.target.value})}
              style={{ padding: '0.5rem' }}
            />
            <input
              type="number"
              placeholder="Inventario"
              value={formData.inventario}
              onChange={(e) => setFormData({...formData, inventario: e.target.value})}
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="Receta (opcional)"
              value={formData.receta}
              onChange={(e) => setFormData({...formData, receta: e.target.value})}
              style={{ padding: '0.5rem' }}
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleSave} className="btn btn-primary">
              {editingId ? '💾 Guardar Cambios' : '➕ Agregar Producto'}
            </button>
            {editingId && (
              <button onClick={() => setEditingId(null)} className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>
                ❌ Cancelar
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p>Cargando productos...</p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>No hay productos registrados</p>
        ) : (
          <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0 }}>
                <tr style={{ backgroundColor: '#5a5a5a', color: 'white' }}>
                  <th style={{ padding: '0.8rem', textAlign: 'left', fontSize: '0.9rem' }}>Código</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left', fontSize: '0.9rem' }}>Descripción</th>
                  <th style={{ padding: '0.8rem', textAlign: 'right', fontSize: '0.9rem' }}>Precio</th>
                  <th style={{ padding: '0.8rem', textAlign: 'right', fontSize: '0.9rem' }}>Stock</th>
                  <th style={{ padding: '0.8rem', textAlign: 'center', fontSize: '0.9rem' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.codigo} style={{ borderBottom: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
                    <td style={{ padding: '0.8rem', fontSize: '0.9rem' }}>{product.codigo}</td>
                    <td style={{ padding: '0.8rem', fontSize: '0.9rem' }}>{product.descripcion}</td>
                    <td style={{ padding: '0.8rem', textAlign: 'right', fontSize: '0.9rem' }}>₡{product.precio.toFixed(2)}</td>
                    <td style={{ padding: '0.8rem', textAlign: 'right', fontSize: '0.9rem' }}>{product.inventario}</td>
                    <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(product)}
                        className="btn-edit"
                        title="Editar producto"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleInactive(product.codigo)}
                        style={{
                          width: '36px',
                          height: '36px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.1rem',
                          marginLeft: '0.5rem',
                          backgroundColor: '#fff3cd',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#ffe082'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#fff3cd'}
                        title="Inactivar producto"
                      >
                        ⊘
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <button onClick={onClose} className="btn btn-secondary">
            ❌ Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductsManager
