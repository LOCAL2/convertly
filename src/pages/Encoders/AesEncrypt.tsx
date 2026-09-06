import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Copy, Check, Info, Lock, Unlock } from 'lucide-react';

export default function AesEncrypt() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState<string>('');
  const [passphrase, setPassphrase] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // AES-GCM Key Derivation using PBKDF2
  const getKey = async (secret: string, salt: Uint8Array) => {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, [
      'deriveKey',
    ]);
    const saltBuffer = new Uint8Array(salt).buffer;
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  };

  const handleProcess = async () => {
    if (!inputText.trim() || !passphrase.trim()) {
      setOutputText('');
      setError('');
      return;
    }

    try {
      const enc = new TextEncoder();
      if (mode === 'encrypt') {
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const key = await getKey(passphrase, salt);

        const encodedText = enc.encode(inputText);
        const encryptedContent = await window.crypto.subtle.encrypt(
          { name: 'AES-GCM', iv },
          key,
          encodedText
        );

        // Combine Salt + IV + Encrypted Data into a single Base64 string
        const buffer = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength);
        buffer.set(salt, 0);
        buffer.set(iv, salt.length);
        buffer.set(new Uint8Array(encryptedContent), salt.length + iv.length);

        setOutputText(btoa(String.fromCharCode(...buffer)));
        setError('');
      } else {
        // Decrypt mode
        const binaryStr = atob(inputText.trim());
        const buffer = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          buffer[i] = binaryStr.charCodeAt(i);
        }

        const salt = buffer.slice(0, 16);
        const iv = buffer.slice(16, 28);
        const data = buffer.slice(28);

        const key = await getKey(passphrase, salt);
        const decryptedContent = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);

        const dec = new TextDecoder();
        setOutputText(dec.decode(decryptedContent));
        setError('');
      }
    } catch (err: any) {
      setError(mode === 'decrypt' ? 'ไม่สามารถถอดรหัสได้ Passphrase ไม่ถูกต้อง หรือรูปแบบรหัสผ่านเสียหาย' : err.message);
      setOutputText('');
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run initial process
  useState(() => {
    handleProcess();
  });

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 px-4 md:px-8 z-10">
      {/* Header */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 uppercase tracking-wider">
            <Lock size={18} />
            <span>Security & Crypto</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">AES Encrypt / Decrypt</h1>
          <p className="text-muted text-sm font-medium mt-1">
            เข้ารหัสและถอดรหัสข้อความด้วยอัลกอริทึม AES-256-GCM + PBKDF2 ด้วย Passphrase
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-surface p-1.5 rounded-2xl border border-border">
          <button
            onClick={() => {
              setMode('encrypt');
              setError('');
              setOutputText('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              mode === 'encrypt' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-text'
            }`}
          >
            <Lock size={16} />
            <span>เข้ารหัส (Encrypt)</span>
          </button>
          <button
            onClick={() => {
              setMode('decrypt');
              setError('');
              setOutputText('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              mode === 'decrypt' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-text'
            }`}
          >
            <Unlock size={16} />
            <span>ถอดรหัส (Decrypt)</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl flex flex-col gap-6">
        {/* Passphrase Input */}
        <div className="glass-panel p-5 flex flex-col gap-2">
          <label className="text-xs font-bold text-muted uppercase flex items-center gap-1.5">
            <KeyRound size={14} className="text-primary" />
            <span>Secret Passphrase (รหัสลับสำหรับเข้ารหัส/ถอดรหัส)</span>
          </label>
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="กำหนดรหัสผ่านลับ..."
            className="w-full px-4 py-3 border border-border rounded-xl font-mono text-sm outline-none shadow-inner"
          />
        </div>

        {/* Error banner */}
        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-xs font-mono">
            ⚠️ {error}
          </div>
        )}

        {/* Input & Output Box Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="glass-panel flex flex-col h-[400px]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-black/5 dark:bg-white/5">
              <span className="text-text font-bold text-sm">
                {mode === 'encrypt' ? 'ข้อความปกติ (Plain Text)' : 'ข้อความเข้ารหัส Base64 (Encrypted Text)'}
              </span>
              <button
                onClick={handleProcess}
                className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-bold shadow-sm hover:bg-primary/90 transition-all active:scale-95"
              >
                {mode === 'encrypt' ? 'เข้ารหัส' : 'ถอดรหัส'}
              </button>
            </div>
            <div className="flex-1 p-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={mode === 'encrypt' ? 'พิมพ์ข้อความที่ต้องการซ่อน...' : 'วาง Base64 string ที่ต้องการถอดรหัส...'}
                className="w-full h-full bg-background/50 border-none rounded-xl p-4 text-text font-mono text-sm resize-none outline-none shadow-inner"
              />
            </div>
          </div>

          {/* Output */}
          <div className="glass-panel flex flex-col h-[400px]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-black/5 dark:bg-white/5">
              <span className="text-text font-bold text-sm">
                {mode === 'encrypt' ? 'ผลลัพธ์การเข้ารหัส (Base64)' : 'ผลลัพธ์การถอดรหัส (Decrypted Text)'}
              </span>
              <button
                onClick={handleCopy}
                disabled={!outputText}
                className="flex items-center gap-1.5 px-3 py-1 bg-surface border border-border hover:bg-black/5 dark:hover:bg-white/5 text-text rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>
            <div className="flex-1 p-3">
              <textarea
                readOnly
                value={outputText}
                placeholder="ผลลัพธ์จะปรากฏที่นี่..."
                className="w-full h-full bg-background/50 border-none rounded-xl p-4 text-text font-mono text-sm resize-none outline-none shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 bg-surface/50 border border-border/80 rounded-2xl flex items-start gap-3 text-xs text-muted leading-relaxed">
          <Info className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-text block mb-0.5">ข้อตกลงและความปลอดภัย (Security & Privacy Guarantee):</span>
            การเข้ารหัสและถอดรหัส AES-256 ทั้งหมดประมวลผลด้วย Web Crypto API บนเบราว์เซอร์ของคุณ (Client-Side Only) รหัสผ่านลับและข้อความของคุณจะไม่ถูกส่งไปยังเซิร์ฟเวอร์ใดๆ
          </div>
        </div>
      </motion.div>
    </div>
  );
}
