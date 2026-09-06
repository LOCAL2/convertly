// --- Additional Utility Functions for Tools ---

// 1. JSON Formatter & Minifier
export const formatJson = (jsonStr: string, indent: number = 2): string => {
  if (!jsonStr.trim()) return '';
  const parsed = JSON.parse(jsonStr);
  return JSON.stringify(parsed, null, indent);
};

export const minifyJson = (jsonStr: string): string => {
  if (!jsonStr.trim()) return '';
  const parsed = JSON.parse(jsonStr);
  return JSON.stringify(parsed);
};

// 2. HTML Entity Encoder / Decoder
export const encodeHtmlEntities = (str: string): string => {
  return str.replace(/[\u00A0-\u9999<>&"']/g, (i) => `&#${i.charCodeAt(0)};`);
};

export const decodeHtmlEntities = (str: string): string => {
  return str.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
};

// 3. Password Generator Logic
export const generatePassword = (
  length: number,
  options: { lowercase: boolean; uppercase: boolean; numbers: boolean; symbols: boolean }
): string => {
  let chars = '';
  if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.numbers) chars += '0123456789';
  if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!chars) return '';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// 4. UUID Generator Check
export const isValidUuidV4 = (uuid: string): boolean => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

// 5. JSON to CSV Converter
export const jsonToCsv = (jsonArray: Record<string, any>[]): string => {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) return '';
  const headers = Object.keys(jsonArray[0]);
  const rows = jsonArray.map((obj) =>
    headers.map((h) => JSON.stringify(obj[h] ?? '')).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
};
