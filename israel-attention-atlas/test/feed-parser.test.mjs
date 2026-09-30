import assert from "node:assert/strict";
import test from "node:test";
import {
  canonicalizeUrl,
  cleanText,
  normalizeTitle,
  parseFeed,
} from "../scripts/lib/feed-parser.mjs";

test("cleanText strips markup and decodes common entities", () => {
  assert.equal(cleanText("<![CDATA[<b>שלום</b> &amp; עולם]]>"), "שלום & עולם");
});

test("canonicalizeUrl removes tracking without changing useful parameters", () => {
  assert.equal(
    canonicalizeUrl("https://example.com/story?id=42&utm_source=test#section"),
    "https://example.com/story?id=42",
  );
});

test("normalizeTitle makes comparable Hebrew title text", () => {
  assert.equal(normalizeTitle('״כותרת״ — חדשה!'), "כותרת חדשה");
});

test("parseFeed extracts only metadata and produces stable IDs", () => {
  const xml = `<?xml version="1.0"?><rss><channel><item>
    <title><![CDATA[<b>כותרת בדיקה</b>]]></title>
    <link>https://example.com/a?utm_source=rss</link>
    <guid>story-a</guid>
    <pubDate>Wed, 30 Sep 2026 12:00:00 GMT</pubDate>
    <category>חדשות</category>
    <description>גוף שלא אמור להישמר</description>
  </item></channel></rss>`;

  const [item] = parseFeed(xml, "example");
  assert.equal(item.title, "כותרת בדיקה");
  assert.equal(item.url, "https://example.com/a");
  assert.equal(item.publishedAt, "2026-09-30T12:00:00.000Z");
  assert.deepEqual(item.tags, ["חדשות"]);
  assert.equal("description" in item, false);
  assert.equal(item.id, parseFeed(xml, "example")[0].id);
});
