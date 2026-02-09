import { createStore } from './store/kv.js';
import { handleLogin, requireAuth } from './admin/auth.js';
import { handleAdminApi } from './admin/api.js';
import { getAdminPage } from './admin/page.js';
import { runDueTasks } from './checker/runner.js';

export default {
  // ---- HTTP Handler ----
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const store = createStore(env.KV);

    try {
      // Admin SPA page
      if (path === '/admin' || path === '/admin/') {
        return new Response(getAdminPage(), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      // Admin login
      if (path === '/admin/api/login' && request.method === 'POST') {
        return handleLogin(request, env);
      }

      // Admin API (auth required)
      if (path.startsWith('/admin/api/')) {
        const authed = await requireAuth(request, env);
        if (!authed) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return handleAdminApi(request, env, store);
      }

      // Health check
      if (path === '/' || path === '/health') {
        const store2 = createStore(env.KV);
        const tasks = await store2.getTasks();
        const active = tasks.filter(t => t.enabled).length;
        return new Response(
          `Keep Alive Worker is running. (${active}/${tasks.length} tasks active)`,
          { headers: { 'Content-Type': 'text/plain' } }
        );
      }

      return new Response('Not Found', { status: 404 });
    } catch (err) {
      console.error('Unhandled error:', err);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },

  // ---- Cron Trigger Handler ----
  async scheduled(event, env, ctx) {
    const store = createStore(env.KV);
    console.log(`[cron] Triggered at ${new Date(event.scheduledTime).toISOString()}`);

    ctx.waitUntil(
      runDueTasks(store).then(results => {
        if (results.length > 0) {
          console.log(`[cron] Checked ${results.length} tasks:`,
            results.map(r => `${r.name}=${r.status||'ERR'}(${r.duration}ms)`).join(', ')
          );
        }
      }).catch(err => {
        console.error('[cron] Error:', err);
      })
    );
  },
};
