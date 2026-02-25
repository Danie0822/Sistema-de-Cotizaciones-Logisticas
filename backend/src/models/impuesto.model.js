const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');

class Impuesto extends BaseEntity {
  static initModel(sequelize) {
    return super.init(
      {
        tipo_carga_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'tipos_carga',
            key: 'id'
          },
          comment: 'Tipo de carga al que aplica (null = aplica a todos)'
        },
        nombre: {
          type: DataTypes.STRING(100),
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [1, 100]
          }
        },
        codigo: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: true,
            len: [1, 20]
          }
        },
        tipo: {
          type: DataTypes.ENUM('porcentaje', 'monto_fijo'),
          allowNull: false,
          comment: 'Tipo de impuesto: porcentaje o monto fijo'
        },
        valor: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          validate: {
            min: 0
          }
        },
        aplicable_a: {
          type: DataTypes.ENUM('subtotal_neto', 'total_bruto', 'tarifa_base'),
          defaultValue: 'subtotal_neto',
          comment: 'Base sobre la cual se calcula el impuesto'
        },
        es_acumulativo: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          comment: 'Si otros impuestos se calculan sobre este'
        },
        vigencia_desde: {
          type: DataTypes.DATE,
          allowNull: false,
          validate: {
            isDate: true
          }
        },
        vigencia_hasta: {
          type: DataTypes.DATE,
          allowNull: true,
          validate: {
            isDate: true
          }
        },
        activo: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        }
      },
      {
        sequelize,
        modelName: 'Impuesto',
        tableName: 'impuestos',
        underscored: true
      }
    );
  }

  static associate(models) {
    // Relaciones
    Impuesto.belongsTo(models.TipoCarga, {
      foreignKey: 'tipo_carga_id',
      as: 'tipoCarga'
    });

    Impuesto.hasMany(models.CotizacionDetalleImpuesto, {
      foreignKey: 'impuesto_id',
      as: 'detallesCotizaciones'
    });
  }
}

module.exports = Impuesto;
