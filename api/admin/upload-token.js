const { randomUUID } = require('crypto');
const { requireAdmin } = require('../_lib/admin');
const { getSupabaseAdmin, getPublicConfig } = require('../_lib/supabase');
const { sendJson, methodNotAllowed, getBody } = require('../_lib/http');
const { cleanString, safeFileName, isAllowedMime } = require('../_lib/strings');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  if (!requireAdmin(req, res)) return;
  try {
    const body = getBody(req);
    const fileName = safeFileName(body.fileName);
    const mimeType = cleanString(body.mimeType, 120).toLowerCase();
    const fileSize = Number(body.fileSize) || 0;
    if (!isAllowedMime(mimeType)) {
      return sendJson(res, 400, { error: 'Only image and video files are allowed.' });
    }
    if (fileSize <= 0 || fileSize > 250 * 1024 * 1024) {
      return sendJson(res, 400, { error: 'File must be between 1 byte and 250 MB.' });
    }

    const type = mimeType.startsWith('video/') ? 'videos' : 'images';
    const path = `portfolio/${type}/${Date.now()}-${randomUUID()}-${fileName}`;
    const config = getPublicConfig();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage
      .from(config.bucket)
      .createSignedUploadUrl(path, { upsert: false });
    if (error) throw error;

    return sendJson(res, 200, {
      path,
      token: data.token,
      bucket: config.bucket,
      supabaseUrl: config.supabaseUrl,
      supabaseAnonKey: config.supabaseAnonKey
    });
  } catch (error) {
    console.error('upload token:', error);
    return sendJson(res, 500, { error: error.message || 'Unable to prepare upload.' });
  }
};
