import { describe, it, expect } from 'vitest';
import {
  formatJson,
  minifyJson,
  encodeHtmlEntities,
  decodeHtmlEntities,
  generatePassword,
  isValidUuidV4,
  jsonToCsv,
} from '../src/utils/toolsHelpers';

describe('JSON Formatter & Minifier Test Suite', () => {
  it('should format valid JSON with indentation', () => {
    const raw = '{"name":"Convertly","active":true}';
    const formatted = formatJson(raw, 2);
    expect(formatted).toContain('\n');
    expect(formatted).toContain('  "name": "Convertly"');
  });

  it('should minify JSON by stripping whitespace', () => {
    const formatted = '{\n  "name": "Convertly",\n  "active": true\n}';
    const minified = minifyJson(formatted);
    expect(minified).toBe('{"name":"Convertly","active":true}');
  });

  it('should throw error for invalid JSON', () => {
    expect(() => formatJson('{ invalid json }')).toThrow();
  });
});

describe('HTML Entity Encoder & Decoder Test Suite', () => {
  it('should encode HTML special characters correctly', () => {
    const raw = '<h1>Hello & "Welcome"</h1>';
    const encoded = encodeHtmlEntities(raw);
    expect(encoded).not.toContain('<');
    expect(encoded).not.toContain('>');
    expect(encoded).toContain('&#60;');
    expect(encoded).toContain('&#62;');
  });

  it('should decode HTML entities back to raw HTML', () => {
    const encoded = '&#60;h1&#62;Hello &#38; "Welcome"&#60;/h1&#62;';
    const decoded = decodeHtmlEntities(encoded);
    expect(decoded).toBe('<h1>Hello & "Welcome"</h1>');
  });
});

describe('Password Generator Test Suite', () => {
  it('should generate password of specified length with selected character sets', () => {
    const pass = generatePassword(16, { lowercase: true, uppercase: true, numbers: true, symbols: true });
    expect(pass.length).toBe(16);
  });

  it('should generate numbers-only password when selected', () => {
    const pass = generatePassword(10, { lowercase: false, uppercase: false, numbers: true, symbols: false });
    expect(pass.length).toBe(10);
    expect(/^[0-9]+$/.test(pass)).toBe(true);
  });
});

describe('UUID V4 Generator Test Suite', () => {
  it('should validate standard UUID v4 string correctly', () => {
    const validUuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    expect(isValidUuidV4(validUuid)).toBe(true);

    const invalidUuid = 'not-a-valid-uuid-1234';
    expect(isValidUuidV4(invalidUuid)).toBe(false);
  });
});

describe('JSON to CSV Converter Test Suite', () => {
  it('should convert array of JSON objects to CSV string', () => {
    const data = [
      { id: 1, name: 'Alice', role: 'Admin' },
      { id: 2, name: 'Bob', role: 'User' },
    ];
    const csv = jsonToCsv(data);
    expect(csv).toContain('id,name,role');
    expect(csv).toContain('1,"Alice","Admin"');
    expect(csv).toContain('2,"Bob","User"');
  });
});
