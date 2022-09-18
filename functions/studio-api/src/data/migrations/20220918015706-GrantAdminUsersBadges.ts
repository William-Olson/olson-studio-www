import { IMigrationDefinition } from 'db-facade';
import { QueryInterface, Transaction, QueryTypes } from 'sequelize';

enum CurrentBadgeTypes {
  Achievement = 'achievement',
  Administrative = 'administrative'
}

const today = new Date();
const adminBadge = {
  rarity: 5,
  name: 'admin',
  friendlyName: 'Administrator',
  type: CurrentBadgeTypes.Administrative,
  description: 'Allows accessing administrative features.',
  created: today.toISOString()
};

export default {
  name: '20220918015706-GrantAdminUsersBadges',

  up: (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.sequelize.transaction(
      async (transaction: Transaction) => {
        // ADD ADMIN BADGE
        await queryInterface.sequelize.query(
          `
          INSERT INTO badges (name, friendly_name, type, rarity, description, created, updated) VALUES
          (
            '${adminBadge.name}',
            '${adminBadge.friendlyName}',
            '${adminBadge.type}',
            ${adminBadge.rarity},
            '${adminBadge.description}',
            '${adminBadge.created}',
            '${adminBadge.created}' )
        `,
          { transaction }
        );

        // GRANT ADMIN BADGES
        const initialAdmins = process.env.OS_ADMIN_USERS;
        if (initialAdmins) {
          const admins: Array<{ id: number }> =
            await await queryInterface.sequelize.query(
              `SELECT id from users WHERE source_id IN (${initialAdmins})`,
              {
                transaction,
                type: QueryTypes.SELECT
              }
            );

          const badges: Array<{ id: number }> =
            await await queryInterface.sequelize.query(
              `SELECT b.id from badges b WHERE b.name = 'admin' LIMIT 1`,
              {
                transaction,
                type: QueryTypes.SELECT
              }
            );

          for (const admin of admins) {
            await queryInterface.sequelize.query(
              `
              INSERT INTO user_badges (user_id, badge_id, created, updated) VALUES
              (
                '${admin.id}',
                '${badges[0].id}',
                '${adminBadge.created}',
                '${adminBadge.created}' )
            `,
              { transaction }
            );
          }
        }
      }
    );
  },

  down: (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.sequelize.transaction(
      async (transaction: Transaction) => {
        queryInterface.sequelize.query(
          `DELETE * from user_badges b WHERE b.user_id IS NOT NULL`,
          { transaction }
        );
      }
    );
  }
} as IMigrationDefinition;
