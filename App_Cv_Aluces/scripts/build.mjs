import { cp, mkdir, readFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "dist");
// Only this application's generated dist directory may be replaced.
if (path.dirname(output) !== path.resolve(root) || path.basename(output) !== "dist") {
  throw new Error("Unexpected build output directory");
}
await readFile(path.join(root, "package-lock.json"));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const entry of ["webapp", "server.cjs", "xs-app.json", "package.json", "package-lock.json"]) {
  await cp(path.join(root, entry), path.join(output, entry), { recursive: true });
}
console.log("Build listo: dist/ contiene únicamente la aplicación y sus archivos de ejecución.");
