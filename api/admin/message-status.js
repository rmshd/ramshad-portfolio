const { requireAdmin } = require('../_lib/admin');
const { getSupabaseAdmin } = require('../_lib/supabase');
const { sendJson, methodNotAllowed, getBody } = require('../_lib/http');
const { cleanString } = require('../_lib/strings');

module.exports = async function handler(req, res) {
  if (!['POST', 'PATCH'].includes(req.method)) return methodNotAllowed(res, ['POST', 'PATCH']);
  if (!requireAdmin(req, res)) return;
  try {
    const body = getBody(req);
    const id = cleanString(body.id, 80);
    const status = ['new','read','replied'].includes(body.status) ? body.status : '';
    if (!id || !status) return sendJson(res, 400, { error: 'Valid id and status are required.' });
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('portfolio_messages').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
    return sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error('message status:', error);
    return sendJson(res, 500, { error: error.message || 'Unable to update enquiry.' });
  }
};
