import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface UserBadgeAttributes {
  unread: boolean;
  created: Date;
  updated: Date;
  user_id: string;
  badge_id: string;
}

// don't return these values in responses. The updated field is required so
// we can utilize the timestamps feature, but doesn't make sense on this model
// so we'll just exlude it from the toJSON output
const PROTECTED_ATTRIBUTES: Array<keyof UserBadgeAttributes> = ['updated'];

export interface UserBadgeOutput extends UserBadgeAttributes {}
export interface UserBadgeInput
  extends Optional<UserBadgeAttributes, 'unread' | 'created' | 'updated'> {}

export class UserBadge
  extends Model<UserBadgeAttributes, UserBadgeInput>
  implements UserBadgeAttributes
{
  declare readonly created: Date;
  declare readonly updated: Date;
  declare readonly user_id: string;
  declare readonly badge_id: string;
  declare unread: boolean;

  public toJSON(): UserBadgeOutput {
    // hide protected fields
    const json: UserBadgeAttributes = Object.assign({}, this.get());
    for (const attr of PROTECTED_ATTRIBUTES) {
      delete json[attr];
    }
    return json;
  }

  public static register(sequelize: Sequelize) {
    UserBadge.init(
      {
        unread: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        },
        created: { type: DataTypes.DATE },
        updated: { type: DataTypes.DATE },
        user_id: { type: DataTypes.BIGINT },
        badge_id: { type: DataTypes.BIGINT }
      },
      {
        sequelize,
        tableName: 'user_badges',
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated'
      }
    );
  }
}

export default UserBadge;
