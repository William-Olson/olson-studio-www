import { DataTypes, Model, Sequelize } from 'sequelize';

interface ChoreChartEventAttributes {
  id: string;
  choreChartId: number;
  choreId: number;
  status: string;
  rating: number;
  due: Date;
  completed: Date;
  created: Date;
  updated: Date;
}

// don't return these values in responses
const PROTECTED_ATTRIBUTES: Array<keyof ChoreChartEventAttributes> = [];

export interface ChoreChartEventOutput
  extends Omit<ChoreChartEventAttributes, 'hash' | 'salt' | 'iterations'> {}

export interface ChoreChartEventInput extends ChoreChartEventAttributes {}

export class ChoreChartEvent
  extends Model<ChoreChartEventAttributes, ChoreChartEventInput>
  implements ChoreChartEventAttributes
{
  declare id: string;
  declare choreChartId: number;
  declare choreId: number;
  declare status: string;
  declare rating: number;
  declare due: Date;
  declare completed: Date;
  declare created: Date;
  declare updated: Date;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public toJSON(): ChoreChartEventOutput {
    // hide protected fields
    const ChoreChartEventJson: ChoreChartEventAttributes = Object.assign(
      {},
      this.get()
    );
    for (const attr of PROTECTED_ATTRIBUTES) {
      delete ChoreChartEventJson[attr];
    }
    return ChoreChartEventJson;
  }

  public static register(sequelize: Sequelize) {
    ChoreChartEvent.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.INTEGER,
          autoIncrement: true
        },
        choreChartId: {
          allowNull: false,
          type: DataTypes.INTEGER,
          references: {
            model: 'chore_charts',
            key: 'id'
          },
          field: 'chore_chart_id'
        },
        choreId: {
          allowNull: false,
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: {
            model: 'chores',
            key: 'id'
          },
          field: 'chore_id'
        },
        status: {
          type: DataTypes.STRING
        },
        rating: {
          type: DataTypes.INTEGER,
          defaultValue: 0
        },
        due: {
          type: DataTypes.DATE
        },
        completed: {
          type: DataTypes.DATE
        },
        created: {
          type: DataTypes.DATE,
          field: 'created'
        },
        updated: {
          type: DataTypes.DATE,
          field: 'updated'
        }
      },
      {
        sequelize,
        tableName: 'chore_chart_events',
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated'
      }
    );
  }
}

export default ChoreChartEvent;
