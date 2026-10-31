const { spawn } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log('🌙 Launching SomnaAI Full-Stack Suite');
console.log('   - Backend API: http://localhost:5000');
console.log('   - Frontend UI:  http://localhost:5173');
console.log('====================================================\n');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// 1. Start Express Server (Port 5000)
const server = spawn(npmCmd, ['run', 'dev', '--prefix', 'server'], {
  stdio: 'inherit',
  shell: true,
});

// 2. Start Vite Frontend (Port 5173)
const client = spawn(npmCmd, ['run', 'dev', '--prefix', 'client'], {
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\nStopping SomnaAI services...');
  try {
    if (isWin) {
      if (server.pid) spawn('taskkill', ['/pid', String(server.pid), '/f', '/t'], { stdio: 'ignore' });
      if (client.pid) spawn('taskkill', ['/pid', String(client.pid), '/f', '/t'], { stdio: 'ignore' });
    } else {
      server.kill('SIGTERM');
      client.kill('SIGTERM');
    }
  } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
