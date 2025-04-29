// utils/excelUtils.js
const ExcelJS = require('exceljs');
const fs      = require('fs');
const path    = require('path');

const excelFilePath = path.join(__dirname, '..', 'uploads', 'PartesTrabajo.xlsx');
const hojaNombre    = 'Registros Jornada';

function ensureUploadsDir() {
  const dir = path.dirname(excelFilePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function initializeWorkbook() {
  ensureUploadsDir();
  const workbook = new ExcelJS.Workbook();

  if (!fs.existsSync(excelFilePath) || fs.statSync(excelFilePath).size === 0) {
    // Si no existe o está vacío, creamos con cabeceras
    const sheet = workbook.addWorksheet(hojaNombre);
    sheet.columns = [
      { header: 'Fecha',         key: 'fecha',       width: 15 },
      { header: 'Operario',      key: 'operario',    width: 20 },
      { header: 'Departamento',  key: 'departamento', width: 20 },
      { header: 'Tarea',         key: 'tarea',       width: 30 },
      { header: 'Cantidades',    key: 'cantidades',  width: 10 },
      { header: 'Tiempo (min)',  key: 'tiempo',      width: 10 },
      { header: 'Descripción',   key: 'descripcion', width: 50 },
    ];
    await workbook.xlsx.writeFile(excelFilePath);
  } else {
    // Si ya existe, simplemente lo leemos
    await workbook.xlsx.readFile(excelFilePath);
  }

  return workbook;
}

async function guardarRegistroEnExcel(datos) {
  const workbook = await initializeWorkbook();
  const sheet    = workbook.getWorksheet(hojaNombre);
  if (!sheet) throw new Error(`No existe la hoja "${hojaNombre}"`);

  const fecha = new Date().toLocaleDateString('es-ES');
  // >>> USAMOS ARRAY en vez de objeto
  sheet.addRow([
    fecha,
    datos.operario,
    datos.departamento,
    datos.tarea,
    datos.cantidades,
    datos.tiempo,
    datos.descripcion || ''
  ]);

  console.log(`➕  Añadida nueva fila. Ahora hay ${sheet.rowCount} filas.`);
  await workbook.xlsx.writeFile(excelFilePath);
  console.log('💾  Excel guardado correctamente');
  return { mensaje: 'Registro guardado en Excel correctamente' };
}

async function getExcelFile() {
  if (!fs.existsSync(excelFilePath)) {
    throw new Error('El fichero Excel no existe aún.');
  }
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelFilePath);
  return await workbook.xlsx.writeBuffer();
}

module.exports = {
  guardarRegistroEnExcel,
  getExcelFile
};
