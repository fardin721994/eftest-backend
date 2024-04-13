const express = require("express");
const { check } = require("express-validator");

const adminsController = require("../controllers/admins-controllers");

const router = express.Router();
router.post("/login", adminsController.login);

module.exports = router;
