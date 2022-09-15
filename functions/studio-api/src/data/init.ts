import { Sequelize } from 'sequelize/types';
import Session from './models/Session';
import User from './models/User';
import Badge from './models/Badge';
import UserBadge from './models/UserBadges';

export const modelInitialization: (
  sequelize: Sequelize
) => Promise<void> = async (sequelize: Sequelize) => {
  User.register(sequelize);
  Session.register(sequelize);
  Badge.register(sequelize);
  UserBadge.register(sequelize);

  Badge.belongsToMany(User, {
    through: UserBadge,
    foreignKey: 'badge_id'
  });
  User.belongsToMany(Badge, {
    through: UserBadge,
    foreignKey: 'user_id'
  });
};
