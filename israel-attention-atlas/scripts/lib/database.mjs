import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const defaultDatabasePath = resolve(projectRoot, "data/attention-atlas.sqlite");

export function openDatabase(databasePath = process.env.ATLAS_DB_PATH || defaultDatabasePath) {
  mkdirSync(dirname(databasePath), { recursive: true });
  const database = new DatabaseSync(databasePath);
  database.exec("PRAGMA foreign_keys = ON");
  database.exec("PRAGMA journal_mode = WAL");
  database.exec("PRAGMA busy_timeout = 5000");
  migrate(database);
  return database;
}

function migrate(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS sources (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      feed_url TEXT NOT NULL,
      homepage_url TEXT,
      pilot_policy TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS collection_runs (
      id TEXT PRIMARY KEY,
      started_at TEXT NOT NULL,
      finished_at TEXT,
      status TEXT NOT NULL,
      successful_sources INTEGER NOT NULL DEFAULT 0,
      failed_sources INTEGER NOT NULL DEFAULT 0,
      total_items INTEGER NOT NULL DEFAULT 0,
      inserted_articles INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS snapshots (
      id TEXT PRIMARY KEY,
      run_id TEXT NOT NULL REFERENCES collection_runs(id) ON DELETE CASCADE,
      source_slug TEXT NOT NULL REFERENCES sources(slug),
      collected_at TEXT NOT NULL,
      status TEXT NOT NULL,
      http_status INTEGER,
      latency_ms INTEGER,
      item_count INTEGER NOT NULL DEFAULT 0,
      feed_updated_at TEXT,
      error_message TEXT
    );

    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      source_slug TEXT NOT NULL REFERENCES sources(slug),
      guid TEXT,
      canonical_url TEXT,
      title TEXT NOT NULL,
      normalized_title TEXT NOT NULL,
      title_hash TEXT NOT NULL,
      published_at TEXT,
      tags_json TEXT NOT NULL DEFAULT '[]',
      first_seen_at TEXT NOT NULL,
      last_seen_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS snapshot_items (
      snapshot_id TEXT NOT NULL REFERENCES snapshots(id) ON DELETE CASCADE,
      article_id TEXT NOT NULL REFERENCES articles(id),
      feed_position INTEGER NOT NULL,
      PRIMARY KEY (snapshot_id, article_id)
    );

    CREATE INDEX IF NOT EXISTS idx_snapshots_source_time
      ON snapshots(source_slug, collected_at DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_published
      ON articles(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_title_hash
      ON articles(title_hash);
    CREATE INDEX IF NOT EXISTS idx_snapshot_items_article
      ON snapshot_items(article_id);
  `);
}

export function upsertSource(database, source, now) {
  database.prepare(`
    INSERT INTO sources (
      slug, name, feed_url, homepage_url, pilot_policy, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      name = excluded.name,
      feed_url = excluded.feed_url,
      homepage_url = excluded.homepage_url,
      pilot_policy = excluded.pilot_policy,
      updated_at = excluded.updated_at
  `).run(
    source.slug,
    source.name,
    source.url,
    source.homepage,
    source.pilotPolicy,
    now,
    now,
  );
}
