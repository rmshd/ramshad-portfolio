const { getSupabaseAdmin } = require('./_lib/supabase');
const { sendJson, methodNotAllowed } = require('./_lib/http');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('id,title,category,type,accent,src,storage_path,description,project_date,external_url,thumbnail_url,thumbnail_storage_path,featured,visible,status,sort_order,created_at,updated_at')
      .eq('visible', true)
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('sort_order', { ascending: true })
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
      description: item.description,
      projectDate: item.project_date,
      externalUrl: item.external_url,
      thumbnailUrl: item.thumbnail_url,
      thumbnailStoragePath: item.thumbnail_storage_path,
      featured: item.featured,
      visible: item.visible,
      status: item.status,
      sortOrder: item.sort_order,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
    return sendJson(res, 200, items);
  } catch (error) {
    console.error('portfolio:', error);
    return sendJson(res, 500, { error: error.message || 'Unable to load portfolio.' });
  }
};
