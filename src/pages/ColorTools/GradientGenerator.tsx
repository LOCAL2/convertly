import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';

export default function GradientGenerator() {
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState<number>(90);
  const [color1, setColor1] = useState<string>('#8b5cf6');
  const [color2, setColor2] = useState<string>('#ec4899');
  const [color3, setColor3] = useState<string>('#3b82f6');
  const [useThreeColors, setUseThreeColors] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const getGradientCss = () => {
    if (type === 'linear') {
      return useThreeColors
        ? `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3})`
        : `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    } else {
      return useThreeColors
        ? `radial-gradient(circle, ${color1}, ${color2}, ${color3})`
        : `radial-gradient(circle, ${color1}, ${color2})`;
    }
  };

  const gradientCss = getGradientCss();
  const cssCode = `background: ${gradientCss};`;

  const presetGradients = [
    { name: 'Purple Sunset', c1: '#8b5cf6', c2: '#ec4899', c3: '#3b82f6', three: false, angle: 90 },
    { name: 'Ocean Breeze', c1: '#06b6d4', c2: '#3b82f6', c3: '#6366f1', three: false, angle: 135 },
    { name: 'Neon Glow', c1: '#f43f5e', c2: '#8b5cf6', c3: '#06b6d4', three: true, angle: 45 },
    { name: 'Emerald Forest', c1: '#10b981', c2: '#059669', c3: '#047857', three: false, angle: 180 },
    { name: 'Peach Glow', c1: '#f97316', c2: '#e11d48', c3: '#9333ea', three: true, angle: 90 },
    { name: 'Midnight Cyber', c1: '#0f172a', c2: '#581c87', c3: '#0284c7', three: true, angle: 135 },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRandomize = () => {
    const randomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setColor1(randomHex());
    setColor2(randomHex());
    if (useThreeColors) setColor3(randomHex());
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 px-4 md:px-8 z-10">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 uppercase tracking-wider">
            <Palette size={18} />
            <span>Color Tools</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">CSS Gradient Generator</h1>
          <p className="text-muted text-sm font-medium mt-1">
            เครื่องมือสร้างสีไล่เฉด (Linear / Radial) ปรับแต่งเรียลไทม์ พร้อมคัดลอกโค้ด CSS นำไปใช้ได้ทันที
          </p>
        </div>

        <button
          onClick={handleRandomize}
          className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all active:scale-95"
        >
          <RefreshCw size={16} />
          <span>สุ่มสี (Random)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl">
        {/* Left Controls */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-6 flex flex-col gap-5">
            <h2 className="text-base font-bold text-text mb-1">การตั้งค่า Gradient</h2>

            {/* Type Switcher */}
            <div className="flex items-center gap-2 bg-surface p-1 rounded-xl border border-border">
              <button
                onClick={() => setType('linear')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  type === 'linear' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-text'
                }`}
              >
                Linear (เส้นตรง)
              </button>
              <button
                onClick={() => setType('radial')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  type === 'radial' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-text'
                }`}
              >
                Radial (วงกลม)
              </button>
            </div>

            {/* Angle Slider (if Linear) */}
            {type === 'linear' && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted">มุมองศา (Angle):</span>
                  <span className="text-primary font-mono">{angle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full accent-primary bg-background cursor-pointer"
                />
              </div>
            )}

            {/* Color Selectors */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-muted uppercase">สีที่ 1 (Color 1)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                  />
                  <span className="text-xs font-mono text-text">{color1}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-muted uppercase">สีที่ 2 (Color 2)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                  />
                  <span className="text-xs font-mono text-text">{color2}</span>
                </div>
              </div>

              {useThreeColors && (
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-muted uppercase">สีที่ 3 (Color 3)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color3}
                      onChange={(e) => setColor3(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                    <span className="text-xs font-mono text-text">{color3}</span>
                  </div>
                </div>
              )}

              <label className="flex items-center gap-2 text-xs text-text font-medium cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={useThreeColors}
                  onChange={(e) => setUseThreeColors(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary/50 bg-background w-4 h-4"
                />
                <span>เพิ่มสีที่ 3 (3-Color Stop)</span>
              </label>
            </div>
          </div>

          {/* Presets */}
          <div className="glass-panel p-6">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>ชุดสีสำเร็จรูป (Presets)</span>
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {presetGradients.map((p) => {
                const bg = p.three
                  ? `linear-gradient(${p.angle}deg, ${p.c1}, ${p.c2}, ${p.c3})`
                  : `linear-gradient(${p.angle}deg, ${p.c1}, ${p.c2})`;
                return (
                  <button
                    key={p.name}
                    onClick={() => {
                      setColor1(p.c1);
                      setColor2(p.c2);
                      setColor3(p.c3);
                      setUseThreeColors(p.three);
                      setAngle(p.angle);
                      setType('linear');
                    }}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-surface border border-border hover:border-primary/50 transition-all text-left group"
                  >
                    <div className="w-6 h-6 rounded-lg shadow-inner flex-shrink-0" style={{ background: bg }} />
                    <span className="text-xs font-bold text-muted group-hover:text-text truncate">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Preview */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-7 flex flex-col gap-6">
          {/* Live Preview Box */}
          <div
            className="w-full h-80 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden group"
            style={{ background: gradientCss }}
          >
            <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-white font-mono text-sm shadow-lg">
              Live Gradient Preview
            </div>
          </div>

          {/* CSS Code Display */}
          <div className="glass-panel p-5 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">CSS Code</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก CSS'}</span>
              </button>
            </div>

            <pre className="w-full bg-background/80 p-4 rounded-xl text-xs font-mono text-purple-300 overflow-x-auto border border-border">
              {cssCode}
            </pre>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
