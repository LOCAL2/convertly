import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Copy, Check, RefreshCw } from 'lucide-react';

export default function PasswordGenerator() {
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);

  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const generatePassword = () => {
    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      setPassword('');
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }

    setPassword(result);
  };

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate Password Strength
  const getStrength = () => {
    if (!password) return { label: 'ไม่มีรหัสผ่าน', score: 0, color: 'text-muted' };
    let score = 0;
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;

    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score >= 6) return { label: 'แข็งแกร่งมาก (Very Strong)', score: 4, color: 'text-green-400' };
    if (score >= 4) return { label: 'ปานกลาง (Strong)', score: 3, color: 'text-blue-400' };
    if (score >= 3) return { label: 'พอใช้ (Medium)', score: 2, color: 'text-amber-400' };
    return { label: 'อ่อนแอกว่าเกณฑ์ (Weak)', score: 1, color: 'text-red-400' };
  };

  const strength = getStrength();

  // Run initial password generation
  useState(() => {
    generatePassword();
  });

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 px-4 md:px-8 z-10">
      {/* Header */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 uppercase tracking-wider">
            <KeyRound size={18} />
            <span>Security & Crypto</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">Secure Password Generator</h1>
          <p className="text-muted text-sm font-medium mt-1">
            สุ่มสร้างรหัสผ่านที่มีความปลอดภัยสูงด้วย Crypto API ปรับความยาวและสัญลักษณ์พิเศษได้
          </p>
        </div>

        <button
          onClick={generatePassword}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all active:scale-95"
        >
          <RefreshCw size={16} />
          <span>สุ่มใหม่ (Generate)</span>
        </button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl flex flex-col gap-6">
        {/* Result Display Box */}
        <div className="glass-panel p-6 flex flex-col gap-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">รหัสผ่านที่สุ่มได้</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${strength.color}`}>{strength.label}</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-background/80 border border-border rounded-2xl p-4 gap-4">
            <span className="font-mono text-xl md:text-2xl font-bold text-text tracking-wider break-all">
              {password || 'กรุณาเลือกรูปแบบตัวอักษร'}
            </span>
            <button
              onClick={handleCopy}
              disabled={!password}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-md hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 flex-shrink-0"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
            </button>
          </div>
        </div>

        {/* Options Form */}
        <div className="glass-panel p-6 flex flex-col gap-6">
          <h2 className="text-base font-bold text-text">ตัวเลือกการสุ่มรหัสผ่าน</h2>

          {/* Length Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted">ความยาวรหัสผ่าน (Length):</span>
              <span className="text-primary font-mono text-base">{length} ตัวอักษร</span>
            </div>
            <input
              type="range"
              min="6"
              max="64"
              value={length}
              onChange={(e) => {
                setLength(Number(e.target.value));
                generatePassword();
              }}
              className="w-full accent-primary bg-background cursor-pointer"
            />
          </div>

          {/* Character Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-surface border border-border cursor-pointer hover:border-primary/40 transition-all">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => {
                  setIncludeUppercase(e.target.checked);
                  generatePassword();
                }}
                className="rounded border-border text-primary focus:ring-primary/50 bg-background w-4 h-4"
              />
              <div>
                <div className="text-sm font-bold text-text">ตัวพิมพ์ใหญ่ (A-Z)</div>
                <div className="text-xs text-muted">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-surface border border-border cursor-pointer hover:border-primary/40 transition-all">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => {
                  setIncludeLowercase(e.target.checked);
                  generatePassword();
                }}
                className="rounded border-border text-primary focus:ring-primary/50 bg-background w-4 h-4"
              />
              <div>
                <div className="text-sm font-bold text-text">ตัวพิมพ์เล็ก (a-z)</div>
                <div className="text-xs text-muted">abcdefghijklmnopqrstuvwxyz</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-surface border border-border cursor-pointer hover:border-primary/40 transition-all">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => {
                  setIncludeNumbers(e.target.checked);
                  generatePassword();
                }}
                className="rounded border-border text-primary focus:ring-primary/50 bg-background w-4 h-4"
              />
              <div>
                <div className="text-sm font-bold text-text">ตัวเลข (0-9)</div>
                <div className="text-xs text-muted">0123456789</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-surface border border-border cursor-pointer hover:border-primary/40 transition-all">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => {
                  setIncludeSymbols(e.target.checked);
                  generatePassword();
                }}
                className="rounded border-border text-primary focus:ring-primary/50 bg-background w-4 h-4"
              />
              <div>
                <div className="text-sm font-bold text-text">อักขระพิเศษ (Symbols)</div>
                <div className="text-xs text-muted">!@#$%^&*()_+-=[]{}|;:,.&lt;&gt;?</div>
              </div>
            </label>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
