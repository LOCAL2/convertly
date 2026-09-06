import { useState } from 'react';
import { motion } from 'framer-motion';

const PRESET_RATIOS = [
  { label: '16:9 (Widescreen Video)', ratioW: 16, ratioH: 9 },
  { label: '4:3 (Standard Display)', ratioW: 4, ratioH: 3 },
  { label: '1:1 (Square Post)', ratioW: 1, ratioH: 1 },
  { label: '9:16 (Story / Shorts)', ratioW: 9, ratioH: 16 },
  { label: '21:9 (Ultrawide)', ratioW: 21, ratioH: 9 },
];

export default function AspectRatioCalc() {
  const [width, setWidth] = useState<string>('1920');
  const [height, setHeight] = useState<string>('1080');
  const [ratioW, setRatioW] = useState<number>(16);
  const [ratioH, setRatioH] = useState<number>(9);

  const handleWidthChange = (val: string) => {
    setWidth(val);
    const num = parseFloat(val);
    if (!isNaN(num) && ratioW > 0) {
      setHeight(Math.round((num * ratioH) / ratioW).toString());
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    const num = parseFloat(val);
    if (!isNaN(num) && ratioH > 0) {
      setWidth(Math.round((num * ratioW) / ratioH).toString());
    }
  };

  const applyPreset = (w: number, h: number) => {
    setRatioW(w);
    setRatioH(h);
    const numW = parseFloat(width) || 1920;
    setHeight(Math.round((numW * h) / w).toString());
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-3xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Aspect Ratio Calculator</h1>
        <p className="text-muted font-medium text-lg">Calculate dimensions and pixel ratios for banners and videos.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-3xl p-8 md:p-10 flex flex-col gap-8"
      >
        {/* Presets */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Popular Presets</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_RATIOS.map((item, i) => (
              <button
                key={i}
                onClick={() => applyPreset(item.ratioW, item.ratioH)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  ratioW === item.ratioW && ratioH === item.ratioH
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                    : 'bg-background border-border text-muted hover:text-text'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Width (px)</label>
            <input 
              type="number" 
              className="w-full bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-xl px-4 py-3 text-text font-bold text-lg outline-none shadow-inner"
              value={width}
              onChange={(e) => handleWidthChange(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Height (px)</label>
            <input 
              type="number" 
              className="w-full bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-xl px-4 py-3 text-text font-bold text-lg outline-none shadow-inner"
              value={height}
              onChange={(e) => handleHeightChange(e.target.value)}
            />
          </div>
        </div>

        {/* Aspect Visualizer Box */}
        <div className="p-6 bg-surface border border-border rounded-2xl flex flex-col items-center justify-center gap-4">
          <div className="text-xs font-bold text-muted uppercase tracking-wider">Visual Proportion ({ratioW}:{ratioH})</div>
          <div 
            style={{ aspectRatio: `${ratioW} / ${ratioH}` }}
            className="w-full max-w-md h-40 bg-emerald-500/10 border-2 border-dashed border-emerald-500 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg shadow-inner"
          >
            {width || 0} x {height || 0} px
          </div>
        </div>
      </motion.div>
    </div>
  );
}
