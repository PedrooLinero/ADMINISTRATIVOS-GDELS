const express = require("express");
const router = express.Router();
const ShiftController = require("../controller/shiftController");

// Ruta para guardar un registro de jornada
router.post("/save-shift", ShiftController.saveShift);

// Ruta para descargar el archivo Excel
router.get("/download-excel", ShiftController.downloadExcel);

module.exports = router;