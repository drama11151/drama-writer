import { execSync } from 'child_process';
try {
  const output = execSync('npx vite build 2>&1', { encoding: 'utf8', timeout: 30000 });
  console.log(output);
} catch (e) {
  console.log(e.stdout || e.stderr || e.message);
}
