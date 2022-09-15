import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import UserBadge from './UserBadges';

interface BadgeAttributes {
  id: number;
  rarity: number; // 1 to 5, 5 is rarest, 1 is common
  name: string; // unique identifier used to check against in the code
  friendlyName: string;
  type: BadgeTypes;
  description: string;
  isPublic: boolean; // show to user when not unlocked yet
  created: Date;
  updated: Date; // for tracking when the last user_badge was unlocked
  UserBadge?: UserBadge;
}

// don't return these values in responses
const PROTECTED_ATTRIBUTES: Array<keyof BadgeAttributes> = [];

export interface BadgeOutput extends Omit<BadgeAttributes, 'UserBadge'> {
  // merged user_badge attributes if they exist
  obtained?: Date;
  unread?: boolean;
  userId?: number;
}

export interface BadgeInput
  extends Optional<
    BadgeAttributes,
    'id' | 'rarity' | 'created' | 'updated' | 'isPublic' | 'UserBadge'
  > {}

export enum BadgeTypes {
  Achievement = 'achievement',
  Administrative = 'administrative'
}

export enum BadgeNames {
  Admin = 'admin'
}

export class Badge
  extends Model<BadgeAttributes, BadgeInput>
  implements BadgeAttributes
{
  declare readonly id: number;
  declare type: BadgeTypes;
  declare rarity: number;
  declare name: string;
  declare friendlyName: string;
  declare description: string;
  declare isPublic: boolean;
  declare updated: Date;
  declare readonly created: Date;
  declare readonly UserBadge?: UserBadge;

  public async newActivity(): Promise<void> {
    this.updated = new Date();
    await this.save();
  }

  public toJSON(): BadgeOutput {
    // hide protected fields
    const json: BadgeAttributes = Object.assign({}, this.get());
    for (const attr of PROTECTED_ATTRIBUTES) {
      delete json[attr];
    }
    const output: BadgeOutput = json;
    // flatten the user badge data if exists
    if (json.UserBadge) {
      const userBadge = json.UserBadge;
      delete json['UserBadge'];
      output.userId = userBadge.user_id;
      output.obtained = userBadge.created;
      output.unread = userBadge.unread;
    }
    return output;
  }

  public static register(sequelize: Sequelize) {
    Badge.init(
      {
        id: {
          primaryKey: true,
          type: DataTypes.INTEGER,
          autoIncrement: true
        },
        type: {
          type: DataTypes.ENUM,
          values: [BadgeTypes.Administrative, BadgeTypes.Achievement]
        },
        rarity: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 1
        },
        name: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: true
        },
        description: {
          allowNull: false,
          type: DataTypes.STRING
        },
        friendlyName: {
          type: DataTypes.STRING,
          field: 'friendly_name'
        },
        isPublic: {
          type: DataTypes.BOOLEAN,
          field: 'is_public',
          defaultValue: false
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
        tableName: 'badges',
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated'
      }
    );
  }
}

export default Badge;
