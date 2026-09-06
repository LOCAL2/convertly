import { useState, useEffect } from 'react';
import { Copy, Check, Terminal, Type } from 'lucide-react';

export default function AsciiArtGenerator() {
  const [textInput, setTextInput] = useState('CONVERTLY');
  const [asciiArtText, setAsciiArtText] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  const generateSimpleBanner = (txt: string) => {
    if (!txt.trim()) return '';
    const clean = txt.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
    
    // Simple 3-line Terminal Banner Generator
    const lines = ['', '', ''];
    for (let char of clean) {
      if (char === ' ') {
        lines[0] += '   ';
        lines[1] += '   ';
        lines[2] += '   ';
      } else {
        lines[0] += ` _ ${char} _ `;
        lines[1] += `|   |`;
        lines[2] += `|___|`;
      }
    }
    return `/*\n${lines.join('\n')}\n*/`;
  };

  useEffect(() => {
    setAsciiArtText(generateSimpleBanner(textInput));
  }, [textInput]);

  const handleCopy = () => {
    navigator.clipboard.writeText(asciiArtText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-10 md:py-16 z-10">
      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-text mb-3 tracking-tight">
          สร้างตัวอักษร ASCII Art & Terminal Banner
        </h1>
        <p className="text-muted font-semibold text-base md:text-lg">
          แปลงข้อความให้เป็นสัญลักษณ์ตัวอักษร ASCII Art สำหรับใส่ใน README.md หรือ Terminal Banner
        </p>
      </div>

      <div className="w-full max-w-4xl glass-panel p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-extrabold text-muted uppercase tracking-wider flex items-center gap-2">
            <Type className="w-4 h-4 text-emerald-500" /> ป้อนข้อความที่ต้องการสร้าง ASCII Banner
          </label>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="พิมพ์ข้อความภาษาอังกฤษ เช่น CONVERTLY..."
            className="w-full bg-background/50 border border-border/80 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-text font-mono font-bold text-base outline-none shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-2 relative">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-4 h-4" /> ผลลัพธ์ ASCII Art Code
            </label>
            {asciiArtText && (
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 bg-surface border border-border rounded-xl text-xs font-bold text-text hover:text-emerald-500 transition-all flex items-center gap-1.5"
              >
                {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            )}
          </div>

          <textarea
            readOnly
            rows={8}
            value={asciiArtText}
            className="w-full bg-background/80 border border-border rounded-2xl p-5 text-emerald-500 font-mono text-sm leading-relaxed outline-none shadow-inner resize-none select-all"
          />
        </div>
      </div>
    </div>
  );
}
