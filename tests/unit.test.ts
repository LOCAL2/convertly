import { describe, it, expect } from 'vitest';
import {
  safeBase64Encode,
  safeBase64Decode,
  removeCodeComments,
  calcPercentValueOf,
  calcPercentRatio,
  calcPercentChange,
  calcPercentAddSub,
  calculateThaiWorkingDays,
  convertLength,
  convertTemperature,
} from '../src/utils/converters';

describe('Base64 UTF-8 Encoding & Decoding Test Suite', () => {
  it('should correctly encode and decode ASCII text', () => {
    const text = 'Hello Convertly 2026!';
    const encoded = safeBase64Encode(text);
    const decoded = safeBase64Decode(encoded);
    expect(decoded).toBe(text);
  });

  it('should correctly encode and decode Thai UTF-8 text', () => {
    const thaiText = 'ทดสอบระบบแปลงภาษาไทย สวัสดีครับ ๑๒๓๔๕';
    const encoded = safeBase64Encode(thaiText);
    const decoded = safeBase64Decode(encoded);
    expect(decoded).toBe(thaiText);
  });

  it('should correctly encode and decode Emoji & Symbols', () => {
    const emojiText = '🚀⚡🔒 Convertly Web App 🇹🇭';
    const encoded = safeBase64Encode(emojiText);
    const decoded = safeBase64Decode(encoded);
    expect(decoded).toBe(emojiText);
  });

  it('should return empty string for empty input', () => {
    expect(safeBase64Encode('')).toBe('');
    expect(safeBase64Decode('')).toBe('');
  });

  it('should throw error for malformed base64', () => {
    expect(() => safeBase64Decode('!!!InvalidBase64!!!')).toThrow();
  });
});

describe('Code Comment Remover Test Suite', () => {
  it('should remove JavaScript single-line and multi-line comments while preserving strings', () => {
    const code = `
      // This is a single line comment
      const url = "http://example.com/api"; // URL string
      /* Multi-line
         comment here */
      const msg = '//#NotAComment';
      console.log(url, msg);
    `;
    const result = removeCodeComments(code, 'javascript');
    expect(result).not.toContain('This is a single line comment');
    expect(result).not.toContain('Multi-line');
    expect(result).toContain('const url = "http://example.com/api";');
    expect(result).toContain("const msg = '//#NotAComment';");
  });

  it('should remove Python comments while preserving docstrings and hash in strings', () => {
    const pyCode = `
      # Python comment
      name = "#NotAComment"
      print(name)
    `;
    const result = removeCodeComments(pyCode, 'python');
    expect(result).not.toContain('# Python comment');
    expect(result).toContain('name = "#NotAComment"');
  });

  it('should remove HTML comments', () => {
    const html = `<div><!-- HTML Comment --><h1>Title</h1></div>`;
    const result = removeCodeComments(html, 'html');
    expect(result).toBe('<div><h1>Title</h1></div>');
  });
});

describe('Percentage Calculator Test Suite', () => {
  it('should calculate X% of Y correctly', () => {
    expect(calcPercentValueOf(20, 500)).toBe(100);
    expect(calcPercentValueOf(7, 1000)).toBe(70);
  });

  it('should calculate X is what percent of Y', () => {
    expect(calcPercentRatio(50, 200)).toBe(25);
    expect(calcPercentRatio(0, 100)).toBe(0);
    expect(calcPercentRatio(50, 0)).toBeNull();
  });

  it('should calculate percentage change from X to Y', () => {
    const res = calcPercentChange(100, 150);
    expect(res?.pct).toBe(50);
    expect(res?.diff).toBe(50);

    const dropRes = calcPercentChange(200, 100);
    expect(dropRes?.pct).toBe(-50);
  });

  it('should add or subtract percentage', () => {
    expect(calcPercentAddSub(1000, 7, 'add')).toBe(1070);
    expect(calcPercentAddSub(1000, 10, 'sub')).toBe(900);
  });
});

describe('Thai Working Days Test Suite', () => {
  it('should count weekdays, weekends, and holidays correctly', () => {
    // 2026-04-10 (Fri) to 2026-04-16 (Thu)
    // Fri (Work), Sat (Weekend), Sun (Weekend), Mon (Holiday-Songkran), Tue (Holiday-Songkran), Wed (Holiday-Songkran), Thu (Work)
    const res = calculateThaiWorkingDays('2026-04-10', '2026-04-16');
    expect(res.totalDays).toBe(7);
    expect(res.weekendDays).toBe(2);
    expect(res.holidayDays).toBe(3);
    expect(res.workingDays).toBe(2);
    expect(res.holidaysList.length).toBe(3);
  });
});

describe('Unit Converters Test Suite', () => {
  it('should convert length correctly', () => {
    expect(convertLength(1, 'km', 'm')).toBe(1000);
    expect(convertLength(100, 'cm', 'm')).toBe(1);
    expect(convertLength(1, 'mile', 'm')).toBe(1609.344);
  });

  it('should convert temperature correctly', () => {
    expect(convertTemperature(0, 'c', 'f')).toBe(32);
    expect(convertTemperature(100, 'c', 'f')).toBe(212);
    expect(convertTemperature(0, 'c', 'k')).toBe(273.15);
  });
});
