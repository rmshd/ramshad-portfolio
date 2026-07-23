const { getSupabaseAdmin } = require('./_lib/supabase');
const { sendJson, methodNotAllowed } = require('./_lib/http');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('id,title,category,type,accent,src,storage_path,created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    const items = (data || []).map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      type: item.type,
      accent: item.accent,
      src: item.src,
      storagePath: item.storage_path,
      createdAt: item.created_at
    }));
    return sendJson(res, 200, items);
  } catch (error) {
    console.error('portfolio:', error);
    return sendJson(res, 500, { error: error.message || 'Unable to load portfolio.' });
  }
};
