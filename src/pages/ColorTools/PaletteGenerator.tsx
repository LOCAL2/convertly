import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, Check, Lock, Unlock } from 'lucide-react';

interface ColorBox {
  hex: string;
  locked: boolean;
}

export default function PaletteGenerator() {
  const [palette, setPalette] = useState<ColorBox[]>([
    { hex: '#10B981', locked: false },
    { hex: '#3B82F6', locked: false },
    { hex: '#8B5CF6', locked: false },
    { hex: '#EC4899', locked: false },
    { hex: '#F59E0B', locked: false },
  ]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const generateRandomHex = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
  };

  const randomizePalette = () => {
    setPalette(prev => prev.map(item => item.locked ? item : { ...item, hex: generateRandomHex() }));
  };

  const toggleLock = (index: number) => {
    setPalette(prev => prev.map((item, i) => i === index ? { ...item, locked: !item.locked } : item));
  };

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Color Palette Generator</h1>
        <p className="text-muted font-medium text-lg">Generate random color palettes, lock favorites, and copy HEX codes.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-4xl p-6 md:p-8 flex flex-col gap-6"
      >
        {/* Top Control */}
        <div className="flex justify-between items-center pb-4 border-b border-border">
          <span className="text-xs font-bold text-muted uppercase tracking-widest">5-Color Harmony</span>
          <button
            onClick={randomizePalette}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Generate New Palette
          </button>
        </div>

        {/* Color Palette Display */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 min-h-[300px]">
          {palette.map((color, index) => (
            <div
              key={index}
              style={{ backgroundColor: color.hex }}
              className="relative h-64 sm:h-auto rounded-2xl p-4 flex flex-col justify-between items-center shadow-lg transition-all transform hover:scale-[1.02]"
            >
              <button
                onClick={() => toggleLock(index)}
                className="p-2 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-all"
              >
                {color.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4 opacity-70" />}
              </button>

              <button
                onClick={() => handleCopy(color.hex)}
                className="w-full py-2 px-3 bg-black/30 backdrop-blur-md rounded-xl text-white font-mono text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-black/50 transition-all"
              >
                {copiedHex === color.hex ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedHex === color.hex ? 'Copied' : color.hex}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
