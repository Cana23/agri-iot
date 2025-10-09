require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);

const PORT = process.env.AUTH_PORT || 3001;
app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
