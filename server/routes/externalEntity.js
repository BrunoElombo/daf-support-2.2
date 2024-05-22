const express = require('express');
const router = express.Router();
const externalEntityController = require('../controllers/externalEntityController');
const verifyToken = require("../middlewear/verifyJWT");

// CRUD operations for Entity
router.get('/', verifyToken, externalEntityController.getAllEntities);
router.post('/', verifyToken, externalEntityController.createEntity);
router.get('/:id',  verifyToken, externalEntityController.getEntityById);
router.put('/:id',  verifyToken, externalEntityController.updateEntity);
router.delete('/:id',   verifyToken, externalEntityController.deleteEntity);

// Get entity detail including specific employees
// router.get('/:id_entity/detail', EntityController.getEntityDetail);

module.exports = router;
