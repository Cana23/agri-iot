// archivo: backend-sensores/middleware/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config(); // Asegúrate de cargar las variables de entorno

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  const token = authHeader.split(' ')[1]; // Extrae el token de "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Formato de token inválido.' });
  }

  // Verifica el token usando la clave secreta local
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ message: 'Token no es válido o ha expirado.' });
    }
    
    // Si el token es válido, adjuntamos los datos del usuario a la petición
    req.user = decodedUser; 
    next(); // Y permitimos que la petición continúe hacia el controlador
  });
};

module.exports = verifyToken;