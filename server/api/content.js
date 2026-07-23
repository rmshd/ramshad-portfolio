const { getSupabaseAdmin } = require('./_lib/supabase');
const { sendJson, methodNotAllowed } = require('./_lib/http');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const supabase = getSupabaseAdmin();
    const [settingsR, categoriesR, servicesR, skillsR, toolsR, timelineR, socialsR] = await Promise.all([
      supabase.from('site_settings').select('content,updated_at').eq('id', 'main').maybeSingle(),
      supabase.from('portfolio_categories').select('*').eq('visible', true).order('sort_order'),
      supabase.from('services').select('*').eq('visible', true).order('sort_order'),
      supabase.from('skills').select('*').eq('visible', true).order('sort_order'),
      supabase.from('tools').select('*').eq('visible', true).order('sort_order'),
      supabase.from('timeline_items').select('*').eq('visible', true).order('sort_order'),
      supabase.from('social_links').select('*').eq('visible', true).order('sort_order')
    ]);
    for (const result of [settingsR, categoriesR, servicesR, skillsR, toolsR, timelineR, socialsR]) {
      if (result.error) throw result.error;
    }
    return sendJson(res, 200, {
      settings: settingsR.data?.content || {},
      categories: categoriesR.data || [],
      services: servicesR.data || [],
      skills: skillsR.data || [],
      tools: toolsR.data || [],
      timeline: timelineR.data || [],
      socials: socialsR.data || []
    });
  } catch (error) {
    console.error('content:', error);
    return sendJson(res, 500, { error: error.message || 'Unable to load site content.' });
  }
};
