import { executeCheck } from '../checker/runner.js';

export async function handleAdminApi(request, env, store) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/admin/api', '');
  const method = request.method;

  try {
    // --- Tasks CRUD ---
    if (path === '/tasks' && method === 'GET') {
      return jsonRes(await store.getTasks());
    }

    if (path === '/tasks' && method === 'POST') {
      const data = await request.json();
      if (!data.url) return jsonRes({ error: 'URL is required' }, 400);

      const tasks = await store.getTasks();
      const task = {
        id: crypto.randomUUID(),
        name: (data.name || '').trim() || 'Unnamed',
        url: data.url.trim(),
        method: data.method || 'GET',
        headers: parseHeaders(data.headers),
        body: data.body || '',
        interval: Math.max(1, parseInt(data.interval) || 5),
        timeout: Math.max(1, Math.min(120, parseInt(data.timeout) || 30)),
        enabled: data.enabled !== false,
        created_at: new Date().toISOString(),
        last_check: null,
        last_status: null,
        last_duration: null,
        last_error: null,
        success_count: 0,
        fail_count: 0,
      };
      tasks.push(task);
      await store.saveTasks(tasks);
      return jsonRes(task, 201);
    }

    // Match /tasks/:id
    const taskMatch = path.match(/^\/tasks\/([^/]+)$/);
    if (taskMatch) {
      const id = taskMatch[1];

      if (method === 'PUT') {
        const data = await request.json();
        const tasks = await store.getTasks();
        const idx = tasks.findIndex(t => t.id === id);
        if (idx === -1) return jsonRes({ error: 'Task not found' }, 404);

        const t = tasks[idx];
        tasks[idx] = {
          ...t,
          name: data.name !== undefined ? (data.name || '').trim() || 'Unnamed' : t.name,
          url: data.url !== undefined ? data.url.trim() : t.url,
          method: data.method !== undefined ? data.method : t.method,
          headers: data.headers !== undefined ? parseHeaders(data.headers) : t.headers,
          body: data.body !== undefined ? data.body : t.body,
          interval: data.interval !== undefined ? Math.max(1, parseInt(data.interval) || 5) : t.interval,
          timeout: data.timeout !== undefined ? Math.max(1, Math.min(120, parseInt(data.timeout) || 30)) : t.timeout,
          enabled: data.enabled !== undefined ? data.enabled : t.enabled,
          id, // preserve
        };
        await store.saveTasks(tasks);
        return jsonRes(tasks[idx]);
      }

      if (method === 'DELETE') {
        const tasks = await store.getTasks();
        const filtered = tasks.filter(t => t.id !== id);
        if (filtered.length === tasks.length) return jsonRes({ error: 'Task not found' }, 404);
        await store.saveTasks(filtered);
        await store.deleteLogs(id);
        return jsonRes({ success: true });
      }
    }

    // Toggle /tasks/:id/toggle
    const toggleMatch = path.match(/^\/tasks\/([^/]+)\/toggle$/);
    if (toggleMatch && method === 'PATCH') {
      const id = toggleMatch[1];
      const tasks = await store.getTasks();
      const idx = tasks.findIndex(t => t.id === id);
      if (idx === -1) return jsonRes({ error: 'Task not found' }, 404);
      tasks[idx].enabled = !tasks[idx].enabled;
      await store.saveTasks(tasks);
      return jsonRes(tasks[idx]);
    }

    // Manual trigger /tasks/:id/trigger
    const triggerMatch = path.match(/^\/tasks\/([^/]+)\/trigger$/);
    if (triggerMatch && method === 'POST') {
      const id = triggerMatch[1];
      const tasks = await store.getTasks();
      const task = tasks.find(t => t.id === id);
      if (!task) return jsonRes({ error: 'Task not found' }, 404);

      const result = await executeCheck(task, store);
      return jsonRes(result);
    }

    // Logs /tasks/:id/logs
    const logsMatch = path.match(/^\/tasks\/([^/]+)\/logs$/);
    if (logsMatch && method === 'GET') {
      const id = logsMatch[1];
      const logs = await store.getLogs(id);
      return jsonRes(logs);
    }

    return jsonRes({ error: 'Not found' }, 404);
  } catch (err) {
    console.error('Admin API error:', err);
    return jsonRes({ error: err.message || 'Internal error' }, 500);
  }
}

/**
 * Parse headers from various formats:
 * - Object: { "Key": "Value" }
 * - String: "Key: Value\nKey2: Value2"
 */
function parseHeaders(input) {
  if (!input) return {};
  if (typeof input === 'object' && !Array.isArray(input)) return input;
  if (typeof input === 'string') {
    const result = {};
    for (const line of input.split('\n')) {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim();
        if (key) result[key] = val;
      }
    }
    return result;
  }
  return {};
}

function jsonRes(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
