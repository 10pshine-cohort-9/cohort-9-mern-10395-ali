const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(express());

//Route Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'server is healthy' });
});

module.exports = app;