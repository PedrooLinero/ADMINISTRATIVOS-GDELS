module.exports = function (sequelize, DataTypes) {
    const Operarios = sequelize.define(
      "operarios",
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        codigo: {
          type: DataTypes.STRING(4),
          allowNull: false,
        },
        id_departamento: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "departamento",
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "operarios",
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
    Operarios.associate = function (models) {
      Operarios.belongsTo(models.departamento, {
        foreignKey: "id_departamento",
        as: "departamento",
      });
    };
  
    return Operarios;
  };