const CACHE_TTL = 30 * 1000; // 30 seconds (shorter than AI gateway since cron updates frequently)
const MAX_LOGS = 50;

class KVStore {
  constructor(kv) {
    this.kv = kv;
    this.cache = new Map();
  }

  async get(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.time < CACHE_TTL) {
      return cached.value;
    }
    const value = await this.kv.get(key, 'json');
    this.cache.set(key, { value, time: Date.now() });
    return value;
  }

  async set(key, value) {
    await this.kv.put(key, JSON.stringify(value));
    this.cache.set(key, { value, time: Date.now() });
  }

  invalidate(key) {
    this.cache.delete(key);
  }

  // ---- Tasks ----

  async getTasks() {
    return (await this.get('config:tasks')) || [];
  }

  async saveTasks(tasks) {
    await this.set('config:tasks', tasks);
  }

  // ---- Logs (per task, last N entries) ----

  async getLogs(taskId) {
    return (await this.get(`logs:${taskId}`)) || [];
  }

  async addLog(taskId, entry) {
    // Bypass cache for logs — always read fresh
    const raw = await this.kv.get(`logs:${taskId}`, 'json');
    const logs = raw || [];
    logs.unshift(entry); // newest first
    if (logs.length > MAX_LOGS) logs.length = MAX_LOGS;
    await this.kv.put(`logs:${taskId}`, JSON.stringify(logs));
    this.cache.delete(`logs:${taskId}`);
  }

  async deleteLogs(taskId) {
    await this.kv.delete(`logs:${taskId}`);
    this.cache.delete(`logs:${taskId}`);
  }
}

export function createStore(kv) {
  return new KVStore(kv);
}
