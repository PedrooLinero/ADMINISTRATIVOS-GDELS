// Importar librería para respuestas
const Respuesta = require("../utils/respuesta");
const { logMensaje } = require("../utils/logger.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js");
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo Tareas
const Tareas = models.tareas;

class TareasController {
  async getAllTareas(req, res) {
    try {
      logMensaje("Entrando en getAllTareas"); // Registro de entrada
      const tareas = await Tareas.findAll();
      res.json(Respuesta.exito(tareas, "Datos de tareas recuperados"));
    } catch (err) {
      // Manejo de errores durante la llamada al modelo
      logMensaje(`Error en getAllTareas: ${err.message}`); // Registro del error
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de las tareas: ${req.originalUrl}`
          )
        );
    }
  }

  async getTareaById(req, res) {
    try {
      logMensaje("Entrando en getTareaById");
      const id = req.params.id;
      const tarea = await Tareas.findByPk(id);
      if (!tarea) {
        return res
          .status(404)
          .json(Respuesta.error(null, `Tarea con id ${id} no encontrada`));
      }
      res.json(Respuesta.exito(tarea, `Tarea con id ${id} recuperada`));
    } catch (err) {
      logMensaje(`Error en getTareaById: ${err.message}`);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar la tarea: ${req.originalUrl}`
          )
        );
    }
  }

  // Tareas por departamento
  async getTareasByDepartamento(req, res) {
    try {
      logMensaje("Entrando en getTareasByDepartamento");
      const departamentoId = req.params.departamentoId;
      const tareas = await Tareas.findAll({
        where: { id_departamento: departamentoId }, // Cambiado a id_departamento
      });
      if (!tareas || tareas.length === 0) {
        return res.status(404).json(
          Respuesta.error(null, `No se encontraron tareas para el departamento ${departamentoId}`)
        );
      }
      res.json(Respuesta.exito(tareas, `Tareas del departamento ${departamentoId} recuperadas`));
    } catch (err) {
      logMensaje(`Error en getTareasByDepartamento: ${err.message}`);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar las tareas del departamento: ${req.originalUrl}`
          )
        );
    }
  }
}

module.exports = new TareasController();