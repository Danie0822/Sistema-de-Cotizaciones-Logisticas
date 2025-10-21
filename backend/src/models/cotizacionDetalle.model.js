const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');

class CotizacionDetalle extends BaseEntity {
  static initModel(sequelize) {
    return super.init(
      {
        cotizacion_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'cotizaciones',
            key: 'id'
          }
        },
        regla_cargo_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'reglas_cargo',
            key: 'id'
          }
        },
        monto: {
          type: DataTypes.DECIMAL(12, 4),
          allowNull: false,
          validate: {
            min: 0
          }
        }
      },
      {
        sequelize,
        modelName: 'CotizacionDetalle',
        tableName: 'cotizaciones_detalles',
        underscored: true
      }
    );
  }

  static associate(models) {
    // Relaciones
    CotizacionDetalle.belongsTo(models.Cotizacion, {
      foreignKey: 'cotizacion_id',
      as: 'cotizacion'
    });
    
    CotizacionDetalle.belongsTo(models.ReglaCargo, {
      foreignKey: 'regla_cargo_id',
      as: 'reglaCargo'
    });
  }
}

module.exports = CotizacionDetalle;
