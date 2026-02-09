/**
 * Execute keep-alive checks for all due tasks.
 * Called by the Cron Trigger scheduled handler.
 *
 * Uses `next_check` (pre-calculated with jitter) instead of fixed intervals,
 * so each check happens at a random time within the configured range.
 */
export async function runDueTasks(store) {
  const tasks = await store.getTasks();
  const enabled = tasks.filter(t => t.enabled);
  const now = Date.now();
  const results = [];

  const promises = enabled.map(async (task) => {
    // Use next_check if available, otherwise fall back to last_check + interval
    let due = false;
    if (task.next_check) {
      due = now >= new Date(task.next_check).getTime();
    } else {
      const lastCheck = task.last_check ? new Date(task.last_check).getTime() : 0;
      const intervalMs = (task.interval || 5) * 60 * 1000;
      due = now - lastCheck >= intervalMs;
    }

    if (due) {
      const result = await executeCheck(task, store);
      results.push(result);
    }
  });

  await Promise.allSettled(promises);
  return results;
}

/**
 * Execute a single keep-alive check and record the result.
 *
 * Features:
 * - Picks a random URL from the pool (task.urls)
 * - Calculates next_check with jitter for natural timing
 * - Records which URL was actually used
 */
export async function executeCheck(task, store) {
  const start = Date.now();
  let status = 0;
  let error = null;
  let duration = 0;

  // Pick a random URL from the pool
  const selectedUrl = pickRandomUrl(task);
  if (!selectedUrl) {
    return { taskId: task.id, name: task.name, status: 0, duration: 0, error: 'No URL configured', url: '' };
  }

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

    const resp = await fetch(selectedUrl, opts);
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
    tasks[idx].last_url = selectedUrl;
    // Calculate next check time with jitter
    tasks[idx].next_check = calcNextCheck(task.interval || 5, task.jitter ?? 20);
    if (status >= 200 && status < 400) {
      tasks[idx].success_count = (tasks[idx].success_count || 0) + 1;
    } else {
      tasks[idx].fail_count = (tasks[idx].fail_count || 0) + 1;
    }
    await store.saveTasks(tasks);
  }

  // Add log entry (includes which URL was used)
  await store.addLog(task.id, {
    time: new Date().toISOString(),
    url: selectedUrl,
    status,
    duration,
    error,
  });

  return { taskId: task.id, name: task.name, url: selectedUrl, status, duration, error };
}

// ─── Helpers ────────────────────────────────────────────────────────

/**
 * Pick a random URL from the task's URL pool.
 * Uses crypto.getRandomValues() for proper randomness (works in both dev and production).
 */
function pickRandomUrl(task) {
  const pool = task.urls?.length ? task.urls : (task.url ? [task.url] : []);
  if (pool.length === 0) return null;
  if (pool.length === 1) return pool[0];
  return pool[secureRandom(pool.length)];
}

/**
 * Calculate the next check time with random jitter.
 *
 * Example: interval=5min, jitter=30%
 *   base = 300,000ms
 *   range = [210,000ms .. 390,000ms]  (3.5min .. 6.5min)
 *   picks a random time in that range
 */
function calcNextCheck(intervalMinutes, jitterPercent = 20) {
  const baseMs = intervalMinutes * 60 * 1000;
  const jitter = Math.max(0, Math.min(50, jitterPercent)) / 100;
  const minMs = baseMs * (1 - jitter);
  const maxMs = baseMs * (1 + jitter);
  const randomMs = minMs + secureRandomFloat() * (maxMs - minMs);
  return new Date(Date.now() + randomMs).toISOString();
}

/** Cryptographically random integer in [0, max) */
function secureRandom(max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

/** Cryptographically random float in [0, 1) */
function secureRandomFloat() {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] / 4294967296; // 2^32
}
