const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');

class ReglaCargo extends BaseEntity {
  static initModel(sequelize) {
    return super.init(
      {
        tipo_carga_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'tipos_carga',
            key: 'id'
          }
        },
        nombre_rubro: {
          type: DataTypes.STRING(50),
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [1, 50]
          }
        },
        peso_min: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: true,
          defaultValue: 0,
          validate: {
            min: 0
          }
        },
        peso_max: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: true,
          validate: {
            min: 0,
            isGreaterThanMin(value) {
              if (value && this.peso_min && value <= this.peso_min) {
                throw new Error('El peso máximo debe ser mayor al peso mínimo');
              }
            }
          }
        },
        metodo: {
          type: DataTypes.ENUM('porcentaje', 'cuota_fija'),
          allowNull: false,
          comment: 'Define el método de cálculo para el cargo, como porcentaje o cuota fija'
        },
        valor: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          validate: {
            min: 0
          }
        },
        orden: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: 0
          }
        }
      },
      {
        sequelize,
        modelName: 'ReglaCargo',
        tableName: 'reglas_cargo',
        underscored: true,
        indexes: [
          {
            fields: ['tipo_carga_id', 'orden']
          }
        ]
      }
    );
  }

  static associate(models) {
    // Relaciones
    ReglaCargo.belongsTo(models.TipoCarga, {
      foreignKey: 'tipo_carga_id',
      as: 'tipoCarga'
    });
    
    ReglaCargo.hasMany(models.CotizacionDetalle, {
      foreignKey: 'regla_cargo_id',
      as: 'cotizacionesDetalles'
    });
  }
}

module.exports = ReglaCargo;
