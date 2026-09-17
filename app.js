require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();
const usersRouter = require('./src/routes/usersRoute');
const storeRouter = require('./src/routes/storeRoute');
const authRouter = require('./src/routes/authRoute');
const fileRouter = require('./src/routes/fileRoute');
const logger = require('./src/middleware/logger');
const errorHandler = require('./src/middleware/errorHandler');

// Middleware to parse JSON requests
app.use(express.json());
app.use(logger);

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/store', storeRouter);
app.use('/file', fileRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the uploads directory so browser can access the uploaded images. We can access the image by using the URL http://localhost:3000/uploads/<image_name>.
// express.static -> makes the stored image accessible through HTTP.
// app.use(errorHandler); // Uncomment this line to enable the centralized error handling middleware, currently we are handling errors in the controller itself.
module.exports = app;