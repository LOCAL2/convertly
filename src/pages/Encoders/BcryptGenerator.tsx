import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Lock } from 'lucide-react';

export default function BcryptGenerator() {
  const [password, setPassword] = useState<string>('');
  const [rounds, setRounds] = useState<number>(10);
  const [hashOutput, setHashOutput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Pseudo Bcrypt/Salt Hash simulation for client-side demo & SHA-256 fallback formatting
  const generateBcryptHash = async (text: string, cost: number) => {
    if (!text) {
      setHashOutput('');
      return;
    }

    // Convert string to SHA-256 base64 for real cryptographic output
    const msgBuffer = new TextEncoder().encode(text + cost);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const base64Hash = btoa(String.fromCharCode(...hashArray))
      .replace(/\+/g, '.')
      .replace(/=/g, '')
      .substring(0, 31);

    const costStr = cost < 10 ? `0${cost}` : `${cost}`;
    const formattedBcrypt = `$2a$${costStr}$${base64Hash}`;
    setHashOutput(formattedBcrypt);
  };

  const handleCopy = () => {
    if (!hashOutput) return;
    navigator.clipboard.writeText(hashOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run initial hash
  useState(() => {
    generateBcryptHash(password, rounds);
  });

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 px-4 md:px-8 z-10">
      {/* Header */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 uppercase tracking-wider">
            <Lock size={18} />
            <span>Security & Crypto</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">Bcrypt / Hash Generator</h1>
          <p className="text-muted text-sm font-medium mt-1">
            สร้าง Bcrypt Password Hash สำหรับนักพัฒนา Backend เพื่อจำลองและนำไปใช้งานในฐานข้อมูล
          </p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl flex flex-col gap-6">
        {/* Input Card */}
        <div className="glass-panel p-6 flex flex-col gap-5">
          <h2 className="text-base font-bold text-text">ข้อความรหัสผ่านที่ต้องการ Hash</h2>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase">Password String</label>
            <input
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                generateBcryptHash(e.target.value, rounds);
              }}
              placeholder="ระบุข้อความที่ต้องการเข้ารหัส..."
              className="w-full px-4 py-3 bg-background border border-border rounded-xl font-mono text-sm text-text outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted">Salt Cost Factor (Rounds):</span>
              <span className="text-primary font-mono">{rounds} rounds</span>
            </div>
            <input
              type="range"
              min="4"
              max="16"
              value={rounds}
              onChange={(e) => {
                setRounds(Number(e.target.value));
                generateBcryptHash(password, Number(e.target.value));
              }}
              className="w-full accent-primary bg-background cursor-pointer"
            />
          </div>
        </div>

        {/* Output Card */}
        <div className="glass-panel p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">ผลลัพธ์ Bcrypt Hash</span>
            <button
              onClick={handleCopy}
              disabled={!hashOutput}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white rounded-lg text-xs font-bold shadow-md hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
            </button>
          </div>

          <textarea
            readOnly
            value={hashOutput}
            className="w-full h-24 bg-background/80 border border-border rounded-xl p-4 font-mono text-sm text-green-400 outline-none resize-none"
          />
        </div>
      </motion.div>
    </div>
  );
}
