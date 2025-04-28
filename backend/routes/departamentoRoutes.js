const express = require("express");
const router = express.Router();
const departamentoController = require("../controller/departamentoController.js");

// Definir las rutas para los departamentos
router.get("/", departamentoController.getAllDepartamentos);

module.exports = router;