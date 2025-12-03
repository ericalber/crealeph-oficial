#!/usr/bin/env node
import { execSync, spawnSync } from 'node:child_process';

const ports = [3003, 4003, 4002];

function list(port) {
  try {
    const out = execSync(`lsof -nP -iTCP:${port} -sTCP:LISTEN || true`, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
    return out.trim();
  } catch {
    return '';
  }
}

function pids(port) {
  try {
    const out = execSync(`lsof -ti tcp:${port} || true`, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
    return out.split(/\s+/).filter(Boolean);
  } catch {
    return [];
  }
}

for (const port of ports) {
  const before = list(port);
  if (!before) continue;
  console.log(`[free-ports] Porto ${port} em uso:\n${before}`);
  const ids = pids(port);
  for (const pid of ids) {
    try {
      process.kill(Number(pid), 'SIGTERM');
      console.log(`[free-ports] Enviado SIGTERM para PID ${pid} na porta ${port}`);
    } catch {}
  }
}

// aguarda um pouco
Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500);

for (const port of ports) {
  if (!list(port)) continue;
  const ids = pids(port);
  for (const pid of ids) {
    try {
      process.kill(Number(pid), 'SIGKILL');
      console.log(`[free-ports] Enviado SIGKILL para PID ${pid} na porta ${port}`);
    } catch {}
  }
}

for (const port of ports) {
  const after = list(port);
  if (after) {
    console.warn(`[free-ports] Atenção, porta ${port} ainda em uso:`);
    console.warn(after);
  } else {
    console.log(`[free-ports] Porta ${port} liberada.`);
  }
}
