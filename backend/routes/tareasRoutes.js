const express = require("express");
const router = express.Router();
const tareasController = require("../controller/tareasController");

// Definir las rutas para las tareas
router.get("/", tareasController.getAllTareas);
router.get("/departamento/:departamentoId", tareasController.getTareasByDepartamento); // Esta ruta debe ir ANTES de la ruta con :id
router.get("/:id", tareasController.getTareaById);

module.exports = router;