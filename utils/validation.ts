/**
 * Validates if the provided string is a valid URL with http or https protocol.
 */
export const isValidUrl = (string: string): boolean => {
  if (!string || !string.trim()) return false;
  try {
    const url = new URL(string.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

/**
 * Extracts the hostname from a URL for naming purposes.
 */
export const getHostname = (urlStr: string): string => {
  try {
    const url = new URL(urlStr.trim());
    return url.hostname.replace(/[^a-z0-9]/gi, '-');
  } catch {
    return 'unknown-host';
  }
};

/**
 * Normalizes URL by trimming whitespace.
 */
export const normalizeUrl = (urlStr: string): string => {
  return urlStr.trim();
};