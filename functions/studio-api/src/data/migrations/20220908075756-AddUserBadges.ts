import { IMigrationDefinition } from 'db-facade';
import {
  QueryInterface,
  DataTypes,
  Transaction,
  QueryTypes,
  Sequelize
} from 'sequelize';

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
  name: '20220908075756-AddUserBadges',

  up: (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.sequelize.transaction(
      async (transaction: Transaction) => {
        // ADD BADGES TABLE
        await queryInterface.createTable(
          'badges',
          {
            id: {
              primaryKey: true,
              type: DataTypes.INTEGER,
              autoIncrement: true
            },
            type: {
              // Fake enum for serverless db workaround
              type: DataTypes.STRING
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
          { transaction }
        );

        // ADD USER_BADGES TABLE
        await queryInterface.createTable(
          'user_badges',
          {
            user_id: {
              allowNull: false,
              type: DataTypes.INTEGER,
              primaryKey: true,
              references: {
                model: 'users',
                key: 'id'
              },
              field: 'user_id'
            },
            badge_id: {
              allowNull: false,
              primaryKey: true,
              type: DataTypes.INTEGER,
              references: {
                model: 'badges',
                key: 'id'
              },
              field: 'badge_id'
            },
            unread: {
              type: DataTypes.BOOLEAN,
              defaultValue: true
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
          { transaction }
        );

        // ADD FAKE ENUM CONSTRAINTS
        await queryInterface.addConstraint('badges', {
          type: 'check',
          fields: ['type'],
          where: {
            type: [
              CurrentBadgeTypes.Administrative,
              CurrentBadgeTypes.Achievement
            ]
          },
          name: 'check_type_is_hacky_enum',
          transaction
        });

        await queryInterface.addIndex('badges', {
          fields: ['type'],
          name: 'badge_type_index',
          transaction
        });

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
        queryInterface.dropTable('user_badges', { transaction });
        queryInterface.dropTable('badges', { transaction });
      }
    );
  }
} as IMigrationDefinition;
