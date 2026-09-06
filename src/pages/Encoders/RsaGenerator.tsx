import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Copy, Check, RefreshCw } from 'lucide-react';

export default function RsaGenerator() {
  const [keySize, setKeySize] = useState<number>(2048);
  const [publicKey, setPublicKey] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedPub, setCopiedPub] = useState<boolean>(false);
  const [copiedPriv, setCopiedPriv] = useState<boolean>(false);

  // Helper to convert ArrayBuffer to PEM format
  const arrayBufferToPem = (buffer: ArrayBuffer, type: 'PUBLIC KEY' | 'PRIVATE KEY') => {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    const base64 = btoa(binary);
    const lines = base64.match(/.{1,64}/g) || [];
    return `-----BEGIN ${type}-----\n${lines.join('\n')}\n-----END ${type}-----`;
  };

  const generateRsaKeyPair = async (size: number) => {
    setLoading(true);
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: size,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['sign', 'verify']
      );

      const pubExported = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
      const privExported = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

      setPublicKey(arrayBufferToPem(pubExported, 'PUBLIC KEY'));
      setPrivateKey(arrayBufferToPem(privExported, 'PRIVATE KEY'));
    } catch (err) {
      console.error('RSA Key generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPub = () => {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey);
    setCopiedPub(true);
    setTimeout(() => setCopiedPub(false), 2000);
  };

  const handleCopyPriv = () => {
    if (!privateKey) return;
    navigator.clipboard.writeText(privateKey);
    setCopiedPriv(true);
    setTimeout(() => setCopiedPriv(false), 2000);
  };

  // Run initial key generation
  useState(() => {
    generateRsaKeyPair(keySize);
  });

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 px-4 md:px-8 z-10">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 uppercase tracking-wider">
            <Key size={18} />
            <span>Security & Crypto</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">RSA Key Pair Generator</h1>
          <p className="text-muted text-sm font-medium mt-1">
            สร้างคู่กุญแจ Public Key และ Private Key (PEM Format) ด้วย Web Crypto API ของเบราว์เซอร์อย่างปลอดภัย
          </p>
        </div>

        <button
          onClick={() => generateRsaKeyPair(keySize)}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'กำลังสร้าง Key...' : 'สร้าง Key Pair ใหม่'}</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="glass-panel w-full max-w-6xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold text-muted uppercase">ขนาด Key Size:</label>
          <select
            value={keySize}
            onChange={(e) => {
              const val = Number(e.target.value);
              setKeySize(val);
              generateRsaKeyPair(val);
            }}
            className="bg-background border border-border text-text text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value={1024}>1024-bit (Fast Test)</option>
            <option value={2048}>2048-bit (Standard Recommended)</option>
            <option value={4096}>4096-bit (High Security)</option>
          </select>
        </div>
        <div className="text-xs text-muted">
          Format: <strong className="text-primary font-mono">PEM / PKCS#8</strong>
        </div>
      </div>

      {/* Keys Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Public Key */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel flex flex-col h-[480px]">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-black/5 dark:bg-white/5">
            <span className="text-text font-bold text-sm">Public Key (เปิดเผยได้)</span>
            <button
              onClick={handleCopyPub}
              disabled={!publicKey}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border hover:bg-black/5 dark:hover:bg-white/5 text-text rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            >
              {copiedPub ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              <span>{copiedPub ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
            </button>
          </div>

          <div className="flex-1 p-3">
            <textarea
              readOnly
              value={publicKey}
              className="w-full h-full bg-background/50 border-none rounded-xl p-4 text-text font-mono text-xs resize-none outline-none shadow-inner"
              placeholder="Public Key จะปรากฏที่นี่..."
            />
          </div>
        </motion.div>

        {/* Private Key */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel flex flex-col h-[480px]">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-black/5 dark:bg-white/5">
            <span className="text-text font-bold text-sm text-red-400">Private Key (ความลับห้ามเปิดเผย)</span>
            <button
              onClick={handleCopyPriv}
              disabled={!privateKey}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border hover:bg-black/5 dark:hover:bg-white/5 text-text rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            >
              {copiedPriv ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              <span>{copiedPriv ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
            </button>
          </div>

          <div className="flex-1 p-3">
            <textarea
              readOnly
              value={privateKey}
              className="w-full h-full bg-background/50 border-none rounded-xl p-4 text-text font-mono text-xs resize-none outline-none shadow-inner"
              placeholder="Private Key จะปรากฏที่นี่..."
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
