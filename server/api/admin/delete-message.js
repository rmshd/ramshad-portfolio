const { requireAdmin } = require('../_lib/admin');
const { getSupabaseAdmin } = require('../_lib/supabase');
const { sendJson, methodNotAllowed } = require('../_lib/http');
const { cleanString } = require('../_lib/strings');

module.exports = async function handler(req, res) {
  if (req.method !== 'DELETE') return methodNotAllowed(res, ['DELETE']);
  if (!requireAdmin(req, res)) return;
  const id = cleanString(req.query.id, 80);
  if (!id) return sendJson(res, 400, { error: 'Message id is required.' });
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('portfolio_messages').delete().eq('id', id);
    if (error) throw error;
    return sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error('delete message:', error);
    return sendJson(res, 500, { error: error.message || 'Unable to delete enquiry.' });
  }
};
