import { useState } from 'react'

function ClientRegistration({ onClientRegistered, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    edad: '',
    correo: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.nombre || !formData.celular || !formData.edad || !formData.correo) {
      setError('Todos los campos son requeridos')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Error al registrar cliente')
      }

      const client = await response.json()
      onClientRegistered(client)
    } catch (err) {
      setError('Error al guardar cliente: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content client-registration">
        <h2>📝 Registro de Cliente</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre completo"
            />
          </div>

          <div className="form-group">
            <label>Celular *</label>
            <input
              type="tel"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              placeholder="Ej: +503 7777-7777"
            />
          </div>

          <div className="form-group">
            <label>Edad *</label>
            <input
              type="number"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              placeholder="Edad"
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Correo Electrónico *</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Guardando...' : '✅ Registrar'}
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClientRegistration
