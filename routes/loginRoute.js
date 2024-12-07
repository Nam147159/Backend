const express = require('express');
const router = express.Router();
const {login, OAuthLogin} = require('../controllers/authController');

router.route('/').post(login);
//router.route('/oauth').post(OAuthLogin);

module.exports = router;