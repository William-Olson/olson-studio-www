import { IMigrationDefinition } from 'db-facade';

interface IImportedModule {
  default: unknown;
}

export const getMigrationFiles = async (): Promise<IMigrationDefinition[]> => {
  const migrations: IMigrationDefinition[] = [];

  const addMigration = async (pendingImport: Promise<IImportedModule>) => {
    migrations.push((await pendingImport).default as IMigrationDefinition);
  };

  // add migrations
  await addMigration(import('./20220620191016-AddUserTable'));
  await addMigration(import('./20220708155325-AddingSessionTable'));
  await addMigration(import('./20220908075756-AddUserBadges'));

  return migrations;
};
