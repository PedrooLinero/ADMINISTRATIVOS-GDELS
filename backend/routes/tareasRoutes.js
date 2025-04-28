const express = require("express");
const router = express.Router();
const tareasController = require("../controller/tareasController");

// Definir las rutas para las tareas
router.get("/", tareasController.getAllTareas);
router.get("/:id", tareasController.getTareaById);

module.exports = router;