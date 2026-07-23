function cleanString(value, max = 300) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function safeFileName(value) {
  const raw = cleanString(value, 180);
  const extMatch = raw.match(/(\.[a-zA-Z0-9]{1,8})$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : '';
  const base = raw.replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'media';
  return `${base}${ext}`;
}

function isAllowedMime(value) {
  const mime = cleanString(value, 120).toLowerCase();
  return mime.startsWith('image/') || mime.startsWith('video/');
}

module.exports = { cleanString, safeFileName, isAllowedMime };
