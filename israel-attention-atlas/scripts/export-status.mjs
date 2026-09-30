import { exportCollectorStatus } from "./lib/export-status.mjs";

const { outputPath, payload } = exportCollectorStatus();
console.log(JSON.stringify({ outputPath, generatedAt: payload.generatedAt }, null, 2));
