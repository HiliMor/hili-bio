import { collectOnce } from "./lib/collector.mjs";
import { exportCollectorStatus } from "./lib/export-status.mjs";

try {
  const summary = await collectOnce();
  exportCollectorStatus();
  console.log(JSON.stringify(summary, null, 2));
  if (summary.status === "failed") process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify({ status: "failed", error: error.message }, null, 2));
  process.exitCode = 1;
}
