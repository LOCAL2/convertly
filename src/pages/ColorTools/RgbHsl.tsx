import { useState } from 'react';
import { motion } from 'framer-motion';

export default function RgbHsl() {
  const [rgb, setRgb] = useState('139, 92, 246');
  const [hsl, setHsl] = useState('258, 90%, 66%');
  const [bgColor, setBgColor] = useState('rgb(139, 92, 246)');

  // RGB to HSL logic
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
  };

  // HSL to RGB logic
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l; 
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`;
  };

  const handleRgbChange = (val: string) => {
    setRgb(val);
    const parts = val.split(',').map(s => parseInt(s.trim()));
    if (parts.length === 3 && parts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
      setHsl(rgbToHsl(parts[0], parts[1], parts[2]));
      setBgColor(`rgb(${parts[0]}, ${parts[1]}, ${parts[2]})`);
    }
  };

  const handleHslChange = (val: string) => {
    setHsl(val);
    // Parse things like "258, 90%, 66%" or "258 90 66"
    const numbers = val.replace(/%/g, '').split(/[,\s]+/).filter(Boolean).map(s => parseFloat(s));
    if (numbers.length === 3 && !numbers.some(isNaN)) {
      const newRgb = hslToRgb(numbers[0], numbers[1], numbers[2]);
      setRgb(newRgb);
      setBgColor(`rgb(${newRgb})`);
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 blur-[120px] rounded-full pointer-events-none z-[-1] transition-colors duration-500 opacity-20 dark:opacity-30" 
        style={{ backgroundColor: bgColor }}
      />

      <div className="w-full max-w-2xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">RGB ↔ HSL</h1>
        <p className="text-muted font-medium text-lg">แปลงรหัสสีระหว่างรูปแบบ RGB และ HSL</p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel w-full max-w-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center"
      >
        <div 
          className="relative w-32 h-32 md:w-48 md:h-48 rounded-2xl shadow-inner border border-black/10 dark:border-white/20 flex-shrink-0 transition-colors duration-300"
          style={{ backgroundColor: bgColor }}
        />

        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">ค่า RGB</label>
            <input 
              type="text" 
              className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl px-5 py-3 text-text font-mono text-lg outline-none transition-all shadow-inner"
              value={rgb}
              onChange={(e) => handleRgbChange(e.target.value)}
              placeholder="139, 92, 246"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">ค่า HSL</label>
            <input 
              type="text" 
              className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl px-5 py-3 text-text font-mono text-lg outline-none transition-all shadow-inner"
              value={hsl}
              onChange={(e) => handleHslChange(e.target.value)}
              placeholder="258, 90%, 66%"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
