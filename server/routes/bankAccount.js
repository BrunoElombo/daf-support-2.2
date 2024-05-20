const express = require("express");
const bankAccountRouter = express.Router();
const verifyJWT = require("../middlewear/verifyJWT");
const { getBankByEmployee, getBankByEntity } = require("../controllers/bankController")

// bankRouter.get("/", verifyJWT, getEmployeeBanks);
bankAccountRouter.get("/:entity_id", verifyJWT, getBankByEntity);
bankAccountRouter.get("/:employee_id", verifyJWT, getBankByEmployee);


module.exports = bankAccountRouter