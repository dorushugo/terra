// Setup spécifique pour les tests d'intégration (environnement node)

// Load .env files
import 'dotenv/config'

// Pas de Jest-DOM ici car on est dans un environnement Node.js
// et on ne teste pas de composants React
