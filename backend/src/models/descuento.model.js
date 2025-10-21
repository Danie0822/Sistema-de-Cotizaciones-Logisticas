const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');

class Descuento extends BaseEntity {
  static initModel(sequelize) {
    return super.init(
      {
        nombre_descuento: {
          type: DataTypes.STRING(50),
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [1, 50]
          }
        },
        metodo: {
          type: DataTypes.ENUM('porcentaje', 'cuota_fija'),
          allowNull: false,
          comment: 'Método de cálculo del descuento: porcentaje, cuota fija, etc.'
        },
        valor: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          validate: {
            min: 0
          }
        }
      },
      {
        sequelize,
        modelName: 'Descuento',
        tableName: 'descuentos',
        underscored: true
      }
    );
  }
}

module.exports = Descuento;
