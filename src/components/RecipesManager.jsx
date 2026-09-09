import { useState, useEffect } from 'react'

function RecipesManager({ onClose }) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    ingredientes: '',
    instrucciones: '',
    tiempo: ''
  })

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/recipes')
      if (response.ok) {
        const data = await response.json()
        setRecipes(data)
      }
    } catch (err) {
      setError('Error al cargar recetas')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (recipe) => {
    setEditingId(recipe.codigo)
    setFormData({
      codigo: recipe.codigo,
      nombre: recipe.nombre,
      ingredientes: recipe.ingredientes || '',
      instrucciones: recipe.instrucciones || '',
      tiempo: recipe.tiempo || ''
    })
  }

  const handleDelete = async (codigo) => {
    if (confirm(`¿Eliminar receta ${codigo}?`)) {
      try {
        const response = await fetch(`/api/recipes/${codigo}`, { method: 'DELETE' })
        if (response.ok) {
          setRecipes(recipes.filter(r => r.codigo !== codigo))
        }
      } catch (err) {
        setError('Error al eliminar receta')
      }
    }
  }

  const handleSave = async () => {
    try {
      const url = editingId ? `/api/recipes/${editingId}` : '/api/recipes'
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
          nombre: '',
          ingredientes: '',
          instrucciones: '',
          tiempo: ''
        })
        fetchRecipes()
      }
    } catch (err) {
      setError('Error al guardar receta')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2>🍹 Gestión de Recetas</h2>

        {error && <div className="error-message">{error}</div>}

        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Agregar/Editar Receta</h3>
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
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="Tiempo (ej: 15 min)"
              value={formData.tiempo}
              onChange={(e) => setFormData({...formData, tiempo: e.target.value})}
              style={{ padding: '0.5rem' }}
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <textarea
              placeholder="Ingredientes (uno por línea)"
              value={formData.ingredientes}
              onChange={(e) => setFormData({...formData, ingredientes: e.target.value})}
              rows="3"
              style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace' }}
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <textarea
              placeholder="Instrucciones"
              value={formData.instrucciones}
              onChange={(e) => setFormData({...formData, instrucciones: e.target.value})}
              rows="3"
              style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace' }}
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleSave} className="btn btn-primary">
              {editingId ? '💾 Guardar Cambios' : '➕ Agregar Receta'}
            </button>
            {editingId && (
              <button onClick={() => setEditingId(null)} className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>
                ❌ Cancelar
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p>Cargando recetas...</p>
        ) : recipes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>No hay recetas registradas</p>
        ) : (
          <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0 }}>
                <tr style={{ backgroundColor: '#5a5a5a', color: 'white' }}>
                  <th style={{ padding: '0.8rem', textAlign: 'left', fontSize: '0.9rem' }}>Código</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left', fontSize: '0.9rem' }}>Nombre</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left', fontSize: '0.9rem' }}>Tiempo</th>
                  <th style={{ padding: '0.8rem', textAlign: 'center', fontSize: '0.9rem' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe) => (
                  <tr key={recipe.codigo} style={{ borderBottom: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
                    <td style={{ padding: '0.8rem', fontSize: '0.9rem' }}>{recipe.codigo}</td>
                    <td style={{ padding: '0.8rem', fontSize: '0.9rem' }}>{recipe.nombre}</td>
                    <td style={{ padding: '0.8rem', fontSize: '0.9rem' }}>{recipe.tiempo || '-'}</td>
                    <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(recipe)}
                        className="btn-edit"
                        title="Editar receta"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(recipe.codigo)}
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
                          backgroundColor: '#ffcdd2',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#ef9a9a'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#ffcdd2'}
                        title="Eliminar receta"
                      >
                        🗑️
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

export default RecipesManager
