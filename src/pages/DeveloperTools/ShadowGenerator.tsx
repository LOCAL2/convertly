import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Copy, Check } from 'lucide-react';

export default function ShadowGenerator() {
  const [tab, setTab] = useState<'boxShadow' | 'neumorphism'>('boxShadow');

  // Box Shadow State
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(10);
  const [blur, setBlur] = useState<number>(25);
  const [spread, setSpread] = useState<number>(-5);
  const [shadowColor, setShadowColor] = useState<string>('#8b5cf6');
  const [shadowOpacity, setShadowOpacity] = useState<number>(0.3);
  const [inset, setInset] = useState<boolean>(false);

  // Neumorphism State
  const [neuRadius, setNeuRadius] = useState<number>(30);
  const [neuDistance, setNeuDistance] = useState<number>(20);
  const [neuBlur, setNeuBlur] = useState<number>(40);
  const [neuBg, setNeuBg] = useState<string>('#0f172a');

  const [copied, setCopied] = useState<boolean>(false);

  // Helpers
  const hexToRgba = (hex: string, alpha: number) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map((x) => x + x).join('');
    const num = parseInt(c, 16);
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
  };

  const getBoxShadowCss = () => {
    const rgba = hexToRgba(shadowColor, shadowOpacity);
    const insetStr = inset ? 'inset ' : '';
    return `box-shadow: ${insetStr}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${rgba};`;
  };

  const getNeumorphismCss = () => {
    // Generate light/dark shadow colors based on background
    return `background: ${neuBg};
border-radius: ${neuRadius}px;
box-shadow: ${neuDistance}px ${neuDistance}px ${neuBlur}px rgba(0, 0, 0, 0.5),
            -${neuDistance}px -${neuDistance}px ${neuBlur}px rgba(255, 255, 255, 0.05);`;
  };

  const cssCode = tab === 'boxShadow' ? getBoxShadowCss() : getNeumorphismCss();

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 px-4 md:px-8 z-10">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 uppercase tracking-wider">
            <Layers size={18} />
            <span>Developer Tools</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">
            Box Shadow & Neumorphism Generator
          </h1>
          <p className="text-muted text-sm font-medium mt-1">
            ปรับแต่งเงา UI Box Shadow หรือ Neumorphism แบบ Soft-UI แบบเรียลไทม์ และคัดลอกโค้ดไปใช้
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-surface p-1.5 rounded-2xl border border-border">
          <button
            onClick={() => setTab('boxShadow')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === 'boxShadow' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-text'
            }`}
          >
            Box Shadow Standard
          </button>
          <button
            onClick={() => setTab('neumorphism')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === 'neumorphism' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-text'
            }`}
          >
            Neumorphism Soft UI
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl">
        {/* Controls */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-6 flex flex-col gap-5">
            <h2 className="text-base font-bold text-text mb-1">
              {tab === 'boxShadow' ? 'ตั้งค่า Box Shadow' : 'ตั้งค่า Neumorphism'}
            </h2>

            {tab === 'boxShadow' ? (
              <>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted">Offset X:</span>
                    <span className="text-primary font-mono">{offsetX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={offsetX}
                    onChange={(e) => setOffsetX(Number(e.target.value))}
                    className="w-full accent-primary bg-background cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted">Offset Y:</span>
                    <span className="text-primary font-mono">{offsetY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={offsetY}
                    onChange={(e) => setOffsetY(Number(e.target.value))}
                    className="w-full accent-primary bg-background cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted">Blur Radius:</span>
                    <span className="text-primary font-mono">{blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={blur}
                    onChange={(e) => setBlur(Number(e.target.value))}
                    className="w-full accent-primary bg-background cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted">Spread Radius:</span>
                    <span className="text-primary font-mono">{spread}px</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="50"
                    value={spread}
                    onChange={(e) => setSpread(Number(e.target.value))}
                    className="w-full accent-primary bg-background cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted">Shadow Opacity:</span>
                    <span className="text-primary font-mono">{Math.round(shadowOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={shadowOpacity}
                    onChange={(e) => setShadowOpacity(Number(e.target.value))}
                    className="w-full accent-primary bg-background cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-muted uppercase">Shadow Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={shadowColor}
                      onChange={(e) => setShadowColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                    <span className="text-xs font-mono text-text">{shadowColor}</span>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-text font-medium cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={inset}
                    onChange={(e) => setInset(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary/50 bg-background w-4 h-4"
                  />
                  <span>Inset Shadow (เงาด้านใน)</span>
                </label>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted">Distance:</span>
                    <span className="text-primary font-mono">{neuDistance}px</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={neuDistance}
                    onChange={(e) => setNeuDistance(Number(e.target.value))}
                    className="w-full accent-primary bg-background cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted">Blur:</span>
                    <span className="text-primary font-mono">{neuBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={neuBlur}
                    onChange={(e) => setNeuBlur(Number(e.target.value))}
                    className="w-full accent-primary bg-background cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted">Border Radius:</span>
                    <span className="text-primary font-mono">{neuRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={neuRadius}
                    onChange={(e) => setNeuRadius(Number(e.target.value))}
                    className="w-full accent-primary bg-background cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-muted uppercase">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={neuBg}
                      onChange={(e) => setNeuBg(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                    <span className="text-xs font-mono text-text">{neuBg}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Live Preview Box & Output */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-7 flex flex-col gap-6">
          <div
            className="w-full h-80 rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden"
            style={{ background: tab === 'neumorphism' ? neuBg : '#0f172a' }}
          >
            {tab === 'boxShadow' ? (
              <div
                className="w-56 h-56 rounded-2xl bg-surface border border-white/10 flex items-center justify-center text-text font-bold text-sm"
                style={{
                  boxShadow: `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${hexToRgba(
                    shadowColor,
                    shadowOpacity
                  )}`,
                }}
              >
                Box Shadow Target
              </div>
            ) : (
              <div
                className="w-56 h-56 flex items-center justify-center text-text font-bold text-sm"
                style={{
                  background: neuBg,
                  borderRadius: `${neuRadius}px`,
                  boxShadow: `${neuDistance}px ${neuDistance}px ${neuBlur}px rgba(0, 0, 0, 0.5), -${neuDistance}px -${neuDistance}px ${neuBlur}px rgba(255, 255, 255, 0.05)`,
                }}
              >
                Neumorphic Card
              </div>
            )}
          </div>

          {/* CSS Output */}
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

            <pre className="w-full bg-background/80 p-4 rounded-xl text-xs font-mono text-purple-300 overflow-x-auto border border-border whitespace-pre-wrap">
              {cssCode}
            </pre>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
