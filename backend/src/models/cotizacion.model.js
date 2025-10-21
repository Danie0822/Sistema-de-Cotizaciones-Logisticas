const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');

class Cotizacion extends BaseEntity {
  static initModel(sequelize) {
    return super.init(
      {
        cliente_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'clientes',
            key: 'id'
          }
        },
        tipo_carga_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'tipos_carga',
            key: 'id'
          }
        },
        unidad_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'unidades_medida',
            key: 'id'
          }
        },
        fecha_cotizacion: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          validate: {
            isDate: true
          }
        },
        monto_total: {
          type: DataTypes.DECIMAL(14, 4),
          allowNull: false,
          validate: {
            min: 0
          }
        },
        total_bruto: {
          type: DataTypes.DECIMAL(14, 2),
          allowNull: false,
          validate: {
            min: 0
          }
        },
        tarifa_base: {
          type: DataTypes.DECIMAL(14, 2),
          allowNull: false,
          validate: {
            min: 0
          }
        },
        peso: {
          type: DataTypes.DECIMAL(14, 2),
          allowNull: false,
          validate: {
            min: 0
          }
        },
        origen: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        destino: {
          type: DataTypes.STRING(255),
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'Cotizacion',
        tableName: 'cotizaciones',
        underscored: true
      }
    );
  }

  static associate(models) {
    // Relaciones
    Cotizacion.belongsTo(models.Cliente, {
      foreignKey: 'cliente_id',
      as: 'cliente'
    });
    
    Cotizacion.belongsTo(models.TipoCarga, {
      foreignKey: 'tipo_carga_id',
      as: 'tipoCarga'
    });
    
    Cotizacion.belongsTo(models.UnidadMedida, {
      foreignKey: 'unidad_id',
      as: 'unidadMedida'
    });
    
    Cotizacion.hasMany(models.CotizacionDetalle, {
      foreignKey: 'cotizacion_id',
      as: 'detalles'
    });
  }
}

module.exports = Cotizacion;
