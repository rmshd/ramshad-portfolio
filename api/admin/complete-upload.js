const { randomUUID } = require('crypto');
const { requireAdmin } = require('../_lib/admin');
const { getSupabaseAdmin, getPublicConfig } = require('../_lib/supabase');
const { sendJson, methodNotAllowed, getBody } = require('../_lib/http');
const { cleanString } = require('../_lib/strings');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  if (!requireAdmin(req, res)) return;
  try {
    const body = getBody(req);
    const title = cleanString(body.title, 150);
    const category = cleanString(body.category, 100);
    const type = body.type === 'video' ? 'video' : 'image';
    const accent = ['g', 'b', 'o'].includes(body.accent) ? body.accent : 'g';
    const storagePath = cleanString(body.storagePath, 500);
    if (!title || !category || !storagePath.startsWith(`portfolio/${type === 'video' ? 'videos' : 'images'}/`)) {
      return sendJson(res, 400, { error: 'Invalid project information.' });
    }

    const config = getPublicConfig();
    const supabase = getSupabaseAdmin();
    const { data: publicData } = supabase.storage.from(config.bucket).getPublicUrl(storagePath);
    const src = publicData.publicUrl;
    const item = {
      id: randomUUID(),
      title,
      category,
      type,
      accent,
      src,
      storage_path: storagePath
    };
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert(item)
      .select('id,title,category,type,accent,src,storage_path,created_at')
      .single();
    if (error) {
      await supabase.storage.from(config.bucket).remove([storagePath]).catch(() => {});
      throw error;
    }
    return sendJson(res, 201, {
      id: data.id,
      title: data.title,
      category: data.category,
      type: data.type,
      accent: data.accent,
      src: data.src,
      storagePath: data.storage_path,
      createdAt: data.created_at
    });
  } catch (error) {
    console.error('complete upload:', error);
    return sendJson(res, 500, { error: error.message || 'Unable to add project.' });
  }
};
