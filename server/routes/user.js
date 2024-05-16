const express = require('express')
const userRoutes = express.Router()
const userController = require("../controllers/userController");

userRoutes.get('/', userController.getAllUsers);
userRoutes.get('/:id', userController.getUser);
userRoutes.post('/', userController.createUser);
userRoutes.delete('/:id', userController.deleteUser);


module.exports = userRoutes;