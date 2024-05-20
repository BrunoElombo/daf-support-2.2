const express = require('express')
const userRoutes = express.Router()
const userController = require("../controllers/userController");
const verifyToken = require("../middlewear/verifyJWT");

userRoutes.get('/account', verifyToken, userController.getUser);
userRoutes.get('/:id', userController.getUser);
userRoutes.post('/', userController.createUser);
userRoutes.delete('/:id', userController.deleteUser);


module.exports = userRoutes;