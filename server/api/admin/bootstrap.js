const { requireAdmin } = require('../_lib/admin');
const { getSupabaseAdmin } = require('../_lib/supabase');
const { sendJson, methodNotAllowed } = require('../_lib/http');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  if (!requireAdmin(req, res)) return;
  try {
    const supabase = getSupabaseAdmin();
    const queries = {
      settings: supabase.from('site_settings').select('content,updated_at').eq('id', 'main').maybeSingle(),
      categories: supabase.from('portfolio_categories').select('*').order('sort_order'),
      portfolio: supabase.from('portfolio_items').select('*').order('featured', { ascending: false }).order('sort_order').order('created_at', { ascending: false }),
      services: supabase.from('services').select('*').order('sort_order'),
      skills: supabase.from('skills').select('*').order('sort_order'),
      tools: supabase.from('tools').select('*').order('sort_order'),
      timeline: supabase.from('timeline_items').select('*').order('sort_order'),
      socials: supabase.from('social_links').select('*').order('sort_order'),
      messages: supabase.from('portfolio_messages').select('id,name,contact,service,project_type,message,status,created_at,updated_at').order('created_at', { ascending: false }).limit(500)
    };
    const keys = Object.keys(queries);
    const results = await Promise.all(keys.map(key => queries[key]));
    const payload = {};
    results.forEach((result, index) => {
      if (result.error) throw result.error;
      const key = keys[index];
      payload[key] = key === 'settings' ? (result.data?.content || {}) : (result.data || []);
    });
    return sendJson(res, 200, payload);
  } catch (error) {
    console.error('admin bootstrap:', error);
    return sendJson(res, 500, { error: error.message || 'Unable to load admin data.' });
  }
};
