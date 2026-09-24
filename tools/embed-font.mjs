import { readFileSync, writeFileSync } from 'node:fs';

const cssFile = 'dist/jellyfin-lucide-icons.css';
const font = readFileSync('dist/jellyfin-lucide-icons.woff2').toString('base64');
const css = readFileSync(cssFile, 'utf8');
const fontFace = `@font-face {\n  font-family: "Jellyfin Lucide";\n  src: url("data:font/woff2;base64,${font}") format("woff2");\n}\n\n.material-icons,\n.material-symbols-outlined,\n.material-symbols-rounded,\n.material-symbols-sharp {\n  font-family: "Jellyfin Lucide" !important;\n}\n\n`;

writeFileSync(cssFile, css.replace(/^\/\* Generated[^\n]*\n\n/, (header) => `${header}${fontFace}`));
