import { readFileSync } from 'node:fs';

const en = JSON.parse(readFileSync('./messages/en/Challenges.json', 'utf-8'));
const it = JSON.parse(readFileSync('./messages/it/Challenges.json', 'utf-8'));

function flatten(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flatten(value, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

const enFlat = flatten(en);
const itFlat = flatten(it);
const untranslated = [];

for (const [key, value] of Object.entries(enFlat)) {
  if (itFlat[key] === value) {
    untranslated.push({ key, value });
  }
}

console.log(`Untranslated keys (${untranslated.length}):`);
untranslated.forEach(({ key, value }) => console.log(`  ${key}: "${value}"`));
