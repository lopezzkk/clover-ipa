// Vite para desenvolvimento: roda o build (scripts/build.mjs) e recarrega a página quando
// algum arquivo de game/, src/, assets/ ou public/ muda. O build de produção é o mesmo do "npm run build".
// Conferido no GitHub Actions a cada envio (passo "Conferir o Vite").
import { defineConfig, type Plugin } from 'vite';
import { execFileSync } from 'node:child_process';

function cloverBuild(): Plugin {
  const run = () => execFileSync(process.execPath, ['scripts/build.mjs', '--nomin'], { stdio: 'inherit' });
  return {
    name: 'clover-build',
    buildStart() { run(); },
    configureServer(server) {
      run();
      server.watcher.add(['game', 'src', 'assets', 'public', 'index.template.html']);
      server.watcher.on('change', (f) => {
        if (/[\\/](dist|node_modules)[\\/]/.test(f)) return;
        try { run(); server.ws.send({ type: 'full-reload' }); } catch (e) { console.error(e); }
      });
    },
  };
}

export default defineConfig({
  root: 'dist',
  plugins: [cloverBuild()],
  server: { host: true, port: 5173 },
  preview: { port: 4173 },
});
