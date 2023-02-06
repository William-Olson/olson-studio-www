import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import ChoreChartEvent from './ChoreChartEvent';

interface ChoreAttributes {
  id: string;
  choreChartId: string;
  name: string;
  description: string;
  scheduleDays: string;
  events?: ChoreChartEvent[];
  created: Date;
  updated: Date;
}

// don't return these values in responses
const PROTECTED_ATTRIBUTES: Array<keyof ChoreAttributes> = [];

export interface ChoreOutput extends ChoreAttributes {}
export interface ChoreInput
  extends Optional<ChoreAttributes, 'created' | 'updated' | 'id'> {}

export class Chore
  extends Model<ChoreAttributes, ChoreInput>
  implements ChoreAttributes
{
  declare id: string;
  declare choreChartId: string;
  declare name: string;
  declare description: string;
  declare scheduleDays: string;

  declare created: Date;
  declare updated: Date;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare readonly events: ChoreChartEvent[];

  public toJSON(): ChoreOutput {
    // hide protected fields
    const choreJson: ChoreAttributes = Object.assign({}, this.get());
    for (const attr of PROTECTED_ATTRIBUTES) {
      delete choreJson[attr];
    }
    return Object.assign(choreJson, {
      events: (choreJson.events || []).map((ev) => ev.toJSON())
    });
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
          onDelete: 'CASCADE',
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
