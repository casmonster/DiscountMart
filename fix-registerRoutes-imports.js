import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname); // Scan everything under project root
let fixedCount = 0;
let matchedCount = 0;

const importRegex = /import\s+registerRoutes\s+from\s+['"]\.\/routes['"]\s*;?/;

function fixImportsInFile(filePath) {
  const code = fs.readFileSync(filePath, "utf8");

  if (importRegex.test(code)) {
    matchedCount++;
    const fixedCode = code.replace(importRegex, `import { registerRoutes } from "./routes";`);
    fs.writeFileSync(filePath, fixedCode, "utf8");
    console.log(`✔️ Fixed import in ${path.relative(__dirname, filePath)}`);
    fixedCount++;
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDirectory(fullPath);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".js")) {
      fixImportsInFile(fullPath);
    }
  }
}

walkDirectory(rootDir);
console.log(`\n🔍 Matches found: ${matchedCount}`);
console.log(`✅ Fixed: ${fixedCount} file(s) updated.`);
