const express = require('express');
const siteRoutes = express.Router();
const { getAllSites } = require("../controllers/siteController");

const verifyJWT = require("../middlewear/verifyJWT");

siteRoutes.get("/", getAllSites);

module.exports = siteRoutes;