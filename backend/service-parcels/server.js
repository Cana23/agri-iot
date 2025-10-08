require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');
const parcelRoutes = require('./src/routes/parcels.routes');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/parcels', parcelRoutes);

const PORT = process.env.PARCEL_PORT || 3003;
app.listen(PORT, () => console.log(`Parcel service running on port ${PORT}`));