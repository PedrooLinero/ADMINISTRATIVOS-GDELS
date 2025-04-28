module.exports = function (sequelize, DataTypes) {
    const Tareas = sequelize.define(
      "tareas",
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        id_departamento: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "departamento",
            key: "id",
          },
        },
        nombre_tarea: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        es_otra_tarea: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: "tareas",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "FK_DEPARTAMENTO",
            using: "BTREE",
            fields: [{ name: "id_departamento" }],
          },
        ],
      }
    );
  
    // Definir relaciones
    Tareas.associate = function (models) {
      Tareas.belongsTo(models.departamento, {
        foreignKey: "id_departamento",
        as: "departamento",
      });
    };
  
    return Tareas;
  };