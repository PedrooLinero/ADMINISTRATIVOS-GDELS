var DataTypes = require("sequelize").DataTypes;
var _departamento = require("./departamento");
var _operarios = require("./operarios");
var _tareas = require("./tareas");

function initModels(sequelize) {
  var departamento = _departamento(sequelize, DataTypes);
  var operarios = _operarios(sequelize, DataTypes);
  var tareas = _tareas(sequelize, DataTypes);

  // Un departamento tiene muchos operarios
  departamento.hasMany(operarios, { as: "operarios", foreignKey: "id_departamento" });

  // Un operario pertenece a un departamento
  operarios.belongsTo(departamento, { as: "departamento", foreignKey: "id_departamento" });

  // Un departamento tiene muchas tareas
  departamento.hasMany(tareas, { as: "tareas", foreignKey: "id_departamento" });

  // Una tarea pertenece a un departamento
  tareas.belongsTo(departamento, { as: "departamento", foreignKey: "id_departamento" });

  return {
    departamento,
    operarios,
    tareas,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;