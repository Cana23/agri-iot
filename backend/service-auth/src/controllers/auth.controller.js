// archivo: backend/service-auth/src/controllers/auth.controller.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

// Función auxiliar para generar el token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashed, role: 'admin' }
    });

    const token = generateToken(user);
    // Preparamos la respuesta del usuario sin la contraseña
    const userResponse = { id: user.id, username: user.username, email: user.email, role: user.role };
    
    // Devolvemos AMBOS, el token y el usuario
    res.status(201).json({ token, user: userResponse });

  } catch (err) {
    res.status(400).json({ message: 'El correo electrónico ya está en uso' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });

  const token = generateToken(user);

  // Preparamos la respuesta del usuario sin la contraseña
  const userResponse = { id: user.id, username: user.username, email: user.email, role: user.role };
  
  // Devolvemos AMBOS, el token y el usuario
  res.json({ token, user: userResponse });
};