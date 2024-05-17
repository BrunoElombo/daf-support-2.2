const express = require('express');
const router = express.Router();
const EntityController = require('../controllers/entityController');
const verifyToken = require("../middlewear/verifyJWT");

// CRUD operations for Entity
router.get('/', verifyToken, EntityController.getAllEntities);
router.post('/', verifyToken, EntityController.createEntity);
router.get('/:id',  verifyToken, EntityController.getEntityById);
router.put('/:id',  verifyToken, EntityController.updateEntity);
router.delete('/:id',   verifyToken, EntityController.deleteEntity);

// Get entity detail including specific employees
router.get('/:id_entity/detail', EntityController.getEntityDetail);

module.exports = router;
