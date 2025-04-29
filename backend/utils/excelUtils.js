const ExcelJS = require('exceljs');
const fs      = require('fs');
const path    = require('path');

const excelFilePath = path.join(__dirname, '..', 'uploads', 'PartesTrabajo.xlsx');
const hojaNombre    = 'Registros Jornada';

function ensureUploadsDir() {
  const dir = path.dirname(excelFilePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/**
 * Inicializa o lee el workbook y aplica estilo de tabla y cabecera
 */
async function initializeWorkbook() {
  ensureUploadsDir();
  const workbook = new ExcelJS.Workbook();

  let sheet;
  if (!fs.existsSync(excelFilePath) || fs.statSync(excelFilePath).size === 0) {
    // Crear sheet con columnas y estilo de cabecera
    sheet = workbook.addWorksheet(hojaNombre);
    sheet.columns = [
      { header: 'Fecha',        key: 'fecha',       width: 15 },
      { header: 'Operario',     key: 'operario',    width: 20 },
      { header: 'Departamento', key: 'departamento', width: 20 },
      { header: 'Tarea',        key: 'tarea',       width: 30 },
      { header: 'Cantidades',   key: 'cantidades',  width: 12 },
      { header: 'Tiempo (min)', key: 'tiempo',      width: 12 },
      { header: 'Descripción',  key: 'descripcion', width: 50 },
    ];

    // Aplicar estilo al encabezado
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 20;
    headerRow.eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' }, // Azul suave
      };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
      };
    });

    // Crear un 'filtro automático'
    sheet.autoFilter = {
      from: 'A1',
      to: 'G1',
    };

    await workbook.xlsx.writeFile(excelFilePath);
  } else {
    // Leer existente
    await workbook.xlsx.readFile(excelFilePath);
    sheet = workbook.getWorksheet(hojaNombre);
  }
  return workbook;
}

/**
 * Añade un registro y guarda con formato
 */
async function guardarRegistroEnExcel(datos) {
  const workbook = await initializeWorkbook();
  const sheet    = workbook.getWorksheet(hojaNombre);
  if (!sheet) throw new Error(`No existe la hoja "${hojaNombre}"`);

  // Crear nueva fila de datos
  const fecha = new Date().toLocaleDateString('es-ES');
  const newRow = sheet.addRow([
    fecha,
    datos.operario,
    datos.departamento,
    datos.tarea,
    datos.cantidades,
    datos.tiempo,
    datos.descripcion || ''
  ]);

  // Aplicar borde ligero a la nueva fila
  newRow.eachCell(cell => {
    cell.border = {
      top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
    };
  });

  console.log(`➕ Añadida nueva fila. Ahora hay ${sheet.rowCount} filas.`);
  await workbook.xlsx.writeFile(excelFilePath);
  console.log('💾 Excel guardado correctamente');
  return { mensaje: 'Registro guardado en Excel correctamente' };
}

/**
 * Devuelve buffer del archivo para descarga
 */
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
