import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Layers } from 'lucide-react';

export default function GlassmorphismGenerator() {
  const [blur, setBlur] = useState<number>(12);
  const [opacity, setOpacity] = useState<number>(20);
  const [borderOpacity, setBorderOpacity] = useState<number>(30);
  const [borderRadius, setBorderRadius] = useState<number>(24);
  const [copied, setCopied] = useState<boolean>(false);

  const glassStyle = {
    background: `rgba(255, 255, 255, ${opacity / 100})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    borderRadius: `${borderRadius}px`,
    border: `1px solid rgba(255, 255, 255, ${borderOpacity / 100})`,
  };

  const cssCode = `/* Glassmorphism Style */
background: rgba(255, 255, 255, ${opacity / 100});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: ${borderRadius}px;
border: 1px solid rgba(255, 255, 255, ${borderOpacity / 100});`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Glassmorphism Generator</h1>
        <p className="text-muted font-medium text-lg">Customize CSS glass effect sliders and copy Tailwind or CSS code.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-4xl p-6 md:p-8 flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Sliders Control */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-muted uppercase tracking-wider">
                <span>Blur ({blur}px)</span>
              </div>
              <input 
                type="range" min="0" max="40" value={blur} 
                onChange={(e) => setBlur(Number(e.target.value))}
                className="accent-emerald-500 cursor-pointer w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-muted uppercase tracking-wider">
                <span>Background Opacity ({opacity}%)</span>
              </div>
              <input 
                type="range" min="0" max="100" value={opacity} 
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="accent-emerald-500 cursor-pointer w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-muted uppercase tracking-wider">
                <span>Border Opacity ({borderOpacity}%)</span>
              </div>
              <input 
                type="range" min="0" max="100" value={borderOpacity} 
                onChange={(e) => setBorderOpacity(Number(e.target.value))}
                className="accent-emerald-500 cursor-pointer w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-muted uppercase tracking-wider">
                <span>Border Radius ({borderRadius}px)</span>
              </div>
              <input 
                type="range" min="0" max="50" value={borderRadius} 
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className="accent-emerald-500 cursor-pointer w-full"
              />
            </div>
          </div>

          {/* Live Glass Preview Card */}
          <div className="relative w-full h-64 rounded-3xl bg-gradient-to-tr from-purple-500 via-pink-500 to-emerald-400 p-6 flex items-center justify-center shadow-xl overflow-hidden">
            <div className="absolute w-32 h-32 bg-yellow-300 rounded-full blur-xl top-4 left-4" />
            <div className="absolute w-40 h-40 bg-blue-500 rounded-full blur-xl bottom-4 right-4" />
            
            <div 
              style={glassStyle}
              className="relative w-full h-full max-w-xs p-6 flex flex-col justify-center items-center text-center shadow-2xl transition-all"
            >
              <Layers className="w-8 h-8 text-white mb-2 drop-shadow-md" />
              <h3 className="text-xl font-bold text-white drop-shadow">Glass Card</h3>
              <p className="text-xs text-white/80 mt-1">Live Glassmorphism UI</p>
            </div>
          </div>
        </div>

        {/* Code Output */}
        <div className="flex flex-col gap-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted uppercase tracking-widest">CSS Output</span>
            <button
              onClick={() => handleCopy(cssCode)}
              className="px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-bold text-text hover:bg-surface transition-all flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied CSS' : 'Copy CSS'}
            </button>
          </div>
          <textarea
            readOnly
            className="w-full bg-background border border-border rounded-2xl p-4 text-emerald-600 dark:text-emerald-400 font-mono text-sm outline-none resize-none shadow-inner"
            rows={5}
            value={cssCode}
          />
        </div>
      </motion.div>
    </div>
  );
}
