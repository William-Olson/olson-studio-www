import { DataTypes, Model, Sequelize } from 'sequelize';
import User from './User';

interface ChoreAttributes {
  id: string;
  choreChartId: number;
  name: string;
  description: string;
  scheduleDays: string;
  created: Date;
  updated: Date;
}

// don't return these values in responses
const PROTECTED_ATTRIBUTES: Array<keyof ChoreAttributes> = [];

export interface ChoreOutput
  extends Omit<ChoreAttributes, 'hash' | 'salt' | 'iterations'> {}

export interface ChoreInput extends ChoreAttributes {}

export class Chore
  extends Model<ChoreAttributes, ChoreInput>
  implements ChoreAttributes
{
  declare id: string;
  declare choreChartId: number;
  declare name: string;
  declare description: string;
  declare scheduleDays: string;

  declare created: Date;
  declare updated: Date;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public toJSON(): ChoreOutput {
    // hide protected fields
    const ChoreJson: ChoreAttributes = Object.assign({}, this.get());
    for (const attr of PROTECTED_ATTRIBUTES) {
      delete ChoreJson[attr];
    }
    return ChoreJson;
  }

  public static register(sequelize: Sequelize) {
    Chore.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.INTEGER,
          unique: true,
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
        name: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: true
        },
        description: {
          type: DataTypes.STRING
        },
        scheduleDays: {
          allowNull: false,
          type: DataTypes.STRING,
          field: 'schedule_days'
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
        tableName: 'chores',
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated'
      }
    );
  }
}

export default Chore;
