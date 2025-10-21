const { DataTypes, Model } = require('sequelize');

class CotizacionDetalleDescuento extends Model {
  static initModel(sequelize) {
    return super.init(
      {
        cotizacion_id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'cotizaciones',
            key: 'id'
          }
        },
        id_descuento: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'descuentos',
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
        modelName: 'CotizacionDetalleDescuento',
        tableName: 'cotizaciones_detalles_descuento',
        underscored: true,
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
      }
    );
  }

  static associate(models) {
    // Relaciones
    CotizacionDetalleDescuento.belongsTo(models.Cotizacion, {
      foreignKey: 'cotizacion_id',
      as: 'cotizacion'
    });
    
    CotizacionDetalleDescuento.belongsTo(models.Descuento, {
      foreignKey: 'id_descuento',
      as: 'descuento'
    });
  }
}

module.exports = CotizacionDetalleDescuento;
