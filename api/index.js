const routes = {
  'health': require('../server/api/health'),
  'portfolio': require('../server/api/portfolio'),
  'content': require('../server/api/content'),
  'contact': require('../server/api/contact'),
  'admin/bootstrap': require('../server/api/admin/bootstrap'),
  'admin/upload-token': require('../server/api/admin/upload-token'),
  'admin/complete-upload': require('../server/api/admin/complete-upload'),
  'admin/delete-message': require('../server/api/admin/delete-message'),
  'admin/delete-portfolio': require('../server/api/admin/delete-portfolio'),
  'admin/entity': require('../server/api/admin/entity'),
  'admin/message-status': require('../server/api/admin/message-status'),
  'admin/messages': require('../server/api/admin/messages'),
  'admin/settings': require('../server/api/admin/settings')
};

function normalizePath(value) {
  const raw = Array.isArray(value) ? value.join('/') : String(value || '');
  return raw
    .split('?')[0]
    .replace(/^\/+|\/+$/g, '')
    .replace(/^api\/?/, '');
}

module.exports = async function handler(req, res) {
  const route = normalizePath(req.query?.path || req.headers['x-vercel-original-path'] || '');
  const routeHandler = routes[route];

  if (!routeHandler) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(404).json({
      error: 'API route not found.',
      route: route || null
    });
  }

  return routeHandler(req, res);
};
