import { randomUUID } from "node:crypto";
import { getFeedUpdatedAt, parseFeed } from "./feed-parser.mjs";
import { openDatabase, upsertSource } from "./database.mjs";
import { researchSources } from "./sources.mjs";

const USER_AGENT = "AttentionAtlasCollector/0.1 (internal research prototype)";

async function fetchSource(source) {
  const startedAt = performance.now();
  try {
    const response = await fetch(source.url, {
      redirect: "follow",
      headers: {
        accept: "application/rss+xml, application/xml, text/xml;q=0.9",
        "user-agent": USER_AGENT,
      },
      signal: AbortSignal.timeout(15_000),
    });
    const xml = await response.text();
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const items = parseFeed(xml, source.slug);
    return {
      source,
      ok: true,
      httpStatus: response.status,
      latencyMs: Math.round(performance.now() - startedAt),
      feedUpdatedAt: getFeedUpdatedAt(xml),
      items,
    };
  } catch (error) {
    return {
      source,
      ok: false,
      httpStatus: error.cause?.status ?? null,
      latencyMs: Math.round(performance.now() - startedAt),
      error: error.message,
      items: [],
    };
  }
}

function persistResult(database, runId, result, collectedAt) {
  const snapshotId = randomUUID();
  let insertedArticles = 0;

  database.exec("BEGIN IMMEDIATE");
  try {
    database.prepare(`
      INSERT INTO snapshots (
        id, run_id, source_slug, collected_at, status, http_status,
        latency_ms, item_count, feed_updated_at, error_message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      snapshotId,
      runId,
      result.source.slug,
      collectedAt,
      result.ok ? "success" : "failed",
      result.httpStatus,
      result.latencyMs,
      result.items.length,
      result.feedUpdatedAt ?? null,
      result.error ?? null,
    );

    const insertArticle = database.prepare(`
      INSERT OR IGNORE INTO articles (
        id, source_slug, guid, canonical_url, title, normalized_title,
        title_hash, published_at, tags_json, first_seen_at, last_seen_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const updateArticle = database.prepare(`
      UPDATE articles SET
        guid = ?, canonical_url = ?, title = ?, normalized_title = ?,
        title_hash = ?, published_at = COALESCE(?, published_at), tags_json = ?,
        last_seen_at = ?
      WHERE id = ?
    `);
    const insertSnapshotItem = database.prepare(`
      INSERT OR IGNORE INTO snapshot_items (snapshot_id, article_id, feed_position)
      VALUES (?, ?, ?)
    `);

    for (const item of result.items) {
      const insert = insertArticle.run(
        item.id,
        item.sourceSlug,
        item.guid,
        item.url,
        item.title,
        item.normalizedTitle,
        item.titleHash,
        item.publishedAt,
        JSON.stringify(item.tags),
        collectedAt,
        collectedAt,
      );
      if (insert.changes > 0) {
        insertedArticles += 1;
      } else {
        updateArticle.run(
          item.guid,
          item.url,
          item.title,
          item.normalizedTitle,
          item.titleHash,
          item.publishedAt,
          JSON.stringify(item.tags),
          collectedAt,
          item.id,
        );
      }
      insertSnapshotItem.run(snapshotId, item.id, item.position);
    }

    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }

  return { snapshotId, insertedArticles };
}

export async function collectOnce(options = {}) {
  const database = openDatabase(options.databasePath);
  const sources = options.sources ?? researchSources;
  const runId = randomUUID();
  const startedAt = new Date().toISOString();

  try {
    for (const source of sources) upsertSource(database, source, startedAt);
    database.prepare(`
      INSERT INTO collection_runs (id, started_at, status)
      VALUES (?, ?, 'running')
    `).run(runId, startedAt);

    const results = await Promise.all(sources.map(fetchSource));
    let insertedArticles = 0;
    for (const result of results) {
      insertedArticles += persistResult(database, runId, result, new Date().toISOString()).insertedArticles;
    }

    const successfulSources = results.filter((result) => result.ok).length;
    const failedSources = results.length - successfulSources;
    const totalItems = results.reduce((sum, result) => sum + result.items.length, 0);
    const status = failedSources === 0 ? "success" : successfulSources > 0 ? "partial" : "failed";
    const finishedAt = new Date().toISOString();

    database.prepare(`
      UPDATE collection_runs SET
        finished_at = ?, status = ?, successful_sources = ?, failed_sources = ?,
        total_items = ?, inserted_articles = ?
      WHERE id = ?
    `).run(
      finishedAt,
      status,
      successfulSources,
      failedSources,
      totalItems,
      insertedArticles,
      runId,
    );

    return {
      runId,
      startedAt,
      finishedAt,
      status,
      successfulSources,
      failedSources,
      totalItems,
      insertedArticles,
      sources: results.map((result) => ({
        slug: result.source.slug,
        ok: result.ok,
        itemCount: result.items.length,
        latencyMs: result.latencyMs,
        error: result.error ?? null,
      })),
    };
  } catch (error) {
    database.prepare(`
      UPDATE collection_runs SET finished_at = ?, status = 'failed'
      WHERE id = ?
    `).run(new Date().toISOString(), runId);
    throw error;
  } finally {
    database.close();
  }
}
