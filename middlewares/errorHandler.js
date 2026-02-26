/**
 * Middleware de gestion globale des erreurs
 */
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Erreur interne du serveur.";

  console.error(`[ERREUR ${status}] ${message}`);

  return res.status(status).json({
    success: false,
    message,
  });
};

/**
 * Middleware pour les routes inexistantes (404)
 */
const notFound = (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} introuvable.`,
  });
};

module.exports = { errorHandler, notFound };
