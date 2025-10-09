const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Token requerido' });

  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

exports.requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Autenticación requerida' });
  if (req.user.role !== role && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};

exports.allowRoles = (roles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Autenticación requerida' });
  if (roles.includes(req.user.role) || req.user.role === 'admin') return next();
  return res.status(403).json({ error: 'Acceso denegado' });
};
