'use strict'
var express = require('express');
var admincontroller = require('../controllers/adminController');
var api = express.Router();

api.post('/registro_admin', admincontroller.registro_admin);
api.post('/login_admin', admincontroller.login_admin);
api.post('/reset_password', admincontroller.resetPassword); // Nueva ruta para restablecer la contraseña

module.exports = api;
