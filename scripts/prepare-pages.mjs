import { access, writeFile } from "node:fs/promises";

const serverEntry = "dist/server/index.js";
const pagesWorker = "dist/_worker.js";

await access(serverEntry);
await writeFile(
  pagesWorker,
  'export { default } from "./server/index.js";\n',
  "utf8",
);

console.log(`Generated ${pagesWorker} from ${serverEntry}`);
