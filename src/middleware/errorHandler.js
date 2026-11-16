function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}

// Central error handler: keeps stack traces / DB details out of responses.
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}

module.exports = { notFound, errorHandler };
