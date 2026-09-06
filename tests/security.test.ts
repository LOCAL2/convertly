import { describe, it, expect } from 'vitest';

// --- Encoder & Security Helpers ---
export const encodeUrl = (str: string): string => encodeURIComponent(str);
export const decodeUrl = (str: string): string => decodeURIComponent(str);

export const parseJwt = (token: string): { header: any; payload: any } => {
  const parts = token.trim().split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');
  const header = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(parts[0]), c => c.charCodeAt(0))));
  const payload = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(parts[1]), c => c.charCodeAt(0))));
  return { header, payload };
};

export const calculatePasswordEntropy = (pass: string) => {
  if (!pass) return { length: 0, poolSize: 0, entropy: 0, score: 'Very Weak' };
  let poolSize = 0;
  if (/[a-z]/.test(pass)) poolSize += 26;
  if (/[A-Z]/.test(pass)) poolSize += 26;
  if (/[0-9]/.test(pass)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(pass)) poolSize += 32;

  const entropy = Math.round(pass.length * Math.log2(poolSize || 1));
  let score = 'Very Weak';
  if (entropy >= 80) score = 'Very Strong';
  else if (entropy >= 60) score = 'Strong';
  else if (entropy >= 40) score = 'Moderate';
  else if (entropy >= 25) score = 'Weak';

  return { length: pass.length, poolSize, entropy, score };
};

describe('URL Encoders & Security Tools Suite', () => {
  it('should encode and decode URLs correctly with Thai & special chars', () => {
    const url = 'https://convertly.app/search?q=ทดสอบ สัญลักษณ์ & = ?';
    const encoded = encodeUrl(url);
    expect(encoded).not.toContain(' ');
    expect(decodeUrl(encoded)).toBe(url);
  });

  it('should parse valid JWT tokens correctly', () => {
    // Valid JWT mockup
    const headerStr = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payloadStr = btoa(JSON.stringify({ sub: "1234567890", name: "Convertly User", admin: true }));
    const mockToken = `${headerStr}.${payloadStr}.signature_part`;

    const parsed = parseJwt(mockToken);
    expect(parsed.header.alg).toBe('HS256');
    expect(parsed.payload.name).toBe('Convertly User');
    expect(parsed.payload.admin).toBe(true);
  });

  it('should calculate password entropy and security score accurately', () => {
    const weakPass = calculatePasswordEntropy('123456');
    expect(weakPass.score).toBe('Very Weak');
    expect(weakPass.poolSize).toBe(10);

    const strongPass = calculatePasswordEntropy('P@ssw0rd!#Convertly2026');
    expect(strongPass.score).toBe('Very Strong');
    expect(strongPass.entropy).toBeGreaterThan(80);
  });
});
