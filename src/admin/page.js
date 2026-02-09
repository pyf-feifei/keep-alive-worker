export function getAdminPage() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Keep Alive</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg-0:#09090b;--bg-1:#0f0f13;--bg-2:#18181b;--bg-3:#27272a;
  --bg-hover:#1f1f25;--text-0:#fafafa;--text-1:#a1a1aa;--text-2:#71717a;
  --border:#27272a;--primary:#14b8a6;--primary-hover:#2dd4bf;
  --success:#22c55e;--danger:#ef4444;--danger-hover:#dc2626;--warning:#f59e0b;
  --radius:8px;
}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg-0);color:var(--text-0);min-height:100vh}
a{color:inherit;text-decoration:none}
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--bg-3);border-radius:3px}

.login-view{display:flex;align-items:center;justify-content:center;min-height:100vh}
.login-card{background:var(--bg-2);border:1px solid var(--border);border-radius:16px;padding:48px;width:420px;text-align:center}
.login-logo{font-size:32px;font-weight:700;background:linear-gradient(135deg,#14b8a6,#5eead4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.login-sub{color:var(--text-2);margin-bottom:28px;font-size:14px}
.login-card input{margin-bottom:16px}

.main-view{display:flex;min-height:100vh}
.sidebar{width:260px;background:var(--bg-1);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;height:100vh;z-index:10}
.sidebar-header{padding:24px 20px;border-bottom:1px solid var(--border)}
.sidebar-header .logo{font-size:20px;font-weight:700;background:linear-gradient(135deg,#14b8a6,#5eead4);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sidebar-nav{flex:1;padding:12px}
.nav-item{display:block;padding:10px 16px;color:var(--text-1);border-radius:var(--radius);margin-bottom:4px;cursor:pointer;transition:all .15s;font-size:14px;font-weight:500}
.nav-item:hover{background:var(--bg-hover);color:var(--text-0)}
.nav-item.active{background:var(--primary);color:#fff}
.sidebar-footer{padding:16px;border-top:1px solid var(--border)}
.content{flex:1;margin-left:260px;padding:32px;max-width:1400px}

.section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
.section-header h2{font-size:24px;font-weight:600}

.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:28px}
.stat-card{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:24px}
.stat-card .label{color:var(--text-2);font-size:13px;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px}
.stat-card .value{font-size:36px;font-weight:700}

.table-container{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);overflow-x:auto}
table{width:100%;border-collapse:collapse;min-width:900px}
th{text-align:left;padding:12px 16px;background:var(--bg-3);font-size:12px;color:var(--text-2);font-weight:600;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}
td{padding:12px 16px;border-top:1px solid var(--border);font-size:14px;vertical-align:middle}
tr:hover td{background:var(--bg-hover)}
.cell-truncate{max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.badge{display:inline-block;padding:3px 10px;border-radius:9999px;font-size:12px;font-weight:500}
.badge-on{background:rgba(34,197,94,.12);color:var(--success)}
.badge-off{background:rgba(239,68,68,.12);color:var(--danger)}
.badge-method{background:rgba(20,184,166,.12);color:var(--primary);font-family:monospace;font-weight:600}
.badge-status-ok{background:rgba(34,197,94,.12);color:var(--success)}
.badge-status-err{background:rgba(239,68,68,.12);color:var(--danger)}
.badge-status-warn{background:rgba(245,158,11,.12);color:var(--warning)}
.badge-status-none{background:rgba(113,113,122,.12);color:var(--text-2)}

.dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px;vertical-align:middle}
.dot-ok{background:var(--success)}
.dot-err{background:var(--danger)}
.dot-none{background:var(--text-2)}

.btn{padding:8px 16px;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:500;transition:all .15s;display:inline-flex;align-items:center;gap:6px;line-height:1.4}
.btn:active{transform:scale(.97)}
.btn-primary{background:var(--primary);color:#fff}
.btn-primary:hover{background:var(--primary-hover)}
.btn-danger{background:transparent;color:var(--danger);border:1px solid rgba(239,68,68,.3)}
.btn-danger:hover{background:var(--danger);color:#fff}
.btn-ghost{background:transparent;color:var(--text-1);border:1px solid var(--border)}
.btn-ghost:hover{background:var(--bg-hover);color:var(--text-0)}
.btn-sm{padding:5px 10px;font-size:12px}
.btn-full{width:100%;justify-content:center}

input,textarea,select{width:100%;padding:10px 14px;background:var(--bg-0);border:1px solid var(--border);border-radius:6px;color:var(--text-0);font-size:14px;font-family:inherit;outline:none;transition:border-color .15s}
input:focus,textarea:focus,select:focus{border-color:var(--primary)}
textarea{resize:vertical;min-height:80px;font-family:'SF Mono',SFMono-Regular,Consolas,monospace;font-size:13px}
label{display:block;margin-bottom:6px;font-size:13px;color:var(--text-1);font-weight:500}
.form-group{margin-bottom:16px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.form-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
.form-help{font-size:12px;color:var(--text-2);margin-top:4px}

.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:100;backdrop-filter:blur(2px)}
.modal{background:var(--bg-2);border:1px solid var(--border);border-radius:12px;padding:28px;width:600px;max-height:85vh;overflow-y:auto}
.modal h3{font-size:18px;margin-bottom:20px;font-weight:600}
.modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:24px}

.toast-container{position:fixed;top:20px;right:20px;z-index:200}
.toast{background:var(--bg-3);border:1px solid var(--border);border-radius:var(--radius);padding:12px 20px;margin-bottom:8px;font-size:14px;animation:slideIn .3s ease;min-width:240px}
.toast.success{border-left:3px solid var(--success)}
.toast.error{border-left:3px solid var(--danger)}
@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}

.empty{text-align:center;color:var(--text-2);padding:48px 20px;font-size:14px}

.lang-toggle{display:flex;background:var(--bg-0);border:1px solid var(--border);border-radius:6px;overflow:hidden;margin-bottom:8px}
.lang-btn{flex:1;padding:6px 0;text-align:center;font-size:12px;font-weight:500;color:var(--text-2);cursor:pointer;transition:all .15s;border:none;background:transparent}
.lang-btn:hover{color:var(--text-0)}
.lang-btn.active{background:var(--primary);color:#fff}

.log-table{width:100%;border-collapse:collapse;font-size:13px}
.log-table th{padding:8px 12px;background:var(--bg-3);text-align:left;font-size:11px;color:var(--text-2)}
.log-table td{padding:8px 12px;border-top:1px solid var(--border)}
</style>
</head>
<body>
<div id="app">

<!-- Login -->
<div id="login-view" class="login-view">
  <div class="login-card">
    <div class="login-logo">Keep Alive</div>
    <p class="login-sub" id="login-sub"></p>
    <input type="password" id="login-pwd" autofocus>
    <button class="btn btn-primary btn-full" onclick="doLogin()" id="login-btn"></button>
    <div style="margin-top:16px">
      <div class="lang-toggle" id="login-lang-toggle">
        <button class="lang-btn" onclick="setLang('en')">English</button>
        <button class="lang-btn" onclick="setLang('zh')">中文</button>
      </div>
    </div>
  </div>
</div>

<!-- Main -->
<div id="main-view" class="main-view" style="display:none">
  <aside class="sidebar">
    <div class="sidebar-header"><div class="logo">Keep Alive</div></div>
    <nav class="sidebar-nav" id="sidebar-nav">
      <a class="nav-item active" data-section="dashboard" onclick="navigate('dashboard')"></a>
      <a class="nav-item" data-section="tasks" onclick="navigate('tasks')"></a>
    </nav>
    <div class="sidebar-footer">
      <div class="lang-toggle" id="sidebar-lang-toggle" style="margin-bottom:8px">
        <button class="lang-btn" onclick="setLang('en')">EN</button>
        <button class="lang-btn" onclick="setLang('zh')">中文</button>
      </div>
      <button class="btn btn-ghost btn-full" onclick="doLogout()" id="logout-btn"></button>
    </div>
  </aside>

  <main class="content">
    <!-- Dashboard -->
    <section id="section-dashboard" class="section">
      <div class="section-header"><h2 id="dash-title"></h2></div>
      <div class="stats-grid">
        <div class="stat-card"><div class="label" id="lbl-total"></div><div class="value" id="s-total">0</div></div>
        <div class="stat-card"><div class="label" id="lbl-active"></div><div class="value" id="s-active">0</div></div>
        <div class="stat-card"><div class="label" id="lbl-checks"></div><div class="value" id="s-checks">0</div></div>
        <div class="stat-card"><div class="label" id="lbl-rate"></div><div class="value" id="s-rate">-</div></div>
      </div>
      <div class="section-header"><h2 style="font-size:18px" id="recent-title"></h2></div>
      <div class="table-container">
        <table>
          <thead><tr id="recent-thead"></tr></thead>
          <tbody id="recent-tbody"></tbody>
        </table>
      </div>
    </section>

    <!-- Tasks -->
    <section id="section-tasks" class="section" style="display:none">
      <div class="section-header">
        <h2 id="tasks-title"></h2>
        <button class="btn btn-primary" onclick="showTaskModal()" id="tasks-add-btn"></button>
      </div>
      <div class="table-container">
        <table>
          <thead><tr id="tasks-thead"></tr></thead>
          <tbody id="tasks-tbody"></tbody>
        </table>
      </div>
    </section>
  </main>
</div>

<!-- Modal -->
<div id="modal-overlay" class="modal-overlay" style="display:none">
  <div class="modal" id="modal-box"></div>
</div>
<div id="toast-container" class="toast-container"></div>

</div>
<script>
// ============ i18n ============
const I18N = {
  en: {
    loginSub:'Enter admin password',loginPlaceholder:'Password',signIn:'Sign In',signOut:'Sign Out',
    dashboard:'Dashboard',tasks:'Tasks',
    totalTasks:'Total Tasks',activeTasks:'Active',totalChecks:'Total Checks',successRate:'Success Rate',
    recentActivity:'Recent Activity',
    rTime:'Time',rTask:'Task',rUrl:'URL',rStatus:'Status',rDuration:'Duration',
    addTask:'Add Task',editTask:'Edit Task',
    name:'Name',url:'URL',method:'Method',headers:'Headers',body:'Body',
    interval:'Interval',timeout:'Timeout',status:'Status',lastCheck:'Last Check',
    uptime:'Uptime',actions:'Actions',
    namePlaceholder:'e.g. HF Space',urlPlaceholder:'https://your-app.hf.space/',
    headersHelp:'One per line: Key: Value',headersPlaceholder:'Content-Type: application/json',
    bodyPlaceholder:'Request body (JSON, etc.)',
    intervalHelp:'Minutes between checks (min 1)',timeoutHelp:'Seconds (max 120)',
    on:'On',off:'Off',edit:'Edit',disable:'Disable',enable:'Enable',
    delete:'Delete',trigger:'Trigger',logs:'Logs',
    noTasks:'No tasks yet. Click "Add Task" to get started.',
    cancel:'Cancel',save:'Save',
    confirmDelete:'Confirm Delete',confirmDeleteMsg:'Delete <strong>{name}</strong>? This cannot be undone.',
    deleted:'Deleted',taskUpdated:'Task updated',taskCreated:'Task created',
    urlRequired:'URL is required',saveFailed:'Save failed',failed:'Failed',
    triggerOk:'Check completed',triggerFail:'Check failed',
    logsTitle:'Check Logs',noLogs:'No logs yet.',
    neverChecked:'Never',ago:'{n} ago',justNow:'Just now',
    enterPwd:'Please enter password',loginFailed:'Login failed',
    sessionExpired:'Session expired',networkError:'Network error',
    min:'min',sec:'s',ms:'ms',
  },
  zh: {
    loginSub:'请输入管理员密码',loginPlaceholder:'密码',signIn:'登录',signOut:'退出登录',
    dashboard:'仪表盘',tasks:'任务管理',
    totalTasks:'任务总数',activeTasks:'活跃任务',totalChecks:'检查总数',successRate:'成功率',
    recentActivity:'最近活动',
    rTime:'时间',rTask:'任务',rUrl:'URL',rStatus:'状态',rDuration:'耗时',
    addTask:'添加任务',editTask:'编辑任务',
    name:'名称',url:'URL',method:'请求方式',headers:'请求头',body:'请求体',
    interval:'间隔',timeout:'超时',status:'状态',lastCheck:'最后检查',
    uptime:'成功率',actions:'操作',
    namePlaceholder:'例如 HF Space',urlPlaceholder:'https://your-app.hf.space/',
    headersHelp:'每行一个: Key: Value',headersPlaceholder:'Content-Type: application/json',
    bodyPlaceholder:'请求体 (JSON 等)',
    intervalHelp:'检查间隔，单位分钟 (最小 1)',timeoutHelp:'超时秒数 (最大 120)',
    on:'启用',off:'停用',edit:'编辑',disable:'禁用',enable:'启用',
    delete:'删除',trigger:'触发',logs:'日志',
    noTasks:'暂无任务，点击「添加任务」开始。',
    cancel:'取消',save:'保存',
    confirmDelete:'确认删除',confirmDeleteMsg:'确定删除 <strong>{name}</strong>？此操作不可撤销。',
    deleted:'已删除',taskUpdated:'任务已更新',taskCreated:'任务已创建',
    urlRequired:'URL 不能为空',saveFailed:'保存失败',failed:'操作失败',
    triggerOk:'检查完成',triggerFail:'检查失败',
    logsTitle:'检查日志',noLogs:'暂无日志。',
    neverChecked:'从未检查',ago:'{n}前',justNow:'刚刚',
    enterPwd:'请输入密码',loginFailed:'登录失败',
    sessionExpired:'会话已过期',networkError:'网络错误',
    min:'分钟',sec:'秒',ms:'ms',
  },
};

let lang = localStorage.getItem('ka_lang') || (navigator.language.startsWith('zh') ? 'zh' : 'en');
function t(k) { return I18N[lang]?.[k] || I18N.en[k] || k; }
function setLang(l) { lang = l; localStorage.setItem('ka_lang', l); renderAll(); }
function renderAll() { renderLogin(); renderSidebar(); render(); }

// ============ State ============
let token = localStorage.getItem('ka_token');
let tasks = [];
let curSection = 'dashboard';

// ============ API ============
async function api(path, opts = {}) {
  try {
    const res = await fetch('/admin/api' + path, {
      ...opts,
      headers: { 'Content-Type':'application/json', 'Authorization':'Bearer '+token, ...(opts.headers||{}) },
    });
    if (res.status === 401) { doLogout(); toast(t('sessionExpired'),'error'); return null; }
    return await res.json();
  } catch(e) { toast(t('networkError')+': '+e.message,'error'); return null; }
}
async function loadData() { tasks = (await api('/tasks')) || []; }

// ============ Auth ============
async function doLogin() {
  const pwd = document.getElementById('login-pwd').value;
  if (!pwd) { toast(t('enterPwd'),'error'); return; }
  try {
    const res = await fetch('/admin/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({password:pwd}) });
    const data = await res.json();
    if (res.ok && data.token) { token=data.token; localStorage.setItem('ka_token',token); showMain(); await loadData(); render(); }
    else toast(data.error||t('loginFailed'),'error');
  } catch(e) { toast(t('networkError'),'error'); }
}
function doLogout() { token=null; localStorage.removeItem('ka_token'); showLogin(); }

// ============ Views ============
function showLogin() { document.getElementById('login-view').style.display='flex'; document.getElementById('main-view').style.display='none'; renderLogin(); }
function showMain() { document.getElementById('login-view').style.display='none'; document.getElementById('main-view').style.display='flex'; renderSidebar(); }
function renderLogin() {
  document.getElementById('login-sub').textContent=t('loginSub');
  document.getElementById('login-pwd').placeholder=t('loginPlaceholder');
  document.getElementById('login-btn').textContent=t('signIn');
  document.querySelectorAll('#login-lang-toggle .lang-btn').forEach(b => b.classList.toggle('active',(b.textContent==='English'&&lang==='en')||(b.textContent==='中文'&&lang==='zh')));
}
function renderSidebar() {
  const map = {dashboard:'dashboard',tasks:'tasks'};
  document.querySelectorAll('#sidebar-nav .nav-item').forEach(el => { el.textContent=t(map[el.dataset.section]); el.classList.toggle('active',el.dataset.section===curSection); });
  document.getElementById('logout-btn').textContent=t('signOut');
  document.querySelectorAll('#sidebar-lang-toggle .lang-btn').forEach(b => b.classList.toggle('active',(b.textContent==='EN'&&lang==='en')||(b.textContent==='中文'&&lang==='zh')));
}
function navigate(s) {
  curSection=s;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active',el.dataset.section===s));
  document.querySelectorAll('.section').forEach(el => el.style.display=el.id==='section-'+s?'block':'none');
  render();
}
function render() { renderDashboard(); renderTasksSection(); }

// ============ Dashboard ============
function renderDashboard() {
  document.getElementById('dash-title').textContent=t('dashboard');
  document.getElementById('lbl-total').textContent=t('totalTasks');
  document.getElementById('lbl-active').textContent=t('activeTasks');
  document.getElementById('lbl-checks').textContent=t('totalChecks');
  document.getElementById('lbl-rate').textContent=t('successRate');
  const active = tasks.filter(t=>t.enabled).length;
  const totalChecks = tasks.reduce((s,t)=>(s+(t.success_count||0)+(t.fail_count||0)),0);
  const totalSuccess = tasks.reduce((s,t)=>(s+(t.success_count||0)),0);
  const rate = totalChecks > 0 ? ((totalSuccess/totalChecks)*100).toFixed(1)+'%' : '-';
  document.getElementById('s-total').textContent=tasks.length;
  document.getElementById('s-active').textContent=active;
  document.getElementById('s-checks').textContent=totalChecks;
  document.getElementById('s-rate').textContent=rate;

  // Recent activity
  document.getElementById('recent-title').textContent=t('recentActivity');
  document.getElementById('recent-thead').innerHTML='<th>'+[t('rTask'),t('rUrl'),t('method'),t('interval'),t('lastCheck'),t('rStatus'),t('rDuration')].join('</th><th>')+'</th>';
  const sorted = [...tasks].filter(t=>t.last_check).sort((a,b)=>new Date(b.last_check)-new Date(a.last_check));
  const tb = document.getElementById('recent-tbody');
  if (!sorted.length) { tb.innerHTML='<tr><td colspan="7" class="empty">'+t('noTasks')+'</td></tr>'; return; }
  tb.innerHTML = sorted.slice(0,10).map(tk => \`
    <tr>
      <td><span class="dot \${statusDot(tk)}"></span>\${esc(tk.name)}</td>
      <td class="cell-truncate" title="\${esc(tk.url)}">\${esc(tk.url)}</td>
      <td><span class="badge badge-method">\${tk.method||'GET'}</span></td>
      <td>\${tk.interval} \${t('min')}</td>
      <td>\${timeAgo(tk.last_check)}</td>
      <td>\${statusBadge(tk.last_status, tk.last_error)}</td>
      <td>\${tk.last_duration != null ? tk.last_duration + t('ms') : '-'}</td>
    </tr>
  \`).join('');
}

// ============ Tasks ============
function renderTasksSection() {
  document.getElementById('tasks-title').textContent=t('tasks');
  document.getElementById('tasks-add-btn').textContent=t('addTask');
  document.getElementById('tasks-thead').innerHTML='<th>'+[t('status'),t('name'),t('url'),t('method'),t('interval'),t('lastCheck'),t('rStatus'),t('uptime'),t('actions')].join('</th><th>')+'</th>';
  const tb = document.getElementById('tasks-tbody');
  if (!tasks.length) { tb.innerHTML='<tr><td colspan="9" class="empty">'+t('noTasks')+'</td></tr>'; return; }
  tb.innerHTML = tasks.map(tk => {
    const total = (tk.success_count||0)+(tk.fail_count||0);
    const uptime = total > 0 ? ((tk.success_count||0)/total*100).toFixed(1)+'%' : '-';
    return \`<tr>
      <td><span class="badge \${tk.enabled?'badge-on':'badge-off'}">\${tk.enabled?t('on'):t('off')}</span></td>
      <td><span class="dot \${statusDot(tk)}"></span><strong>\${esc(tk.name)}</strong></td>
      <td class="cell-truncate" title="\${esc(tk.url)}">\${esc(tk.url)}</td>
      <td><span class="badge badge-method">\${tk.method||'GET'}</span></td>
      <td>\${tk.interval} \${t('min')}</td>
      <td>\${tk.last_check ? timeAgo(tk.last_check) : t('neverChecked')}</td>
      <td>\${statusBadge(tk.last_status, tk.last_error)}</td>
      <td>\${uptime}</td>
      <td style="white-space:nowrap">
        <button class="btn btn-sm btn-ghost" onclick="showTaskModal('\${tk.id}')">\${t('edit')}</button>
        <button class="btn btn-sm btn-ghost" onclick="doTrigger('\${tk.id}')">\${t('trigger')}</button>
        <button class="btn btn-sm btn-ghost" onclick="showLogs('\${tk.id}','\${esc(tk.name)}')">\${t('logs')}</button>
        <button class="btn btn-sm btn-ghost" onclick="toggleTask('\${tk.id}')">\${tk.enabled?t('disable'):t('enable')}</button>
        <button class="btn btn-sm btn-danger" onclick="confirmDel('\${tk.id}','\${esc(tk.name)}')">\${t('delete')}</button>
      </td>
    </tr>\`;
  }).join('');
}

// ============ Task Modal ============
function showTaskModal(id) {
  const tk = id ? tasks.find(t=>t.id===id) : null;
  const title = tk ? t('editTask') : t('addTask');
  const hdrStr = tk && tk.headers ? Object.entries(tk.headers).map(([k,v])=>k+': '+v).join('\\n') : '';
  const showBody = (v) => { document.getElementById('f-body-group').style.display=['POST','PUT','PATCH'].includes(v)?'block':'none'; };
  openModal(\`
    <h3>\${title}</h3>
    <div class="form-group"><label>\${t('name')}</label><input id="f-name" value="\${tk?esc(tk.name):''}" placeholder="\${t('namePlaceholder')}"></div>
    <div class="form-group"><label>\${t('url')}</label><input id="f-url" value="\${tk?esc(tk.url):''}" placeholder="\${t('urlPlaceholder')}"></div>
    <div class="form-row-3">
      <div class="form-group"><label>\${t('method')}</label>
        <select id="f-method" onchange="document.getElementById('f-body-group').style.display=['POST','PUT','PATCH'].includes(this.value)?'block':'none'">
          \${['GET','POST','PUT','PATCH','DELETE','HEAD'].map(m=>'<option'+(tk&&tk.method===m?' selected':(!tk&&m==='GET'?' selected':''))+'>'+m+'</option>').join('')}
        </select>
      </div>
      <div class="form-group"><label>\${t('interval')} (\${t('min')})</label><input type="number" id="f-interval" value="\${tk?tk.interval:5}" min="1"><div class="form-help">\${t('intervalHelp')}</div></div>
      <div class="form-group"><label>\${t('timeout')} (\${t('sec')})</label><input type="number" id="f-timeout" value="\${tk?tk.timeout:30}" min="1" max="120"><div class="form-help">\${t('timeoutHelp')}</div></div>
    </div>
    <div class="form-group"><label>\${t('headers')}</label><textarea id="f-headers" placeholder="\${t('headersPlaceholder')}" style="min-height:60px">\${hdrStr}</textarea><div class="form-help">\${t('headersHelp')}</div></div>
    <div class="form-group" id="f-body-group" style="display:\${tk&&['POST','PUT','PATCH'].includes(tk.method)?'block':'none'}"><label>\${t('body')}</label><textarea id="f-body" placeholder="\${t('bodyPlaceholder')}">\${tk?esc(tk.body||''):''}</textarea></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">\${t('cancel')}</button>
      <button class="btn btn-primary" onclick="saveTask('\${id||''}')">\${t('save')}</button>
    </div>
  \`);
}

async function saveTask(id) {
  const url = document.getElementById('f-url').value.trim();
  if (!url) { toast(t('urlRequired'),'error'); return; }
  const data = {
    name: document.getElementById('f-name').value.trim(),
    url,
    method: document.getElementById('f-method').value,
    headers: document.getElementById('f-headers').value,
    body: document.getElementById('f-body')?.value || '',
    interval: parseInt(document.getElementById('f-interval').value) || 5,
    timeout: parseInt(document.getElementById('f-timeout').value) || 30,
  };
  const r = id
    ? await api('/tasks/'+id, {method:'PUT', body:JSON.stringify(data)})
    : await api('/tasks', {method:'POST', body:JSON.stringify(data)});
  if (r && !r.error) { toast(id?t('taskUpdated'):t('taskCreated'),'success'); closeModal(); await loadData(); render(); }
  else toast(r?.error||t('saveFailed'),'error');
}

async function toggleTask(id) {
  const r = await api('/tasks/'+id+'/toggle',{method:'PATCH'});
  if (r&&!r.error) { await loadData(); render(); }
}

async function doTrigger(id) {
  toast('Checking...','');
  const r = await api('/tasks/'+id+'/trigger',{method:'POST'});
  if (r) {
    if (r.status >= 200 && r.status < 400) toast(t('triggerOk')+' ('+r.status+', '+r.duration+t('ms')+')','success');
    else toast(t('triggerFail')+': '+(r.error||'HTTP '+r.status),'error');
    await loadData(); render();
  }
}

async function showLogs(id, name) {
  const logs = await api('/tasks/'+id+'/logs');
  if (!logs) return;
  let html = \`<h3>\${t('logsTitle')} - \${name}</h3>\`;
  if (!logs.length) { html += '<p class="empty">'+t('noLogs')+'</p>'; }
  else {
    html += '<div style="max-height:400px;overflow-y:auto"><table class="log-table"><thead><tr><th>'+t('rTime')+'</th><th>'+t('rStatus')+'</th><th>'+t('rDuration')+'</th><th>Error</th></tr></thead><tbody>';
    html += logs.map(l => \`<tr>
      <td>\${new Date(l.time).toLocaleString()}</td>
      <td>\${statusBadge(l.status, l.error)}</td>
      <td>\${l.duration}\${t('ms')}</td>
      <td style="color:var(--danger);font-size:12px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="\${esc(l.error||'')}">\${esc(l.error||'-')}</td>
    </tr>\`).join('');
    html += '</tbody></table></div>';
  }
  html += '<div class="modal-actions"><button class="btn btn-ghost" onclick="closeModal()">'+t('cancel')+'</button></div>';
  openModal(html);
}

function confirmDel(id, name) {
  openModal(\`
    <h3>\${t('confirmDelete')}</h3>
    <p style="color:var(--text-1);margin-bottom:24px">\${t('confirmDeleteMsg').replace('{name}',name)}</p>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">\${t('cancel')}</button>
      <button class="btn btn-danger" id="del-btn">\${t('delete')}</button>
    </div>
  \`);
  document.getElementById('del-btn').onclick = async () => { closeModal(); const r=await api('/tasks/'+id,{method:'DELETE'}); if(r&&!r.error){toast(t('deleted'),'success');await loadData();render();} };
}

// ============ Helpers ============
function statusDot(tk) {
  if (!tk.last_check) return 'dot-none';
  return (tk.last_status>=200&&tk.last_status<400)?'dot-ok':'dot-err';
}
function statusBadge(status, error) {
  if (status==null && !error) return '<span class="badge badge-status-none">-</span>';
  if (error && !status) return '<span class="badge badge-status-err">ERR</span>';
  if (status>=200&&status<300) return '<span class="badge badge-status-ok">'+status+'</span>';
  if (status>=300&&status<400) return '<span class="badge badge-status-warn">'+status+'</span>';
  return '<span class="badge badge-status-err">'+status+'</span>';
}
function timeAgo(iso) {
  if (!iso) return '-';
  const diff = Date.now()-new Date(iso).getTime();
  if (diff<60000) return t('justNow');
  if (diff<3600000) return t('ago').replace('{n}',Math.floor(diff/60000)+t('min'));
  if (diff<86400000) return t('ago').replace('{n}',Math.floor(diff/3600000)+'h');
  return t('ago').replace('{n}',Math.floor(diff/86400000)+'d');
}
function esc(s) { if(!s)return''; const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }

// ============ Modal / Toast ============
function openModal(html) { document.getElementById('modal-box').innerHTML=html; document.getElementById('modal-overlay').style.display='flex'; }
function closeModal() { document.getElementById('modal-overlay').style.display='none'; }
function toast(msg,type) { const c=document.getElementById('toast-container'); const el=document.createElement('div'); el.className='toast '+(type||''); el.textContent=msg; c.appendChild(el); setTimeout(()=>el.remove(),3500); }

// ============ Events ============
document.getElementById('modal-overlay').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal();});
document.getElementById('login-pwd').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

// ============ Init ============
(async()=>{ if(token){showMain();await loadData();render();}else{showLogin();} })();
// Auto-refresh every 30s
setInterval(async()=>{ if(token){await loadData();render();} },30000);
</script>
</body>
</html>`;
}
