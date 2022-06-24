import { Sequelize } from 'sequelize/types';
import User from './models/User';

export const modelInitialization: (
  sequelize: Sequelize
) => Promise<void> = async (sequelize: Sequelize) => {
  User.register(sequelize);

  // User.hasMany(Post, { foreignKey: 'creator_id' });
};
