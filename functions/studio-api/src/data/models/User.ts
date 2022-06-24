import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  authToken?: string;
  refreshToken?: string;
}

const TOKEN_MAX_LEN = 4000;

export interface UserInput
  extends Optional<UserAttributes, 'id' | 'firstName' | 'lastName'> {}
export interface UserOuput extends Required<UserAttributes> {}

export default class User
  extends Model<UserAttributes, UserInput>
  implements UserAttributes
{
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;

  private _authToken?: string;
  private _refreshToken?: string;

  // token setters / getters
  public get authToken(): string {
    return this._authToken || '';
  }
  public set authToken(token: string) {
    this._authToken = token;
  }
  public get refreshToken(): string {
    return this._refreshToken || '';
  }
  public set refreshToken(token: string) {
    this._refreshToken = token;
  }

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static register(sequelize: Sequelize) {
    User.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.INTEGER,
          autoIncrement: true
        },
        email: {
          allowNull: false,
          type: DataTypes.STRING
        },
        firstName: {
          allowNull: false,
          type: DataTypes.STRING,
          field: 'first_name'
        },
        lastName: {
          type: DataTypes.STRING,
          field: 'last_name'
        },
        authToken: {
          type: DataTypes.STRING(TOKEN_MAX_LEN),
          field: 'auth_token'
        },
        refreshToken: {
          type: DataTypes.STRING(TOKEN_MAX_LEN),
          field: 'refresh_token'
        }
      },
      {
        sequelize,
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    );
  }
}
