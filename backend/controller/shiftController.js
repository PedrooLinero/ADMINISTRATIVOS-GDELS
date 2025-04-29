// controllers/ShiftController.js
const { guardarRegistroEnExcel, getExcelFile } = require('../utils/excelUtils');
const { logMensaje } = require('../utils/logger');

class ShiftController {
  async saveShift(req, res) {
    try {
      const record = req.body; // ya contiene operario, departamento, etc.
      await guardarRegistroEnExcel(record);
      logMensaje('Registro guardado en Excel correctamente');
      res.status(200).json({ message: 'Registro guardado correctamente' });
    } catch (error) {
      logMensaje(`Error al guardar el registro en Excel: ${error.message}`);
      res.status(500).json({ error: 'Error al guardar el registro' });
    }
  }

  async downloadExcel(req, res) {
    try {
      logMensaje('Iniciando descarga del archivo Excel...');
      const buffer = await getExcelFile();
      res
        .status(200)
        .set({
          'Content-Type':        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=PartesTrabajo.xlsx'
        })
        .send(buffer);
    } catch (error) {
      logMensaje(`Error al descargar el Excel: ${error.message}`);
      res.status(500).json({ error: 'Error al descargar el archivo' });
    }
  }
}

module.exports = new ShiftController();
