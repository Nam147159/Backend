const express = require('express');
const router = express.Router();
const {register, setUsernameOnSignUp} = require('../controllers/authController');
//const {verifyToken} = require('../middleware/auth');
router.route('/').post(register);

module.exports = router;