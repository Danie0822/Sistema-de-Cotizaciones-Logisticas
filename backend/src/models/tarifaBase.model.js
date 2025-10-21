const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');

class TarifaBase extends BaseEntity {
  static initModel(sequelize) {
    return super.init(
      {
        cliente_id: {
          type: DataTypes.UUID,
          allowNull: true,
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
          },
          comment: 'Tipo de carga asociado a la tarifa base pero puede ser nulo, si es nula se aplica a todos los tipos de carga'
        },
        unidad_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'unidades_medida',
            key: 'id'
          }
        },
        precio_unitario: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          validate: {
            min: 0
          }
        },
        vigencia_desde: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          validate: {
            isDate: true
          }
        },
        vigencia_hasta: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          validate: {
            isDate: true,
            isAfterStart(value) {
              if (value && this.vigencia_desde && value <= this.vigencia_desde) {
                throw new Error('La fecha de vigencia hasta debe ser posterior a la fecha de vigencia desde');
              }
            }
          }
        }
      },
      {
        sequelize,
        modelName: 'TarifaBase',
        tableName: 'tarifas_base',
        underscored: true,
        indexes: [
          {
            unique: true,
            fields: ['cliente_id', 'tipo_carga_id', 'unidad_id'],
            name: 'tarifa_unica_por_cliente_tipo'
          }
        ]
      }
    );
  }

  static associate(models) {
    // Relaciones
    TarifaBase.belongsTo(models.Cliente, {
      foreignKey: 'cliente_id',
      as: 'cliente'
    });
    
    TarifaBase.belongsTo(models.TipoCarga, {
      foreignKey: 'tipo_carga_id',
      as: 'tipoCarga'
    });
    
    TarifaBase.belongsTo(models.UnidadMedida, {
      foreignKey: 'unidad_id',
      as: 'unidadMedida'
    });
  }
}

module.exports = TarifaBase;
