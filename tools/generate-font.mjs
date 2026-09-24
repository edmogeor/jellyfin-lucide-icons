import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const python = process.env.PYTHON ?? (existsSync('.venv/bin/python') ? '.venv/bin/python' : 'python3');
execFileSync(python, ['tools/generate_font.py'], { stdio: 'inherit' });
