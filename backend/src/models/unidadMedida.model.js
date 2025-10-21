const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');

class UnidadMedida extends BaseEntity {
  static initModel(sequelize) {
    return super.init(
      {
        codigo: {
          type: DataTypes.STRING(10),
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: true,
            len: [1, 50]
          },
          comment: 'Código único para la unidad de medida ejemplo: "kg", "m3", "tonelada"'
        },
        descripcion: {
          type: DataTypes.STRING(50),
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [1, 100]
          }
        }
      },
      {
        sequelize,
        modelName: 'UnidadMedida',
        tableName: 'unidades_medida',
        underscored: true,
        indexes: [
          {
            unique: true,
            fields: ['codigo']
          }
        ]
      }
    );
  }

  static associate(models) {
    // Relaciones
    UnidadMedida.hasMany(models.TarifaBase, {
      foreignKey: 'unidad_id',
      as: 'tarifasBase'
    });
    
    UnidadMedida.hasMany(models.Cotizacion, {
      foreignKey: 'unidad_id',
      as: 'cotizaciones'
    });
  }
}

module.exports = UnidadMedida;
