import { IMigrationDefinition } from 'db-facade';
import { QueryInterface, DataTypes, Transaction } from 'sequelize';

export default {
  name: '20221116185453-AddChoreListTables',

  up: (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.sequelize.transaction(
      async (transaction: Transaction) => {
        await queryInterface.createTable(
          'chore_charts',
          {
            id: {
              primaryKey: true,
              type: DataTypes.BIGINT,
              unique: true,
              autoIncrement: true
            },
            assignee: {
              allowNull: false,
              type: DataTypes.BIGINT,
              primaryKey: true,
              references: {
                model: 'users',
                key: 'id'
              }
            },
            createdBy: {
              allowNull: false,
              type: DataTypes.BIGINT,
              primaryKey: true,
              references: {
                model: 'users',
                key: 'id'
              },
              field: 'created_by'
            },
            name: {
              allowNull: false,
              type: DataTypes.STRING,
              unique: true
            },
            description: {
              type: DataTypes.STRING
            },
            streak: {
              type: DataTypes.INTEGER,
              defaultValue: 0
            },
            score: {
              type: DataTypes.INTEGER,
              defaultValue: 10000
            },
            recurring: {
              type: DataTypes.BOOLEAN,
              defaultValue: true
            },
            dueTime: {
              allowNull: false,
              type: DataTypes.STRING,
              defaultValue: '14:00',
              field: 'due_time'
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

        await queryInterface.createTable(
          'chores',
          {
            id: {
              primaryKey: true,
              type: DataTypes.BIGINT,
              unique: true,
              autoIncrement: true
            },
            choreChartId: {
              allowNull: false,
              type: DataTypes.BIGINT,
              onDelete: 'CASCADE',
              references: {
                model: 'chore_charts',
                key: 'id'
              },
              field: 'chore_chart_id'
            },
            name: {
              allowNull: false,
              type: DataTypes.STRING,
              unique: true
            },
            description: {
              type: DataTypes.STRING
            },
            scheduleDays: {
              allowNull: false,
              type: DataTypes.STRING,
              field: 'schedule_days'
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

        await queryInterface.createTable(
          'chore_chart_events',
          {
            id: {
              primaryKey: true,
              type: DataTypes.BIGINT,
              autoIncrement: true
            },
            choreChartId: {
              allowNull: false,
              type: DataTypes.BIGINT,
              onDelete: 'CASCADE',
              references: {
                model: 'chore_charts',
                key: 'id'
              },
              field: 'chore_chart_id'
            },
            choreId: {
              allowNull: false,
              type: DataTypes.BIGINT,
              onDelete: 'CASCADE',
              references: {
                model: 'chores',
                key: 'id'
              },
              field: 'chore_id'
            },
            status: {
              type: DataTypes.STRING
            },
            rating: {
              type: DataTypes.INTEGER,
              defaultValue: 0
            },
            due: {
              type: DataTypes.DATE
            },
            completed: {
              type: DataTypes.DATE
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
      }
    );
  },

  down: (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.sequelize.transaction(
      async (transaction: Transaction) => {
        await queryInterface.dropTable('chore_chart_events', { transaction });
        await queryInterface.dropTable('chores', { transaction });
        await queryInterface.dropTable('chore_charts', { transaction });
      }
    );
  }
} as IMigrationDefinition;
