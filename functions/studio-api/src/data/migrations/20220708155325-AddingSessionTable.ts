import { IMigrationDefinition } from 'db-facade';
import { QueryInterface, DataTypes, Transaction } from 'sequelize';

export default {
  name: '20220708155325-AddingSessionTable',

  up: (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.sequelize.transaction((transaction: Transaction) =>
      queryInterface.createTable(
        'sessions',
        {
          id: {
            primaryKey: true,
            type: DataTypes.STRING
          },
          userId: {
            allowNull: false,
            type: DataTypes.BIGINT,
            references: {
              model: 'users',
              key: 'id'
            },
            field: 'user_id'
          },
          hash: {
            allowNull: false,
            type: DataTypes.TEXT
          },
          salt: {
            allowNull: false,
            type: DataTypes.STRING
          },
          iterations: {
            allowNull: false,
            type: DataTypes.INTEGER
          },
          clientIp: {
            type: DataTypes.STRING,
            field: 'client_ip'
          },
          userAgent: {
            type: DataTypes.STRING,
            field: 'user_agent'
          },
          lastActivity: {
            type: DataTypes.DATE,
            field: 'last_activity'
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
      )
    );
  },
  down: (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.sequelize.transaction((transaction: Transaction) =>
      queryInterface.dropTable('sessions', { transaction })
    );
  }
} as IMigrationDefinition;
