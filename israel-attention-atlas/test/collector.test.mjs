import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { collectOnce } from "../scripts/lib/collector.mjs";
import { openDatabase } from "../scripts/lib/database.mjs";

test("collector persists snapshots without article bodies", async () => {
  const directory = mkdtempSync(join(tmpdir(), "attention-atlas-test-"));
  const databasePath = join(directory, "test.sqlite");
  const feed = `<rss><channel><item><title>Test title</title><link>https://example.com/story</link><description>SECRET_BODY_MARKER</description></item></channel></rss>`;
  const server = createServer((request, response) => {
    response.writeHead(200, { "content-type": "application/rss+xml" });
    response.end(feed);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const source = {
    slug: "fixture",
    name: "Fixture",
    url: `http://127.0.0.1:${address.port}/feed.xml`,
    homepage: "https://example.com",
    pilotPolicy: "test",
  };

  try {
    const summary = await collectOnce({ databasePath, sources: [source] });
    assert.equal(summary.status, "success");
    assert.equal(summary.totalItems, 1);

    const database = openDatabase(databasePath);
    const article = database.prepare("SELECT title, canonical_url FROM articles").get();
    const columns = database.prepare("PRAGMA table_info(articles)").all().map((column) => column.name);
    database.close();
    assert.equal(article.title, "Test title");
    assert.equal(article.canonical_url, "https://example.com/story");
    assert.equal(columns.includes("description"), false);

    const bytes = readFileSync(databasePath);
    assert.equal(bytes.includes(Buffer.from("SECRET_BODY_MARKER")), false);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});
