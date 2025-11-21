const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const uploader = require('../utils/uploader');

router.post('/login', authController.login);
router.post('/register', uploader.single('avatar'), authController.register);


module.exports = router;