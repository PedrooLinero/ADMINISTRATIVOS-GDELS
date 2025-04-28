const express = require("express");
const router = express.Router();
const operariosController = require("../controller/operariosController");

// Nueva ruta para obtener TODOS los operarios
router.get("/", operariosController.getAllOperarios);

// Nueva ruta para obtener operarios por departamento
router.get("/departamento/:id", operariosController.getOperariosByDepartamento);

module.exports = router;