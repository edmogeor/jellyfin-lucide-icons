import { readFileSync, statSync } from 'node:fs';

const css = readFileSync('dist/jellyfin-lucide-icons.css', 'utf8');
const index = readFileSync('ICON_INDEX.md', 'utf8');

if (!css.includes('.material-icons.play_arrow') || !css.includes('mask: url("data:image/svg+xml,')) {
    throw new Error('Generated CSS is missing Lucide masks.');
}

if (!index.includes('| `play_arrow` | `play` |')) {
    throw new Error('Icon index is missing the play mapping.');
}

if (!css.includes('svg[data-testid="GroupsIcon"]') || !index.includes('| `GroupsIcon` | `users` |')) {
    throw new Error('MUI SvgIcon replacement is missing.');
}

if (!css.includes('.selectVideoContainer.trackSelectionFieldContainer > label') || !index.includes('| Video track | `film` |')) {
    throw new Error('ElegantFin track icon replacement is missing.');
}

if (!css.includes('font-family: "Jellyfin Lucide"') || statSync('dist/jellyfin-lucide-icons.woff2').size === 0) {
    throw new Error('Embedded Lucide compatibility font is missing.');
}

if (!css.includes('.ts-search-icon') || !css.includes('.tab-warning-icon')) {
    throw new Error('Intro Skipper icon replacements are missing.');
}

console.log('Generated CSS and icon index passed basic checks.');
