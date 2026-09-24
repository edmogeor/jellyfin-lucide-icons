import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const references = [
    'reference/jellyfin-web',
    'reference/jellyfin-server',
    'reference/elegantfin',
    'reference/elegantfin-jf12',
    'reference/jellyfin-enhanced',
    'reference/intro-skipper',
    'reference/seerrfin'
];

for (const reference of references) {
    const directory = join(process.cwd(), reference);
    if (!existsSync(directory)) throw new Error(`Missing ${reference}. Clone the references before updating.`);
    execFileSync('git', ['pull', '--ff-only'], { cwd: directory, stdio: 'inherit' });
}
