async function hmacSign(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

async function hmacVerify(message, signature, secret) {
  const expected = await hmacSign(message, secret);
  return expected === signature;
}

export async function createToken(password) {
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  const payload = JSON.stringify({ expires });
  const sig = await hmacSign(payload, password);
  return btoa(payload) + '.' + sig;
}

export async function verifyToken(token, password) {
  try {
    const [payloadB64, sig] = token.split('.');
    if (!payloadB64 || !sig) return false;
    const payload = atob(payloadB64);
    const valid = await hmacVerify(payload, sig, password);
    if (!valid) return false;
    const { expires } = JSON.parse(payload);
    return Date.now() < expires;
  } catch {
    return false;
  }
}

export async function handleLogin(request, env) {
  try {
    const { password } = await request.json();
    if (!password) return jsonRes({ error: 'Password required' }, 400);

    const adminPwd = env.ADMIN_PASSWORD;
    if (!adminPwd) return jsonRes({ error: 'ADMIN_PASSWORD not configured' }, 500);
    if (password !== adminPwd) return jsonRes({ error: 'Invalid password' }, 401);

    const token = await createToken(adminPwd);
    return jsonRes({ token });
  } catch {
    return jsonRes({ error: 'Invalid request' }, 400);
  }
}

export async function requireAuth(request, env) {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return false;
  const token = auth.slice(7);
  if (!env.ADMIN_PASSWORD) return false;
  return verifyToken(token, env.ADMIN_PASSWORD);
}

function jsonRes(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
