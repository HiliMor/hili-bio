import { openDatabase } from "./lib/database.mjs";

const database = openDatabase();
try {
  const totals = database.prepare(`
    SELECT
      (SELECT COUNT(*) FROM collection_runs) AS runs,
      (SELECT COUNT(*) FROM snapshots) AS snapshots,
      (SELECT COUNT(*) FROM articles) AS unique_articles,
      (SELECT COUNT(*) FROM snapshot_items) AS observations
  `).get();

  const latestRun = database.prepare(`
    SELECT started_at, finished_at, status, successful_sources,
           failed_sources, total_items, inserted_articles
    FROM collection_runs
    ORDER BY started_at DESC
    LIMIT 1
  `).get();

  const bySource = database.prepare(`
    SELECT s.name, COUNT(a.id) AS unique_articles,
           MIN(a.first_seen_at) AS first_seen_at,
           MAX(a.last_seen_at) AS last_seen_at
    FROM sources s
    LEFT JOIN articles a ON a.source_slug = s.slug
    GROUP BY s.slug
    ORDER BY unique_articles DESC
  `).all();

  console.log(JSON.stringify({ totals, latestRun, bySource }, null, 2));
} finally {
  database.close();
}
