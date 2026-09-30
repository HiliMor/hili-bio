import { createHash } from "node:crypto";

const NAMED_ENTITIES = {
  amp: "&",
  apos: "'",
  gt: ">",
  hellip: "…",
  laquo: "«",
  lt: "<",
  nbsp: " ",
  quot: '"',
  raquo: "»",
};

export function decodeEntities(value = "") {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&([a-z]+);/gi, (entity, name) => NAMED_ENTITIES[name.toLowerCase()] ?? entity);
}

export function cleanText(value = "") {
  return decodeEntities(
    value
      .replace(/<!\[CDATA\[|\]\]>/g, "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[\u200e\u200f\u202a-\u202e]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(block, tagNames) {
  for (const tag of tagNames) {
    const escapedTag = tag.replace(":", "\\:");
    const match = block.match(new RegExp(`<${escapedTag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escapedTag}>`, "i"));
    if (match) return cleanText(match[1]);
  }
  return "";
}

function extractLink(block) {
  const textLink = extractTag(block, ["link"]);
  if (textLink) return textLink;
  const href = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i)?.[1];
  return cleanText(href);
}

function extractCategories(block) {
  return [...block.matchAll(/<category(?:\s[^>]*)?>([\s\S]*?)<\/category>/gi)]
    .map((match) => cleanText(match[1]))
    .filter(Boolean);
}

export function canonicalizeUrl(value = "") {
  if (!value) return "";
  try {
    const url = new URL(value);
    url.hash = "";
    for (const parameter of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid$|gclid$|ref$|source$)/i.test(parameter)) {
        url.searchParams.delete(parameter);
      }
    }
    return url.toString();
  } catch {
    return value.trim();
  }
}

export function normalizeTitle(value = "") {
  return cleanText(value)
    .normalize("NFKC")
    .toLocaleLowerCase("he")
    .replace(/["'׳״.,:;!?()[\]{}־–—|/\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function parseFeed(xml, sourceSlug) {
  if (!/<(?:rss|feed)[\s>]/i.test(xml)) {
    throw new Error("Response is not an RSS or Atom feed");
  }

  const itemBlocks = [...xml.matchAll(/<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi)].map(
    (match) => match[2],
  );

  return itemBlocks
    .map((block, position) => {
      const title = extractTag(block, ["title"]);
      const url = canonicalizeUrl(extractLink(block));
      const guid = extractTag(block, ["guid", "id"]);
      const publishedRaw = extractTag(block, ["pubDate", "published", "updated", "dc:date"]);
      const publishedDate = publishedRaw ? new Date(publishedRaw) : null;
      const publishedAt = publishedDate && !Number.isNaN(publishedDate.valueOf())
        ? publishedDate.toISOString()
        : null;
      const normalizedTitle = normalizeTitle(title);

      if (!title || (!url && !guid)) return null;

      const identity = guid || url || `${normalizedTitle}|${publishedAt ?? "unknown"}`;
      return {
        id: hash(`${sourceSlug}|${identity}`),
        sourceSlug,
        guid: guid || null,
        url: url || null,
        title,
        normalizedTitle,
        titleHash: hash(normalizedTitle),
        publishedAt,
        tags: extractCategories(block),
        position,
      };
    })
    .filter(Boolean);
}

export function getFeedUpdatedAt(xml) {
  const raw = extractTag(xml, ["lastBuildDate", "updated"]);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.valueOf()) ? null : date.toISOString();
}
