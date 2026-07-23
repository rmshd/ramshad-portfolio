const { randomUUID } = require('crypto');
const { requireAdmin } = require('../_lib/admin');
const { getSupabaseAdmin, getPublicConfig } = require('../_lib/supabase');
const { sendJson, methodNotAllowed, getBody } = require('../_lib/http');
const { cleanString, cleanBoolean, cleanInt, cleanArray, cleanUrl } = require('../_lib/strings');

const TABLES = {
  categories: 'portfolio_categories',
  portfolio: 'portfolio_items',
  services: 'services',
  skills: 'skills',
  tools: 'tools',
  timeline: 'timeline_items',
  socials: 'social_links'
};

function accent(v) { return ['g','b','o'].includes(v) ? v : 'g'; }
function common(data) {
  return {
    sort_order: cleanInt(data.sort_order ?? data.sortOrder, 0, 100000, 0),
    visible: cleanBoolean(data.visible, true),
    updated_at: new Date().toISOString()
  };
}
function cleanEntity(entity, data) {
  const base = common(data || {});
  if (entity === 'categories') return { name: cleanString(data.name, 100), ...base };
  if (entity === 'portfolio') {
    const type = data.type === 'video' ? 'video' : 'image';
    return {
      title: cleanString(data.title, 150), category: cleanString(data.category, 100), type,
      accent: accent(data.accent), src: cleanUrl(data.src), storage_path: cleanString(data.storage_path ?? data.storagePath, 500),
      description: cleanString(data.description, 3000), project_date: cleanString(data.project_date ?? data.projectDate, 20) || null,
      external_url: cleanUrl(data.external_url ?? data.externalUrl) || null,
      thumbnail_url: cleanUrl(data.thumbnail_url ?? data.thumbnailUrl) || null,
      thumbnail_storage_path: cleanString(data.thumbnail_storage_path ?? data.thumbnailStoragePath, 500) || null,
      featured: cleanBoolean(data.featured, false), status: ['published','draft'].includes(data.status) ? data.status : 'published',
      ...base
    };
  }
  if (entity === 'services') return {
    title: cleanString(data.title, 120), description: cleanString(data.description, 1500),
    icon_url: cleanUrl(data.icon_url ?? data.iconUrl) || null,
    icon_storage_path: cleanString(data.icon_storage_path ?? data.iconStoragePath, 500) || null,
    icon_class: cleanString(data.icon_class ?? data.iconClass, 120) || 'fa-solid fa-pen-nib', accent: accent(data.accent), ...base
  };
  if (entity === 'skills') return {
    title: cleanString(data.title, 120), percentage: cleanInt(data.percentage, 0, 100, 0),
    description: cleanString(data.description, 1500), icon_class: cleanString(data.icon_class ?? data.iconClass, 120) || 'fa-solid fa-star',
    accent: accent(data.accent), size_class: ['normal','big','wide'].includes(data.size_class ?? data.sizeClass) ? (data.size_class ?? data.sizeClass) : 'normal',
    short_label: cleanString(data.short_label ?? data.shortLabel, 8) || 'SK', chips: cleanArray(data.chips, 10, 40), ...base
  };
  if (entity === 'tools') return {
    name: cleanString(data.name, 100), icon_class: cleanString(data.icon_class ?? data.iconClass, 120) || 'fa-solid fa-wand-magic-sparkles',
    accent: accent(data.accent), ...base
  };
  if (entity === 'timeline') return {
    year_label: cleanString(data.year_label ?? data.yearLabel, 30), title: cleanString(data.title, 150),
    description: cleanString(data.description, 1500), ...base
  };
  if (entity === 'socials') return {
    platform: cleanString(data.platform, 80), handle: cleanString(data.handle, 150), url: cleanUrl(data.url),
    icon_class: cleanString(data.icon_class ?? data.iconClass, 120) || 'fa-solid fa-link', accent: accent(data.accent), ...base
  };
  return null;
}
function isValid(entity, row) {
  if (!row) return false;
  if (entity === 'categories') return !!row.name;
  if (entity === 'portfolio') return !!(row.title && row.category && row.src);
  if (entity === 'services') return !!row.title;
  if (entity === 'skills') return !!row.title;
  if (entity === 'tools') return !!row.name;
  if (entity === 'timeline') return !!(row.year_label && row.title);
  if (entity === 'socials') return !!(row.platform && row.url);
  return false;
}
async function cleanupStorage(supabase, paths) {
  const valid = paths.filter(Boolean);
  if (!valid.length) return;
  const config = getPublicConfig();
  const { error } = await supabase.storage.from(config.bucket).remove(valid);
  if (error) console.error('Storage cleanup warning:', error.message);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  if (!requireAdmin(req, res)) return;
  try {
    const body = getBody(req);
    const entity = cleanString(body.entity, 30);
    const action = cleanString(body.action, 20) || 'save';
    const table = TABLES[entity];
    if (!table) return sendJson(res, 400, { error: 'Unknown entity.' });
    const supabase = getSupabaseAdmin();

    if (action === 'reorder') {
      const ids = Array.isArray(body.ids) ? body.ids.map(id => cleanString(id, 80)).filter(Boolean) : [];
      for (let index = 0; index < ids.length; index += 1) {
        const { error } = await supabase.from(table).update({ sort_order: (index + 1) * 10, updated_at: new Date().toISOString() }).eq('id', ids[index]);
        if (error) throw error;
      }
      return sendJson(res, 200, { ok: true });
    }

    const id = cleanString(body.id, 80);
    if (action === 'delete') {
      if (!id) return sendJson(res, 400, { error: 'ID is required.' });
      let old = null;
      if (['portfolio','services'].includes(entity)) {
        const columns = entity === 'portfolio' ? 'storage_path,thumbnail_storage_path' : 'icon_storage_path';
        const result = await supabase.from(table).select(columns).eq('id', id).maybeSingle();
        if (result.error) throw result.error;
        old = result.data;
      }
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      if (entity === 'portfolio' && old) await cleanupStorage(supabase, [old.storage_path, old.thumbnail_storage_path]);
      if (entity === 'services' && old) await cleanupStorage(supabase, [old.icon_storage_path]);
      return sendJson(res, 200, { ok: true });
    }

    const row = cleanEntity(entity, body.data || {});
    if (!isValid(entity, row)) return sendJson(res, 400, { error: 'Required fields are missing or invalid.' });

    let old = null;
    if (id && ['portfolio','services'].includes(entity)) {
      const columns = entity === 'portfolio' ? 'storage_path,thumbnail_storage_path' : 'icon_storage_path';
      const result = await supabase.from(table).select(columns).eq('id', id).maybeSingle();
      if (result.error) throw result.error;
      old = result.data;
    }

    let result;
    if (id) result = await supabase.from(table).update(row).eq('id', id).select('*').single();
    else result = await supabase.from(table).insert({ id: randomUUID(), ...row, created_at: new Date().toISOString() }).select('*').single();
    if (result.error) throw result.error;

    if (old && entity === 'portfolio') {
      const paths = [];
      if (old.storage_path && row.storage_path && old.storage_path !== row.storage_path) paths.push(old.storage_path);
      if (old.thumbnail_storage_path && row.thumbnail_storage_path && old.thumbnail_storage_path !== row.thumbnail_storage_path) paths.push(old.thumbnail_storage_path);
      await cleanupStorage(supabase, paths);
    }
    if (old && entity === 'services' && old.icon_storage_path && row.icon_storage_path && old.icon_storage_path !== row.icon_storage_path) {
      await cleanupStorage(supabase, [old.icon_storage_path]);
    }
    return sendJson(res, id ? 200 : 201, result.data);
  } catch (error) {
    console.error('entity:', error);
    return sendJson(res, 500, { error: error.message || 'Unable to save content.' });
  }
};
