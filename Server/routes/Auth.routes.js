const express = require('express');
const {register, login, logout} = require('../controllers/Anth.controller')

const AuthRouter = express.Router();

AuthRouter.post('/register', register);
AuthRouter.post('/login', login);
AuthRouter.post('/logout', logout);

module.exports = AuthRouter