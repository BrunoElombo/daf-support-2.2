const express = require("express");
const employeeRouter = express.Router()
const employeeController = require("../controllers/employeeController")
const verifyJWT = require("../middlewear/verifyJWT")


employeeRouter.get('/hierarchy', verifyJWT, employeeController.getEmployeeHierarchy);
employeeRouter.get('/controllers', verifyJWT, employeeController.getEmployeeControllers);
employeeRouter.get('/:employeeId/colleagues', employeeController.getEmployeeColleagues);
employeeRouter.get('/:entity_id/entities', employeeController.getEmployeeEntities);
employeeRouter.get('/',verifyJWT, employeeController.getEmployeeByEntity);


module.exports = employeeRouter;