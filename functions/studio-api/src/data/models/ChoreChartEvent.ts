import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export enum ChoreEventStatus {
  TODO = 'TODO',
  NEEDS_CHECK = 'NEEDS_CHECK',
  COMPLETED = 'COMPLETED'
}

interface ChoreChartEventAttributes {
  id: string;
  choreChartId: number;
  choreId: number;
  status: ChoreEventStatus;
  _status?: string;
  rating: number;
  due: Date;
  completed?: Date;
  created: Date;
  updated: Date;
}

// don't return these values in responses
const PROTECTED_ATTRIBUTES: Array<keyof ChoreChartEventAttributes> = [];

export interface ChoreChartEventOutput extends ChoreChartEventAttributes {}
export interface ChoreChartEventInput
  extends Optional<
    ChoreChartEventAttributes,
    'id' | 'status' | 'rating' | 'created' | 'updated'
  > {}

export class ChoreChartEvent
  extends Model<ChoreChartEventAttributes, ChoreChartEventInput>
  implements ChoreChartEventAttributes
{
  declare id: string;
  declare choreChartId: number;
  declare choreId: number;
  declare _status: string;
  declare rating: number;
  declare due: Date;
  declare completed: Date;
  declare created: Date;
  declare updated: Date;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public get status(): ChoreEventStatus {
    return this._status as ChoreEventStatus;
  }

  public set status(badgeType: ChoreEventStatus) {
    this._status = badgeType?.toString();
  }

  public toJSON(): ChoreChartEventOutput {
    // hide protected fields
    const ChoreChartEventJson: ChoreChartEventAttributes = Object.assign(
      {},
      this.get(),
      {
        status: this._status,
        _status: undefined
      }
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
          onDelete: 'CASCADE',
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
          onDelete: 'CASCADE',
          references: {
            model: 'chores',
            key: 'id'
          },
          field: 'chore_id'
        },
        status: {
          type: DataTypes.VIRTUAL
        },
        _status: {
          type: DataTypes.STRING,
          field: 'status'
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
