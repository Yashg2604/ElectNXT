import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | undefined;

export async function initializeDatabase() {
  if (!db) {
    db = await open({
      filename: './electnxt.db',
      driver: sqlite3.Database,
    });
  }

  // Split the CREATE TABLE statements to avoid issues with sqlite3 driver
  await db.exec(`
    CREATE TABLE IF NOT EXISTS elections (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      commitStart INTEGER NOT NULL,
      commitEnd INTEGER NOT NULL,
      revealStart INTEGER NOT NULL,
      revealEnd INTEGER NOT NULL,
      status TEXT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS candidates (
      id TEXT PRIMARY KEY,
      electionId TEXT NOT NULL,
      name TEXT NOT NULL,
      photo TEXT,
      manifesto TEXT NOT NULL,
      manifestoCID TEXT NOT NULL,
      voteCount INTEGER DEFAULT 0,
      FOREIGN KEY (electionId) REFERENCES elections (id)
    );
  `);

  return db;
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
}