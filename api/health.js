const { sendJson, methodNotAllowed } = require('./_lib/http');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  return sendJson(res, 200, {
    ok: true,
    service: 'ramshad-portfolio-vercel',
    storage: 'supabase',
    time: new Date().toISOString()
  });
};
