import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import Chore from './Chore';
import User from './User';

interface ChoreChartAttributes {
  id: string;
  assignee: string;
  createdBy: string;
  name: string;
  description: string;
  streak: number;
  score: number;
  recurring: boolean;
  dueTime: string;
  chores?: Array<Chore>;
  created: Date;
  updated: Date;
}

// don't return these values in responses
const PROTECTED_ATTRIBUTES: Array<keyof ChoreChartAttributes> = [];

export interface ChoreChartOutput extends ChoreChartAttributes {}
export interface ChoreChartInput
  extends Optional<
    ChoreChartAttributes,
    'streak' | 'score' | 'recurring' | 'created' | 'updated' | 'id'
  > {}

export class ChoreChart
  extends Model<ChoreChartAttributes, ChoreChartInput>
  implements ChoreChartAttributes
{
  declare id: string;
  declare assignee: string;
  declare createdBy: string;
  declare name: string;
  declare description: string;
  declare streak: number;
  declare score: number;
  declare recurring: boolean;
  declare dueTime: string;
  declare created: Date;
  declare updated: Date;

  declare readonly chores: Array<Chore>;

  public async updateStreak(): Promise<void> {
    // const streakSoFar: number = this.streak;
    // TODO: update streak based on the percentage of completed chore_chart_events from last cycle
    // and the ranking of each event
    await this.save();
  }

  public toJSON(): ChoreChartOutput {
    // hide protected fields
    const ChoreChartJson: ChoreChartAttributes = Object.assign({}, this.get());
    for (const attr of PROTECTED_ATTRIBUTES) {
      delete ChoreChartJson[attr];
    }
    return ChoreChartJson;
  }

  public static register(sequelize: Sequelize) {
    ChoreChart.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.BIGINT,
          unique: true,
          autoIncrement: true
        },
        assignee: {
          allowNull: false,
          type: DataTypes.BIGINT,
          references: { model: User, key: 'id' }
        },
        createdBy: {
          allowNull: false,
          type: DataTypes.BIGINT,
          references: { model: User, key: 'id' },
          field: 'created_by'
        },
        name: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: true
        },
        description: {
          type: DataTypes.STRING
        },
        streak: {
          type: DataTypes.INTEGER,
          defaultValue: 0
        },
        score: {
          type: DataTypes.INTEGER,
          defaultValue: 0
        },
        recurring: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        },
        dueTime: {
          allowNull: false,
          type: DataTypes.STRING,
          defaultValue: '02:00',
          field: 'due_time'
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
        tableName: 'chore_charts',
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated'
      }
    );
  }
}

export default ChoreChart;
