const sources = [
  {
    name: "ynet",
    url: "https://www.ynet.co.il/Integration/StoryRss2.xml",
    kind: "rss",
  },
  {
    name: "Walla News",
    url: "https://www.walla.co.il/rss/feed/news",
    kind: "rss",
  },
  {
    name: "Israel Hayom",
    url: "https://www.israelhayom.co.il/rss.xml",
    kind: "rss",
  },
  {
    name: "Globes — latest",
    url: "https://www.globes.co.il/webservice/rss/rssfeeder.asmx/FeederNode?iID=585",
    kind: "rss",
  },
  {
    name: "Kan News",
    url: "https://www.kan.org.il/content/kan/news/",
    kind: "html",
  },
  {
    name: "N12",
    url: "https://www.n12.co.il/",
    kind: "html",
  },
];

const clean = (value = "") =>
  value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const firstMatch = (body, tag) => {
  const match = body.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return clean(match?.[1]);
};

const countMatches = (body, pattern) => [...body.matchAll(pattern)].length;

async function probe(source) {
  const startedAt = performance.now();
  try {
    const response = await fetch(source.url, {
      redirect: "follow",
      headers: {
        "user-agent": "AttentionAtlasFeasibilityProbe/0.1 (research prototype)",
        accept: "application/rss+xml, application/xml, text/xml, text/html;q=0.8",
      },
      signal: AbortSignal.timeout(15_000),
    });
    const body = await response.text();
    const isFeed = /<(rss|feed)[\s>]/i.test(body);
    const itemCount = countMatches(body, /<(item|entry)[\s>]/gi);
    return {
      source: source.name,
      requestedKind: source.kind,
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type"),
      bytes: Buffer.byteLength(body),
      elapsedMs: Math.round(performance.now() - startedAt),
      finalUrl: response.url,
      feedDetected: isFeed,
      itemCount,
      language: firstMatch(body, "language") || null,
      lastBuildDate: firstMatch(body, "lastBuildDate") || firstMatch(body, "updated") || null,
      sampleTitle: isFeed ? firstMatch(body.match(/<(item|entry)[\s>][\s\S]*/i)?.[0] ?? "", "title") : null,
    };
  } catch (error) {
    return {
      source: source.name,
      requestedKind: source.kind,
      ok: false,
      error: error.message,
      elapsedMs: Math.round(performance.now() - startedAt),
    };
  }
}

const results = await Promise.all(sources.map(probe));
console.log(JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
