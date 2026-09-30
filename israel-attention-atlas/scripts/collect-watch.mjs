import { collectOnce } from "./lib/collector.mjs";
import { exportCollectorStatus } from "./lib/export-status.mjs";

const intervalMinutes = Number.parseInt(process.env.ATLAS_INTERVAL_MINUTES ?? "15", 10);
const intervalMs = Math.max(1, intervalMinutes) * 60_000;
let collecting = false;

async function run() {
  if (collecting) return;
  collecting = true;
  try {
    const summary = await collectOnce();
    exportCollectorStatus();
    console.log(`[${summary.finishedAt}] ${summary.status}: ${summary.totalItems} items, ${summary.insertedArticles} new`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] collection failed: ${error.message}`);
  } finally {
    collecting = false;
  }
}

console.log(`Collector started. Interval: ${intervalMinutes} minute(s). Press Ctrl+C to stop.`);
await run();
const timer = setInterval(run, intervalMs);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    clearInterval(timer);
    console.log(`Collector stopped (${signal}).`);
    process.exit(0);
  });
}
