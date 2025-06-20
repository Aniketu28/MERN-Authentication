const express = require('express');
const {register, login, logout,sendEmailVerificationOtp,verifyEmailOtp, isAuthenticated, sendResetOtp, resetPassword} = require('../controllers/Auth.controller');
const AuthMiddleware = require('../middleware/Auth.middleware');

const AuthRouter = express.Router();

AuthRouter.post('/register', register);
AuthRouter.post('/login', login);
AuthRouter.post('/logout', logout);
AuthRouter.post('/send-verify-otp',AuthMiddleware,sendEmailVerificationOtp);
AuthRouter.post('/verify-otp',AuthMiddleware,verifyEmailOtp);
AuthRouter.get('/authenticated-user',AuthMiddleware,isAuthenticated);
AuthRouter.post('/send-reset-otp',sendResetOtp)
AuthRouter.post('/reset-password',resetPassword);;

module.exports = AuthRouter