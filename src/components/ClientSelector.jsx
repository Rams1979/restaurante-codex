import { useState, useEffect } from 'react'

function ClientSelector({ onSelectClient, onCancel }) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

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
              <button
                key={index}
                className="client-btn"
                onClick={() => onSelectClient(client)}
              >
                <div className="client-name">{client.nombre}</div>
                <div className="client-info">{client.celular}</div>
              </button>
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
