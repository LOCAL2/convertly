// --- Base64 Encoders ---
export const safeBase64Encode = (val: string): string => {
  if (!val) return '';
  const utf8Bytes = new TextEncoder().encode(val);
  let binaryStr = '';
  utf8Bytes.forEach((b) => {
    binaryStr += String.fromCharCode(b);
  });
  return btoa(binaryStr);
};

export const safeBase64Decode = (val: string): string => {
  if (!val) return '';
  const cleanVal = val.trim().replace(/\s+/g, '');
  const binaryStr = atob(cleanVal);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
};

// --- Base32 RFC 4648 Helper Implementation ---
const B32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export const safeBase32Encode = (val: string): string => {
  if (!val) return '';
  const bytes = new TextEncoder().encode(val);
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) {
      output += B32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += B32_ALPHABET[(value << (5 - bits)) & 31];
  }

  while (output.length % 8 !== 0) {
    output += '=';
  }

  return output;
};

export const safeBase32Decode = (val: string): string => {
  if (!val) return '';
  const clean = val.toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = B32_ALPHABET.indexOf(clean[i]);
    if (idx === -1) throw new Error('Invalid Base32 character');
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(bytes));
};

// --- Comment Remover ---
export const removeCodeComments = (code: string, lang: 'javascript' | 'python' | 'html' | 'css' | 'sql'): string => {
  if (!code) return '';
  let cleaned = code;

  if (lang === 'javascript' || lang === 'css') {
    const jsRegex = /("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`)|(\/\*[\s\S]*?\*\/|\/\/[^\n]*)/g;
    cleaned = cleaned.replace(jsRegex, (match, stringGroup) => {
      if (stringGroup) return match;
      return '';
    });
  } else if (lang === 'python') {
    const pyRegex = /("""[\s\S]*?"""|'''[\s\S]*?'''|"([^"\\]|\\.)*"|'([^'\\]|\\.)*')|(#(?!.*"""|.*''')[^\n]*)/g;
    cleaned = cleaned.replace(pyRegex, (match, stringGroup) => {
      if (stringGroup) return match;
      return '';
    });
  } else if (lang === 'html') {
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
  } else if (lang === 'sql') {
    const sqlRegex = /('([^'\\]|\\.)*')|(\/\*[\s\S]*?\*\/|--[^\n]*)/g;
    cleaned = cleaned.replace(sqlRegex, (match, stringGroup) => {
      if (stringGroup) return match;
      return '';
    });
  }

  return cleaned.split('\n').filter(line => line.trim() !== '').join('\n');
};

// --- Percentage Calculations ---
export const calcPercentValueOf = (percent: number, total: number): number | null => {
  if (isNaN(percent) || isNaN(total)) return null;
  return (percent / 100) * total;
};

export const calcPercentRatio = (part: number, total: number): number | null => {
  if (isNaN(part) || isNaN(total) || total === 0) return null;
  return (part / total) * 100;
};

export const calcPercentChange = (from: number, to: number): { diff: number; pct: number } | null => {
  if (isNaN(from) || isNaN(to) || from === 0) return null;
  const diff = to - from;
  const pct = (diff / from) * 100;
  return { diff, pct };
};

export const calcPercentAddSub = (val: number, percent: number, op: 'add' | 'sub'): number | null => {
  if (isNaN(val) || isNaN(percent)) return null;
  const amount = (percent / 100) * val;
  return op === 'add' ? val + amount : val - amount;
};

// --- Thai Working Days ---
export const THAI_HOLIDAYS_TEST: Record<string, string> = {
  '2026-01-01': 'วันขึ้นปีใหม่',
  '2026-04-13': 'วันสงกรานต์',
  '2026-04-14': 'วันสงกรานต์',
  '2026-04-15': 'วันสงกรานต์',
  '2026-05-01': 'วันแรงงานแห่งชาติ',
  '2026-12-05': 'วันพ่อแห่งชาติ',
  '2026-12-31': 'วันสิ้นปี',
};

export const calculateThaiWorkingDays = (startDateStr: string, endDateStr: string) => {
  if (!startDateStr || !endDateStr) return { workingDays: 0, weekendDays: 0, holidayDays: 0, totalDays: 0, holidaysList: [] };

  const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
  const [eYear, eMonth, eDay] = endDateStr.split('-').map(Number);

  const start = new Date(sYear, sMonth - 1, sDay);
  const end = new Date(eYear, eMonth - 1, eDay);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return { workingDays: 0, weekendDays: 0, holidayDays: 0, totalDays: 0, holidaysList: [] };
  }

  let workingDays = 0;
  let weekendDays = 0;
  let holidayDays = 0;
  let totalDays = 0;
  const holidaysList: { date: string; name: string }[] = [];

  const curr = new Date(start);
  while (curr <= end) {
    totalDays++;
    const dayOfWeek = curr.getDay();

    const y = curr.getFullYear();
    const m = String(curr.getMonth() + 1).padStart(2, '0');
    const d = String(curr.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
      if (THAI_HOLIDAYS_TEST[dateStr]) {
        holidaysList.push({ date: dateStr, name: `${THAI_HOLIDAYS_TEST[dateStr]} (ตรงกับวันเสาร์-อาทิตย์)` });
      }
    } else if (THAI_HOLIDAYS_TEST[dateStr]) {
      holidayDays++;
      holidaysList.push({ date: dateStr, name: THAI_HOLIDAYS_TEST[dateStr] });
    } else {
      workingDays++;
    }
    curr.setDate(curr.getDate() + 1);
  }

  return { workingDays, weekendDays, holidayDays, totalDays, holidaysList };
};

// --- Unit Converters ---
export const convertLength = (val: number, from: string, to: string): number => {
  const toMeters: Record<string, number> = {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mile: 1609.344,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254,
  };
  if (!toMeters[from] || !toMeters[to]) return val;
  const inMeters = val * toMeters[from];
  return inMeters / toMeters[to];
};

export const convertTemperature = (val: number, from: string, to: string): number => {
  if (from === to) return val;
  let celsius = val;
  if (from === 'f') celsius = (val - 32) * (5 / 9);
  else if (from === 'k') celsius = val - 273.15;

  if (to === 'c') return celsius;
  if (to === 'f') return celsius * (9 / 5) + 32;
  if (to === 'k') return celsius + 273.15;
  return val;
};
