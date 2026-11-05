// Pure helpers for image tabs (no herdr/gpui imports, so they can run under plain node).
export const RASTER = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico", "avif"];

export const isRaster = ext => RASTER.includes(String(ext).toLowerCase());
export const isSvg = ext => String(ext).toLowerCase() === "svg";
export const isImage = ext => isRaster(ext) || isSvg(ext);

// Stable 32-bit FNV-1a hash of a string, as 8 hex digits.
function hash(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0");
}

// Cache file name under <appHome>/cache/gentle-editor/: sanitized base name + path hash + load counter + extension.
// The counter changes on every reload because the host image loader may cache by path.
export function cacheName(full, ext, version) {
  const base = full.split(/[\\/]/).pop().replace(/\.[^.]*$/, "").replace(/[^A-Za-z0-9_-]+/g, "_").slice(0, 40) || "image";
  return `${base}-${hash(full)}-${version}.${String(ext).toLowerCase()}`;
}

export function formatSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / 1048576).toFixed(1)} MiB`;
}
