const express = require('express');
const router = express.Router();
const EntityController = require('../controllers/entityController');
const verifyToken = require("../middlewear/verifyJWT");

// CRUD operations for Entity
router.get('/', verifyToken, EntityController.getAllEntities);
router.get('/all', verifyToken, EntityController.ListAllEntities);
router.post('/', verifyToken, EntityController.createEntity);
router.get('/:id',  verifyToken, EntityController.getEntityById);
router.put('/:id',  verifyToken, EntityController.updateEntity);
router.delete('/:id',   verifyToken, EntityController.deleteEntity);

// Get entity detail including specific employees
router.get('/:entity_id', EntityController.getEmployeeEntities);

module.exports = router;
