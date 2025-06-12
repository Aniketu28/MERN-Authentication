const express = require('express');
const getUserData = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.get('/profile', AuthMiddleware, getUserData);

module.exports = userRouter;