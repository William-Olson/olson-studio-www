import { IMigrationDefinition } from 'db-facade';
import { QueryInterface, DataTypes, Transaction } from 'sequelize';

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
              type: DataTypes.BIGINT,
              autoIncrement: true
            },
            provider: {
              type: DataTypes.STRING
            },
            sourceId: {
              type: DataTypes.STRING,
              field: 'source_id'
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
