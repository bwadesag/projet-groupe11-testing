const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      message: 'Un véhicule avec ce numéro d\'immatriculation existe déjà'
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(404).json({
      message: 'Ressource non trouvée'
    });
  }

  res.status(500).json({
    message: 'Une erreur interne est survenue'
  });
};

module.exports = errorHandler; 