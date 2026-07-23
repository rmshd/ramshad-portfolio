const { randomUUID } = require('crypto');
const { getSupabaseAdmin } = require('./_lib/supabase');
const { sendJson, methodNotAllowed, getBody } = require('./_lib/http');
const { cleanString } = require('./_lib/strings');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  try {
    const body = getBody(req);
    if (cleanString(body.website, 100)) return sendJson(res, 200, { ok: true });
    const name = cleanString(body.name, 100);
    const contact = cleanString(body.contact, 150);
    const service = cleanString(body.service, 100);
    const projectType = cleanString(body.projectType, 100);
    const message = cleanString(body.message, 2000);
    if (!name || !service || !message) return sendJson(res, 400, { error: 'Name, service and message are required.' });
    const forwarded = cleanString(req.headers['x-forwarded-for'], 250);
    const ip = forwarded.split(',')[0].trim() || cleanString(req.socket?.remoteAddress, 100);
    const entry = {
      id: randomUUID(), name, contact, service, project_type: projectType,
      message, ip: ip || null, status: 'new', updated_at: new Date().toISOString()
    };
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('portfolio_messages').insert(entry);
    if (error) throw error;
    return sendJson(res, 201, { ok: true, id: entry.id });
  } catch (error) {
    console.error('contact:', error);
    return sendJson(res, 500, { error: error.message || 'Unable to save enquiry.' });
  }
};
