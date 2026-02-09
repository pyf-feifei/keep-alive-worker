/**
 * Execute keep-alive checks for all due tasks.
 * Called by the Cron Trigger scheduled handler.
 */
export async function runDueTasks(store) {
  const tasks = await store.getTasks();
  const enabled = tasks.filter(t => t.enabled);
  const now = Date.now();
  const results = [];

  const promises = enabled.map(async (task) => {
    const lastCheck = task.last_check ? new Date(task.last_check).getTime() : 0;
    const intervalMs = (task.interval || 5) * 60 * 1000;

    if (now - lastCheck >= intervalMs) {
      const result = await executeCheck(task, store);
      results.push(result);
    }
  });

  await Promise.allSettled(promises);
  return results;
}

/**
 * Execute a single keep-alive check and record the result.
 */
export async function executeCheck(task, store) {
  const start = Date.now();
  let status = 0;
  let error = null;
  let duration = 0;

  try {
    const headers = new Headers();
    if (task.headers && typeof task.headers === 'object') {
      for (const [k, v] of Object.entries(task.headers)) {
        headers.set(k, v);
      }
    }

    const opts = { method: task.method || 'GET', headers };

    if (task.body && ['POST', 'PUT', 'PATCH'].includes(task.method)) {
      opts.body = task.body;
    }

    // Timeout: default 30s
    const timeoutMs = (task.timeout || 30) * 1000;
    opts.signal = AbortSignal.timeout(timeoutMs);

    const resp = await fetch(task.url, opts);
    status = resp.status;
    duration = Date.now() - start;
  } catch (err) {
    error = err.message || 'Unknown error';
    duration = Date.now() - start;
  }

  // Update task record
  const tasks = await store.getTasks();
  const idx = tasks.findIndex(t => t.id === task.id);
  if (idx !== -1) {
    tasks[idx].last_check = new Date().toISOString();
    tasks[idx].last_status = status;
    tasks[idx].last_duration = duration;
    tasks[idx].last_error = error;
    if (status >= 200 && status < 400) {
      tasks[idx].success_count = (tasks[idx].success_count || 0) + 1;
    } else {
      tasks[idx].fail_count = (tasks[idx].fail_count || 0) + 1;
    }
    await store.saveTasks(tasks);
  }

  // Add log entry
  await store.addLog(task.id, {
    time: new Date().toISOString(),
    status,
    duration,
    error,
  });

  return { taskId: task.id, name: task.name, status, duration, error };
}
