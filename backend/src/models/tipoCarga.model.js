const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');

class TipoCarga extends BaseEntity {
  static initModel(sequelize) {    return super.init(
      {
        nombre: {
          type: DataTypes.STRING(100),
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [1, 100]
          }
        },
        descripcion: {
          type: DataTypes.TEXT,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'TipoCarga',
        tableName: 'tipos_carga',
        underscored: true,        indexes: [
          {
            unique: true,
            fields: ['codigo']
          },
          {
            unique: false,
            fields: ['nombre']
          }
        ]
      }
    );
  }

  static associate(models) {
    // Relaciones
    TipoCarga.hasMany(models.TarifaBase, {
      foreignKey: 'tipo_carga_id',
      as: 'tarifasBase'
    });
    
    TipoCarga.hasMany(models.ReglaCargo, {
      foreignKey: 'tipo_carga_id',
      as: 'reglasCargo'
    });
    
    TipoCarga.hasMany(models.Cotizacion, {
      foreignKey: 'tipo_carga_id',
      as: 'cotizaciones'
    });
  }
}

module.exports = TipoCarga;
