const { requireAdmin } = require('../_lib/admin');
const { getSupabaseAdmin } = require('../_lib/supabase');
const { sendJson, methodNotAllowed } = require('../_lib/http');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  if (!requireAdmin(req, res)) return;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('portfolio_messages')
      .select('id,name,contact,service,project_type,message,created_at')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) throw error;
    return sendJson(res, 200, (data || []).map(item => ({
      id: item.id,
      name: item.name,
      contact: item.contact,
      service: item.service,
      projectType: item.project_type,
      message: item.message,
      createdAt: item.created_at
    })));
  } catch (error) {
    console.error('admin messages:', error);
    return sendJson(res, 500, { error: error.message || 'Unable to load enquiries.' });
  }
};
