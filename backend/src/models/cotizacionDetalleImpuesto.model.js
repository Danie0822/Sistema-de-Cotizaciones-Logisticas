const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');

class CotizacionDetalleImpuesto extends BaseEntity {
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
        impuesto_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'impuestos',
            key: 'id'
          }
        },
        base_calculo: {
          type: DataTypes.DECIMAL(14, 4),
          allowNull: false,
          comment: 'Monto sobre el cual se calculó el impuesto'
        },
        porcentaje_aplicado: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: true
        },
        monto: {
          type: DataTypes.DECIMAL(14, 4),
          allowNull: false,
          validate: {
            min: 0
          }
        }
      },
      {
        sequelize,
        modelName: 'CotizacionDetalleImpuesto',
        tableName: 'cotizaciones_detalles_impuestos',
        underscored: true,
        timestamps: true,
        paranoid: false  // No usar soft deletes - la tabla no tiene deleted_at
      }
    );
  }

  static associate(models) {
    // Relaciones
    CotizacionDetalleImpuesto.belongsTo(models.Cotizacion, {
      foreignKey: 'cotizacion_id',
      as: 'cotizacion'
    });

    CotizacionDetalleImpuesto.belongsTo(models.Impuesto, {
      foreignKey: 'impuesto_id',
      as: 'impuesto'
    });
  }
}

module.exports = CotizacionDetalleImpuesto;
