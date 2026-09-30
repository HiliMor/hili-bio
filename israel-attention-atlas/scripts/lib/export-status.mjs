import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { openDatabase } from "./database.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const defaultStatusPath = resolve(projectRoot, "public/data/collector-status.json");

export function exportCollectorStatus(options = {}) {
  const database = openDatabase(options.databasePath);
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
    const sources = database.prepare(`
      SELECT s.slug, s.name, COUNT(a.id) AS unique_articles,
             MAX(a.last_seen_at) AS last_seen_at
      FROM sources s
      LEFT JOIN articles a ON a.source_slug = s.slug
      GROUP BY s.slug
      ORDER BY s.slug
    `).all();

    const payload = {
      generatedAt: new Date().toISOString(),
      totals: {
        runs: totals.runs,
        snapshots: totals.snapshots,
        uniqueArticles: totals.unique_articles,
        observations: totals.observations,
      },
      latestRun: latestRun
        ? {
            startedAt: latestRun.started_at,
            finishedAt: latestRun.finished_at,
            status: latestRun.status,
            successfulSources: latestRun.successful_sources,
            failedSources: latestRun.failed_sources,
            totalItems: latestRun.total_items,
            insertedArticles: latestRun.inserted_articles,
          }
        : null,
      sources: sources.map((source) => ({
        slug: source.slug,
        name: source.name,
        uniqueArticles: source.unique_articles,
        lastSeenAt: source.last_seen_at,
      })),
    };

    const outputPath = options.outputPath ?? defaultStatusPath;
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    return { outputPath, payload };
  } finally {
    database.close();
  }
}
