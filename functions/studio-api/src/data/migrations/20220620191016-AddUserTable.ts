import { IMigrationDefinition } from 'db-facade';
import { QueryInterface, DataTypes, Transaction } from 'sequelize';

const TOKEN_MAX_LEN = 4000;

export default {
  name: '20220620191016-AddUserTable',
  up: (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.sequelize.transaction(
      async (transaction: Transaction) => {
        return await queryInterface.createTable(
          'users',
          {
            id: {
              primaryKey: true,
              type: DataTypes.INTEGER,
              autoIncrement: true
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
            email: {
              allowNull: false,
              type: DataTypes.STRING,
              field: 'email'
            },
            authToken: {
              type: DataTypes.STRING(TOKEN_MAX_LEN),
              field: 'auth_token'
            },
            refreshToken: {
              type: DataTypes.STRING(TOKEN_MAX_LEN),
              field: 'refresh_token'
            },
            createdAt: {
              type: DataTypes.DATE,
              field: 'created_at'
            },
            updatedAt: {
              type: DataTypes.DATE,
              field: 'updated_at'
            }
          },
          { transaction }
        );
      }
    );
  },
  down: (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.sequelize.transaction(
      async (transaction: Transaction) => {
        return await queryInterface.dropTable('users', { transaction });
      }
    );
  }
} as IMigrationDefinition;
