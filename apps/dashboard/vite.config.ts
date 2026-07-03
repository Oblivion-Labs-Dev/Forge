import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// custom plugin to serve .forge files
function serveForgePocPlugin() {
  return {
    name: 'serve-forge-poc',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url.startsWith('/api/poc/latest')) {
          try {
            const data = fs.readFileSync(path.resolve('../../.forge/archive/latest.json'), 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
          } catch {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'No run found' }));
          }
          return;
        }
        if (req.url.startsWith('/api/poc/events/')) {
          const runId = req.url.split('/').pop();
          try {
            const data = fs.readFileSync(path.resolve(`../../.forge/runs/${runId}/events.json`), 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
          } catch {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Events not found' }));
          }
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serveForgePocPlugin()],
});
