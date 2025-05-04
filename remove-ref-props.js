import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const directory = './client/src'; // Adjust as needed

function scanAndFixFiles(dir) {
  readdirSync(dir).forEach((file) => {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      scanAndFixFiles(fullPath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      let code = readFileSync(fullPath, 'utf8');
      let originalCode = code;

      // Remove static refs: ref="..." or ref={'...'}
      code = code.replace(/\sref\s*=\s*{?\s*["'`]([^"'`]+)["'`]\s*}?/g, '');

      // Comment dynamic refs: ref={someVar}
      code = code.replace(/\sref\s*=\s*{([^}"']+)}/g, (_match, p1) => {
        return `/* ref={${p1.trim()}} */ /* ⚠️ Check: convert to useRef + forwardRef if needed */`;
      });

      // Optional: comment on common patterns needing forwardRef
      if (/React\.forwardRef|forwardRef/.test(code) === false && /ref={/.test(originalCode)) {
        code =
          `/* ⚠️ Consider wrapping this component with React.forwardRef if it needs to accept refs */\n` +
          code;
      }

      if (code !== originalCode) {
        writeFileSync(fullPath, code, 'utf8');
        console.log(`✔️ Updated: ${fullPath}`);
      }
    }
  });
}

scanAndFixFiles(directory);
