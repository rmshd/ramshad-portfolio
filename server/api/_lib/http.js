function setNoStore(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
}

function sendJson(res, status, body) {
  setNoStore(res);
  return res.status(status).json(body);
}

function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '));
  return sendJson(res, 405, { error: `Method not allowed. Use ${allowed.join(' or ')}.` });
}

function getBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body); } catch { return {}; }
}

module.exports = { sendJson, methodNotAllowed, getBody };
