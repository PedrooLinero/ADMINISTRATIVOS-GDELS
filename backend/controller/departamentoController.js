// Importar librería para respuestas
const Respuesta = require("../utils/respuesta");
const { logMensaje } = require("../utils/logger.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js");
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar los modelos necesarios
const Departamento = models.departamento;
const Operarios = models.operarios;
const Tareas = models.tareas;

class DepartamentoController {
  async getAllDepartamentos(req, res) {
    try {
      logMensaje("Entrando en getAllDepartamentos"); // Registro de entrada
      const departamentos = await Departamento.findAll({
        include: [
          { model: Operarios, as: "operarios" },
          { model: Tareas, as: "tareas" },
        ],
      });
      res.json(Respuesta.exito(departamentos, "Datos de departamentos recuperados"));
    } catch (err) {
      // Manejo de errores durante la llamada al modelo
      logMensaje(`Error en getAllDepartamentos: ${err.message}`); // Registro del error
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de los departamentos: ${req.originalUrl}`
          )
        );
    }
  }
}

module.exports = new DepartamentoController();