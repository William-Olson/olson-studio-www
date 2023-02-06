import { DataTypes, Model, Sequelize } from 'sequelize';
import User from './User';

interface SessionAttributes {
  id: string;
  userId: string;
  hash: string;
  salt: string;
  iterations: number;
  clientIp?: string;
  userAgent?: string;
  lastActivity: Date;
}

// don't return these values in responses
const PROTECTED_ATTRIBUTES: Array<keyof SessionAttributes> = [
  'hash',
  'salt',
  'iterations'
];

export interface SessionOutput
  extends Omit<SessionAttributes, 'hash' | 'salt' | 'iterations'> {}

export interface SessionInput extends SessionAttributes {}

export class Session
  extends Model<SessionAttributes, SessionInput>
  implements SessionAttributes
{
  declare id: string;
  declare userId: string;
  declare hash: string;
  declare salt: string;
  declare iterations: number;
  declare clientIp?: string;
  declare userAgent?: string;
  declare lastActivity: Date;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public async newActivity(): Promise<void> {
    this.lastActivity = new Date();
    await this.save();
  }

  public toJSON(): SessionOutput {
    // hide protected fields
    const sessionJson: SessionAttributes = Object.assign({}, this.get());
    for (const attr of PROTECTED_ATTRIBUTES) {
      delete sessionJson[attr];
    }
    return sessionJson;
  }

  public static register(sequelize: Sequelize) {
    Session.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.STRING
        },
        userId: {
          allowNull: false,
          type: DataTypes.BIGINT,
          references: { model: User, key: 'id' },
          field: 'user_id'
        },
        hash: {
          allowNull: false,
          type: DataTypes.TEXT
        },
        salt: {
          allowNull: false,
          type: DataTypes.STRING
        },
        iterations: {
          allowNull: false,
          type: DataTypes.INTEGER
        },
        clientIp: {
          type: DataTypes.STRING,
          field: 'client_ip'
        },
        userAgent: {
          type: DataTypes.STRING,
          field: 'user_agent'
        },
        lastActivity: {
          type: DataTypes.DATE,
          field: 'last_activity'
        }
      },
      {
        sequelize,
        tableName: 'sessions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    );
  }
}

export default Session;
