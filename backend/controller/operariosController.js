const sequelize = require("../config/sequelize.js"); // Conexión a la base de datos
const initModels = require("../models/init-models.js"); // Definición de modelos
const models = initModels(sequelize);
const Operarios = models.operarios; // Modelo de operarios
const Departamentos = models.departamento; // Modelo de departamentos

class OperarioController {
  async getAllOperarios(req, res) {
    try {
      // Obtener todos los operarios, incluyendo datos del departamento asociado
      const operarios = await Operarios.findAll({
        attributes: ["id", "codigo", "id_departamento"],
        include: [
          {
            model: Departamentos,
            as: "departamento",
            attributes: ["nombre"], // Incluye el nombre del departamento
          },
        ],
      });

      if (operarios.length === 0) {
        return res.status(404).json({
          error: "No se encontraron operarios en la base de datos",
        });
      }

      // Respuesta exitosa
      res.json({
        data: operarios,
        mensaje: "Lista de operarios recuperada correctamente",
      });
    } catch (err) {
      res.status(500).json({
        error: `Error al recuperar los operarios: ${err.message}`,
      });
    }
  }

  async getOperariosByDepartamento(req, res) {
    try {
      const idDepartamento = req.params.id; // El ID del departamento viene de la URL

      // Buscar operarios filtrados por id_departamento
      const operarios = await Operarios.findAll({
        where: { id_departamento: idDepartamento },
        attributes: ["codigo"], // Solo queremos el campo 'codigo'
      });

      // Si no hay operarios, devolvemos un mensaje
      if (operarios.length === 0) {
        return res.status(404).json({
          error: `No se encontraron operarios para el departamento con id ${idDepartamento}`,
        });
      }

      // Devolvemos los códigos en un arreglo
      res.json({
        data: operarios.map((operario) => operario.codigo),
        mensaje: `Códigos de operarios del departamento con id ${idDepartamento} recuperados`,
      });
    } catch (err) {
      res.status(500).json({
        error: `Error al recuperar los operarios: ${err.message}`,
      });
    }
  }
}

module.exports = new OperarioController();
