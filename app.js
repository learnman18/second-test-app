require('dotenv').config();

const express = require('express');
const app = express();
const usersRouter = require('./src/routes/usersRoute');
const storeRouter = require('./src/routes/storeRoute');
const authRouter = require('./src/routes/authRoute');
const logger = require('./src/middleware/logger');
const errorHandler = require('./src/middleware/errorHandler');

// Middleware to parse JSON requests
app.use(express.json());
app.use(logger);

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/store', storeRouter);
// app.use(errorHandler); // Uncomment this line to enable the centralized error handling middleware, currently we are handling errors in the controller itself.
module.exports = app;