const crypto = require('crypto');

function validAdminKey(req) {
  const configured = process.env.ADMIN_KEY || '';
  const supplied = req.headers['x-admin-key'] || '';
  if (!configured || typeof supplied !== 'string') return false;
  const a = Buffer.from(configured);
  const b = Buffer.from(supplied);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function requireAdmin(req, res) {
  if (!process.env.ADMIN_KEY) {
    res.status(503).json({ error: 'ADMIN_KEY is not configured in Vercel.' });
    return false;
  }
  if (!validAdminKey(req)) {
    res.status(401).json({ error: 'Invalid admin key.' });
    return false;
  }
  return true;
}

module.exports = { requireAdmin };
