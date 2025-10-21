const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');

class Cliente extends BaseEntity {
  static initModel(sequelize) {
    return super.init(
      {
        nombre: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: false,
          validate: {
            notEmpty: true,
            len: [1, 100]
          }
        },
        contacto: {
          type: DataTypes.STRING(100),
          allowNull: true,
          unique: true,
          validate: {
            len: [0, 100]
          }
        }
      },
      {
        sequelize,
        modelName: 'Cliente',
        tableName: 'clientes'
      }
    );
  }

  static associate(models) {
    // Relaciones
    Cliente.hasMany(models.TarifaBase, {
      foreignKey: 'cliente_id',
      as: 'tarifasBase'
    });
    
    Cliente.hasMany(models.Cotizacion, {
      foreignKey: 'cliente_id',
      as: 'cotizaciones'
    });
  }
}

module.exports = Cliente;
