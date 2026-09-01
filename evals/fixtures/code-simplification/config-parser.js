'use strict';

/**
 * Extracted parseValue for better readability and to reduce complexity in the main loop.
 * Using early returns/continue statements flattens the nested structures,
 * improving readability without sacrificing performance.
 */
function parseValue(raw) {
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (raw !== '' && !Number.isNaN(Number(raw))) return Number(raw);
  if (
    raw.length >= 2 &&
    ((raw[0] === '"' && raw[raw.length - 1] === '"') ||
      (raw[0] === "'" && raw[raw.length - 1] === "'"))
  ) {
    return raw.slice(1, raw.length - 1);
  }
  return raw;
}

function parseConfig(lines) {
  const result = {};
  let section = 'default';
  result[section] = {};

  for (let i = 0; i < lines.length; i++) {
    const original = lines[i];

    // Early continues for invalid or empty lines
    if (original === undefined || original === null) continue;

    const line = String(original).trim();
    if (line.length === 0) continue;

    // Early continue for comments
    if (line[0] === '#' || line[0] === ';') continue;

    // Parse section header
    if (line[0] === '[' && line[line.length - 1] === ']') {
      const candidate = line.slice(1, line.length - 1).trim();
      if (candidate.length > 0) {
        section = candidate;
        if (!result[section]) result[section] = {};
      }
      continue;
    }

    // Parse key-value pair
    const separator = line.indexOf('=');
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    if (key.length === 0) continue;

    const raw = line.slice(separator + 1).trim();
    result[section][key] = parseValue(raw);
  }
  return result;
}

module.exports = { parseConfig };
