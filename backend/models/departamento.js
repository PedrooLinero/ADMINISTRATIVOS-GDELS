module.exports = function (sequelize, DataTypes) {
    const Departamento = sequelize.define(
      "departamento",
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        nombre: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "departamento",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  
    // Definir relaciones
    Departamento.associate = function (models) {
      Departamento.hasMany(models.operarios, {
        foreignKey: "id_departamento",
        as: "operarios",
      });
      Departamento.hasMany(models.tareas, {
        foreignKey: "id_departamento",
        as: "tareas",
      });
    };
  
    return Departamento;
  };