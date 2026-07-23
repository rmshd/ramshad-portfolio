function cleanString(value, max = 300) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function cleanBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === 1 || value === '1') return true;
  if (value === 'false' || value === 0 || value === '0') return false;
  return fallback;
}

function cleanInt(value, min = 0, max = 999999, fallback = 0) {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function cleanArray(value, maxItems = 20, maxLength = 80) {
  const source = Array.isArray(value) ? value : cleanString(value, 1000).split(',');
  return source.map(item => cleanString(item, maxLength)).filter(Boolean).slice(0, maxItems);
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

function cleanUrl(value, max = 1000) {
  const url = cleanString(value, max);
  if (!url) return '';
  if (url.startsWith('/')) return url;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : '';
  } catch {
    return '';
  }
}

module.exports = { cleanString, cleanBoolean, cleanInt, cleanArray, safeFileName, isAllowedMime, cleanUrl };
