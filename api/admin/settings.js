const { requireAdmin } = require('../_lib/admin');
const { getSupabaseAdmin, getPublicConfig } = require('../_lib/supabase');
const { sendJson, methodNotAllowed, getBody } = require('../_lib/http');
const { cleanString, cleanUrl, cleanArray } = require('../_lib/strings');

function cleanMiniCards(items) {
  return (Array.isArray(items) ? items : []).slice(0, 3).map(item => ({
    icon: cleanString(item?.icon, 100) || 'fa-solid fa-star',
    value: cleanString(item?.value, 60),
    label: cleanString(item?.label, 80)
  }));
}
function cleanStats(items) {
  return (Array.isArray(items) ? items : []).slice(0, 3).map(item => ({
    value: cleanString(item?.value, 30),
    label: cleanString(item?.label, 80),
    accent: ['g','b','o'].includes(item?.accent) ? item.accent : 'g'
  }));
}
function cleanContent(raw) {
  return {
    site: {
      logoUrl: cleanUrl(raw?.site?.logoUrl) || '/assets/images/branding/ramshad-portfolio.png',
      navCta: cleanString(raw?.site?.navCta, 40) || 'Hire Me'
    },
    hero: {
      eyebrow: cleanString(raw?.hero?.eyebrow, 120),
      greeting: cleanString(raw?.hero?.greeting, 60),
      name: cleanString(raw?.hero?.name, 80),
      roles: cleanArray(raw?.hero?.roles, 10, 80),
      description: cleanString(raw?.hero?.description, 1200),
      profileUrl: cleanUrl(raw?.hero?.profileUrl) || '/assets/images/profile/profile.png',
      profileStoragePath: cleanString(raw?.hero?.profileStoragePath, 500),
      profileName: cleanString(raw?.hero?.profileName, 100),
      profilePlace: cleanString(raw?.hero?.profilePlace, 100),
      miniCards: cleanMiniCards(raw?.hero?.miniCards)
    },
    about: {
      headingHtml: cleanString(raw?.about?.headingHtml, 1000),
      bio1: cleanString(raw?.about?.bio1, 2500),
      bio2: cleanString(raw?.about?.bio2, 2500),
      stats: cleanStats(raw?.about?.stats)
    },
    contact: {
      heading: cleanString(raw?.contact?.heading, 120),
      description: cleanString(raw?.contact?.description, 1000),
      whatsappNumber: cleanString(raw?.contact?.whatsappNumber, 30).replace(/[^0-9]/g, ''),
      email: cleanString(raw?.contact?.email, 150),
      formNote: cleanString(raw?.contact?.formNote, 300)
    },
    footer: { copy: cleanString(raw?.footer?.copy, 300) }
  };
}

module.exports = async function handler(req, res) {
  if (!['PUT', 'POST'].includes(req.method)) return methodNotAllowed(res, ['PUT', 'POST']);
  if (!requireAdmin(req, res)) return;
  try {
    const body = getBody(req);
    const content = cleanContent(body.content || body);
    const supabase = getSupabaseAdmin();
    const { data: current } = await supabase.from('site_settings').select('content').eq('id', 'main').maybeSingle();
    const oldPath = current?.content?.hero?.profileStoragePath || '';
    const { error } = await supabase.from('site_settings').upsert({ id: 'main', content, updated_at: new Date().toISOString() });
    if (error) throw error;
    const newPath = content.hero.profileStoragePath || '';
    if (oldPath && newPath && oldPath !== newPath) {
      const config = getPublicConfig();
      await supabase.storage.from(config.bucket).remove([oldPath]).catch(() => {});
    }
    return sendJson(res, 200, { ok: true, content });
  } catch (error) {
    console.error('settings:', error);
    return sendJson(res, 500, { error: error.message || 'Unable to save site settings.' });
  }
};
