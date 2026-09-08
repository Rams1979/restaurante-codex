function RecipeModal({ product, recipe, onClose }) {
  if (!recipe) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="recipe-header">
          <h2>{recipe.nombre}</h2>
          <span className="recipe-time">⏱️ {recipe.tiempo}</span>
        </div>

        <div className="recipe-section">
          <h3>📋 Ingredientes</h3>
          <p className="recipe-text">{recipe.ingredientes}</p>
        </div>

        <div className="recipe-section">
          <h3>👨‍🍳 Instrucciones</h3>
          <p className="recipe-text">{recipe.instrucciones}</p>
        </div>

        <button className="modal-confirm" onClick={onClose}>
          Listo
        </button>
      </div>
    </div>
  )
}

export default RecipeModal
