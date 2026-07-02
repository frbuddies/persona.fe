import { execSync } from 'child_process';
const port = process.env.PORT || 3000;
execSync(`serve dist -s -l ${port}`, { stdio: 'inherit', shell: true });
