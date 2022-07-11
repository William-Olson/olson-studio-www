import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { EncryptUtil } from '../../utilities/EncryptUtil';

export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  provider?: string;
  sourceId?: string;
  authToken?: string;
  refreshToken?: string;
}

// token encryption key
const encryptKey: string = process.env.OS_ENCRYPTION_KEY || '';
const encryptUtil = new EncryptUtil(encryptKey);

// don't return these values in responses
const PROTECTED_ATTRIBUTES: Array<keyof UserAttributes> = [
  'authToken',
  'refreshToken',
  'sourceId'
];

export interface UserInput
  extends Optional<
    UserAttributes,
    'id' | 'firstName' | 'lastName' | 'avatar'
  > {}

export interface UserOutput
  extends Omit<UserAttributes, 'authToken' | 'refreshToken' | 'sourceId'> {}

export class User
  extends Model<UserAttributes, UserInput>
  implements UserAttributes
{
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare avatar?: string;
  declare sourceId?: string;
  declare provider?: string;
  declare refreshToken?: string;
  declare authToken?: string;

  // declare Sessions?: Session[];

  private _authToken?: string;
  private _refreshToken?: string;

  // token setters / getters
  public getAuthToken(): string {
    if (!this.authToken) {
      return '';
    }
    if (!this._authToken && !!this.authToken) {
      this._authToken = encryptUtil.dencrypt(this.authToken);
    }
    return this._authToken || '';
  }

  public setAuthToken(token: string) {
    this._authToken = token;
    this.authToken = token ? encryptUtil.encrypt(token) : '';
  }

  public getRefreshToken(): string {
    if (!this.refreshToken) {
      return '';
    }
    if (!this._refreshToken && !!this.refreshToken) {
      this._refreshToken = encryptUtil.dencrypt(this.refreshToken);
    }
    return this._refreshToken || '';
  }

  public setRefreshToken(token: string) {
    // only set refresh token if truthy
    if (token) {
      this._refreshToken = token;
      this.refreshToken = encryptUtil.encrypt(token);
    }
  }

  public toJSON(): UserOutput {
    // hide protected fields
    const userJson: UserAttributes = Object.assign({}, this.get());
    for (const attr of PROTECTED_ATTRIBUTES) {
      delete userJson[attr];
    }
    return userJson;
  }

  // timestamps!
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public static register(sequelize: Sequelize) {
    User.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.INTEGER,
          autoIncrement: true
        },
        provider: {
          type: DataTypes.STRING
        },
        sourceId: {
          type: DataTypes.STRING,
          field: 'source_id'
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
        avatar: {
          type: DataTypes.STRING
        },
        authToken: {
          type: DataTypes.TEXT,
          field: 'auth_token'
        },
        refreshToken: {
          type: DataTypes.TEXT,
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

export default User;
