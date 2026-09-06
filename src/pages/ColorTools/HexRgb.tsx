import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';

export default function HexRgb() {
  const [hex, setHex] = useState<string>('#6366f1');
  const [rgb, setRgb] = useState<string>('99, 102, 241');
  const [bgColor, setBgColor] = useState<string>('#6366f1');
  const [copiedHex, setCopiedHex] = useState(false);
  const [copiedRgb, setCopiedRgb] = useState(false);

  useEffect(() => {
    // Validate HEX
    const validHex = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex);
    if (validHex) {
      let h = hex.replace('#', '');
      if (h.length === 3) h = h.split('').map(x => x + x).join('');
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      setRgb(`${r}, ${g}, ${b}`);
      setBgColor(`#${h}`);
    }
  }, [hex]);

  const handleRgbChange = (val: string) => {
    setRgb(val);
    const parts = val.split(',').map(s => parseInt(s.trim(), 10));
    if (parts.length === 3 && parts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
      const h = parts.map(x => {
        const hexStr = x.toString(16);
        return hexStr.length === 1 ? '0' + hexStr : hexStr;
      }).join('');
      setHex(`#${h}`);
      setBgColor(`#${h}`);
    }
  };

  const copyToClipboard = (text: string, isHex: boolean) => {
    navigator.clipboard.writeText(text);
    if (isHex) {
      setCopiedHex(true);
      setTimeout(() => setCopiedHex(false), 2000);
    } else {
      setCopiedRgb(true);
      setTimeout(() => setCopiedRgb(false), 2000);
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      
      {/* Dynamic Background color based on input */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 blur-[100px] rounded-full pointer-events-none z-[-1] transition-colors duration-150 opacity-20 dark:opacity-30" 
        style={{ backgroundColor: bgColor }}
      />

      <div className="w-full max-w-2xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">HEX ↔ RGB</h1>
        <p className="text-muted font-medium text-lg">Convert colors between HEX and RGB formats instantly.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel w-full max-w-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center"
      >
        
        {/* Color Preview & Picker */}
        <div 
          className="relative w-32 h-32 md:w-48 md:h-48 rounded-2xl shadow-inner border border-black/10 dark:border-white/20 flex-shrink-0 transition-colors duration-150 overflow-hidden cursor-pointer group"
          style={{ backgroundColor: bgColor }}
          title="Click to pick a color"
        >
          <input 
            type="color" 
            value={bgColor}
            onChange={(e) => setHex(e.target.value)}
            className="absolute inset-[-50%] w-[200%] h-[200%] opacity-0 cursor-pointer z-10"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
            <span className="text-white font-medium drop-shadow-md">Pick Color</span>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full">
          {/* HEX Input */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">รหัสสี HEX</label>
              {copiedHex && <span className="text-xs font-bold text-emerald-500 mr-1 animate-pulse">Copied!</span>}
            </div>
            <div className="relative">
              <input 
                type="text" 
                className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl pl-5 pr-12 py-3 text-text font-mono text-lg outline-none transition-all shadow-inner"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#FFFFFF"
              />
              <button 
                onClick={() => copyToClipboard(hex, true)} 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all active:scale-95"
                title="Copy HEX"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          {/* RGB Input */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">ค่า RGB</label>
              {copiedRgb && <span className="text-xs font-bold text-emerald-500 mr-1 animate-pulse">Copied!</span>}
            </div>
            <div className="relative">
              <input 
                type="text" 
                className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl pl-5 pr-12 py-3 text-text font-mono text-lg outline-none transition-all shadow-inner"
                value={rgb}
                onChange={(e) => handleRgbChange(e.target.value)}
                placeholder="255, 255, 255"
              />
              <button 
                onClick={() => copyToClipboard(rgb, false)} 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all active:scale-95"
                title="Copy RGB"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
