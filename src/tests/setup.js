//we have created this setup.js file to set the environment variable for test database before running the test cases.
// This is because we want to use a separate database for testing and not the main database.
// We will use the .env.test file to set the environment variable for test database. We will use the dotenv 
// package to load the environment variable from the .env.test file.

//this setup.js file is being called from package.json when we do the npm test.
require('dotenv').config({
  path: '.env.test'
});

// console.log('TEST DATABASE:', process.env.DATABASE_URL);