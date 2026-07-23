const { requireAdmin } = require('../_lib/admin');
const { getSupabaseAdmin, getPublicConfig } = require('../_lib/supabase');
const { sendJson, methodNotAllowed } = require('../_lib/http');
const { cleanString } = require('../_lib/strings');

module.exports = async function handler(req, res) {
  if (req.method !== 'DELETE') return methodNotAllowed(res, ['DELETE']);
  if (!requireAdmin(req, res)) return;
  const id = cleanString(req.query.id, 80);
  if (!id) return sendJson(res, 400, { error: 'Portfolio id is required.' });
  try {
    const supabase = getSupabaseAdmin();
    const { data: item, error: readError } = await supabase
      .from('portfolio_items')
      .select('id,storage_path')
      .eq('id', id)
      .maybeSingle();
    if (readError) throw readError;
    if (!item) return sendJson(res, 404, { error: 'Portfolio item not found.' });

    const { error: deleteError } = await supabase.from('portfolio_items').delete().eq('id', id);
    if (deleteError) throw deleteError;

    if (item.storage_path) {
      const config = getPublicConfig();
      const { error: storageError } = await supabase.storage.from(config.bucket).remove([item.storage_path]);
      if (storageError) console.error('Storage cleanup warning:', storageError.message);
    }
    return sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error('delete portfolio:', error);
    return sendJson(res, 500, { error: error.message || 'Unable to delete project.' });
  }
};
