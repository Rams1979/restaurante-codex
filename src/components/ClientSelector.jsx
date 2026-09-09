import { useState, useEffect } from 'react'

function ClientSelector({ onSelectClient, onCancel }) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingClient, setEditingClient] = useState(null)
  const [editFormData, setEditFormData] = useState({})

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (err) {
      setError('Error al cargar clientes')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (client) => {
    setEditingClient(client.id)
    setEditFormData({
      celular: client.celular,
      edad: client.edad,
      correo: client.correo,
      descuento: client.descuento || 0
    })
  }

  const cancelEdit = () => {
    setEditingClient(null)
    setEditFormData({})
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const saveEdit = async (clientId) => {
    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      })

      if (response.ok) {
        fetchClients()
        setEditingClient(null)
        setEditFormData({})
      }
    } catch (err) {
      setError('Error al actualizar cliente')
    }
  }

  const filteredClients = clients.filter(client =>
    client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.celular.includes(searchTerm)
  )

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>Cargando clientes...</p>
        </div>
      </div>
    )
  }

  if (editingClient) {
    const clientToEdit = clients.find(c => c.id === editingClient)
    return (
      <div className="modal-overlay">
        <div className="modal-content client-registration">
          <h2>✏️ Editar Cliente: {clientToEdit.nombre}</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={(e) => { e.preventDefault(); saveEdit(editingClient) }}>
            <div className="form-group">
              <label>Nombre (No se puede modificar)</label>
              <input
                type="text"
                value={clientToEdit.nombre}
                disabled
                className="disabled-field"
              />
            </div>

            <div className="form-group">
              <label>Celular *</label>
              <input
                type="tel"
                name="celular"
                value={editFormData.celular}
                onChange={handleEditChange}
                placeholder="Ej: +503 7777-7777"
              />
            </div>

            <div className="form-group">
              <label>Edad *</label>
              <input
                type="number"
                name="edad"
                value={editFormData.edad}
                onChange={handleEditChange}
                placeholder="Edad"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Correo Electrónico *</label>
              <input
                type="email"
                name="correo"
                value={editFormData.correo}
                onChange={handleEditChange}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="form-group">
              <label>Descuento (%) - 0 a 10</label>
              <input
                type="number"
                name="descuento"
                value={editFormData.descuento}
                onChange={handleEditChange}
                placeholder="0"
                min="0"
                max="10"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                💾 Guardar
              </button>
              <button type="button" onClick={cancelEdit} className="btn btn-secondary">
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content client-selector">
        <h2>👥 Seleccionar Cliente</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por nombre o celular..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="client-list">
          {filteredClients.length === 0 ? (
            <p className="no-clients">
              {clients.length === 0 ? 'No hay clientes registrados' : 'No se encontraron clientes'}
            </p>
          ) : (
            filteredClients.map((client, index) => (
              <div key={index} className="client-item">
                <button
                  className="client-btn"
                  onClick={() => onSelectClient(client)}
                >
                  <div className="client-name">{client.nombre}</div>
                  <div className="client-info">{client.celular} | Descuento: {client.descuento || 0}%</div>
                </button>
                <button
                  className="btn btn-edit"
                  onClick={() => startEdit(client)}
                  title="Editar cliente"
                >
                  ✏️
                </button>
              </div>
            ))
          )}
        </div>

        <div className="form-actions">
          <button
            onClick={() => onSelectClient({ nombre: 'Cliente de Contado', isContado: true })}
            className="btn btn-success"
          >
            💰 Cliente de Contado
          </button>
          <button onClick={onCancel} className="btn btn-secondary">
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClientSelector
