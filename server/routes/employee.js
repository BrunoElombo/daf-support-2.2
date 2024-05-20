const express = require("express");
const employeeRouter = express.Router()
const employeeController = require("../controllers/employeeController")
const verifyJWT = require("../middlewear/verifyJWT")


employeeRouter.get('/hierarchy', verifyJWT, employeeController.getEmployeeHierarchy);
employeeRouter.get('/:employeeId/colleagues', employeeController.getEmployeeColleagues);
employeeRouter.get('/:employeeId/entities', employeeController.getEmployeeEntities);
employeeRouter.get('/',verifyJWT, employeeController.getEmployeeByEntity);


module.exports = employeeRouter;