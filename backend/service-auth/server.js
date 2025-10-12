require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./src/routes/auth.routes');
const expressStatusMonitor = require('express-status-monitor');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(expressStatusMonitor());

app.use('/api/auth', authRoutes);
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/status', (req, res) => res.redirect('/status'));

const PORT = process.env.AUTH_PORT || 3001;
app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
