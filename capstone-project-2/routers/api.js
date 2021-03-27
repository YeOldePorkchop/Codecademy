const express = require("express");
const router = express.Router();

const employeesRouter = require("./employees");
router.use("/employees", employeesRouter);

const menuRouter = require("./menu");
router.use("/menus", menuRouter);

module.exports = router;
