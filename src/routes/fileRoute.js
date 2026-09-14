//just for testing purpose. uploadMiddleware.js file, fileRoute.js file and uploads folder we have all of them are for testing.

const express = require('express');
const router = express.Router();

const upload = require('../middleware/uploadMiddleware');

router.post(
  '/upload',
  upload.single('image'),
  (req, res) => {
    console.log('file', req.file);

    res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file,
    });
  }
);

module.exports = router;