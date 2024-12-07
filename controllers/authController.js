const {isSignUpDataValid, isOAuthSignUpDataValid, isPasswordValid} = require('../services/validationService');
//const {verifyRefreshToken, generateTokens} = require('../services/JWTServices')
//const Auth = require('../models/Auth');
//const User = require('../models/User');
const config = require("config");
//const jwt = require('jsonwebtoken');
const fs = require('fs');
//const speakeasy = require('speakeasy');

const login = (req, res) => {
    const identifier = req.body.identifier;
    const password = req.body.password;
    console.log(identifier, password)
    const db = req.app.get('db');
    db.raw('SELECT fn_sign_in(:identifier, :password) as user_info', { identifier, password }).then(async result => {
        if (result.rows.length > 0) {
            res.status(200).json({
                "success": true,
                "message": "Signed in successfully.",
                "data": [result.rows[0].user_info]
            });
        } else {
            res.status(400).json({
                "success": false,
                "message": "Invalid username or password",
                "data": []
            });
        }
    }).catch(error => {
        console.log(error.message);
        res.status(500).json({
            "success": false,
            "message": "Internal server error",
            "data": []
        });
    });
}

const register = (req, res) => {
    const email = req.body.email;
    const gender = req.body.gender;
    const birthday = req.body.dateOfBirth;
    const password = req.body.password;
    const username = req.body.username;
    console.log("Date of birth", birthday)
    
    isSignUpDataValid(email, password, username).then(isDataValid => {
        if (isDataValid.valid) {
            const db = req.app.get('db');
            console.log("Full request body:", req.body);
            db.raw('Call prc_sign_up(:username, :email, :password, :birthday, :gender)',
                { p_username: username, P_email: email, p_password: password, p_birthday: birthday, p_gender: gender }).then(result => {
                res.status(200).json({
                    "success": true,
                    "message": "Signed up successfully.",
                    "data": []
                });
            }).catch(error => {
                console.log(error);
                res.status(400).json({
                    "success": false,
                    "message": error.message,
                    "data": []
                });
            });
        } else {
            console.log(isDataValid)
            res.status(400).json({
                "success": false,
                "message": isDataValid.message,
                "data": []
            });
        }
    });
}

module.exports = {
    login,
    register
}