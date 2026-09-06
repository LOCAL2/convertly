import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Check, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

export default function ContrastChecker() {
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [bgColor, setBgColor] = useState<string>('#8b5cf6');

  // Calculate Relative Luminance
  const getLuminance = (hex: string) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map((x) => x + x).join('');
    const num = parseInt(c, 16);
    const r = ((num >> 16) & 255) / 255;
    const g = ((num >> 8) & 255) / 255;
    const b = (num & 255) / 255;

    const a = [r, g, b].map((v) => {
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  // Calculate Contrast Ratio
  const getContrastRatio = (c1: string, c2: string) => {
    const l1 = getLuminance(c1);
    const l2 = getLuminance(c2);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return Math.round(ratio * 100) / 100;
  };

  const ratio = getContrastRatio(textColor, bgColor);

  // WCAG Criteria
  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3.0;
  const aaaNormal = ratio >= 7.0;
  const aaaLarge = ratio >= 4.5;

  const handleSwap = () => {
    const temp = textColor;
    setTextColor(bgColor);
    setBgColor(temp);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 px-4 md:px-8 z-10">
      {/* Header */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 uppercase tracking-wider">
            <ShieldCheck size={18} />
            <span>Color Tools</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">Color Contrast Checker</h1>
          <p className="text-muted text-sm font-medium mt-1">
            ตรวจสอบความเปรียบต่างของสีข้อความและพื้นหลังตามมาตรฐาน WCAG Accessibility (AA / AAA)
          </p>
        </div>

        <button
          onClick={handleSwap}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-border hover:bg-black/5 dark:hover:bg-white/10 text-text rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <RefreshCw size={16} />
          <span>สลับสี (Swap Colors)</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-5xl">
        {/* Left Inputs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-6 flex flex-col gap-6">
            <h2 className="text-base font-bold text-text">เลือกสีที่ต้องการตรวจสอบ</h2>

            {/* Text Color Picker */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-muted uppercase">สีตัวอักษร (Text Color)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-24 px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-mono text-text outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Background Color Picker */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-muted uppercase">สีพื้นหลัง (Background Color)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-24 px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-mono text-text outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Contrast Score Card */}
          <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-muted uppercase tracking-wider mb-2">อัตราส่วนความเปรียบต่าง</span>
            <div className="text-5xl font-black text-primary font-mono mb-2">{ratio}:1</div>
            <p className="text-xs text-muted font-medium">
              {ratio >= 7
                ? '🌟 ดีเยี่ยม! ผ่านเกณฑ์ระดับสูงสุด (AAA)'
                : ratio >= 4.5
                ? '✅ ผ่านเกณฑ์มาตรฐานระดับทั่วไป (AA)'
                : ratio >= 3.0
                ? '⚠️ ผ่านเกณฑ์เฉพาะข้อความขนาดใหญ่เท่านั้น'
                : '❌ ความเปรียบต่างต่ำเกินไป อ่านยาก'}
            </p>
          </div>
        </motion.div>

        {/* Right Live Preview & WCAG Checklist */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-7 flex flex-col gap-6">
          {/* Preview Box */}
          <div
            className="w-full p-8 rounded-3xl border border-white/10 flex flex-col gap-4 shadow-xl"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">Live Text Preview</span>
            <h2 className="text-3xl font-black tracking-tight">ข้อความพาดหัวขนาดใหญ่ (Header Text)</h2>
            <p className="text-base font-normal leading-relaxed">
              นี่คือตัวอย่างการแสดงผลข้อความขนาดปกติบนพื้นหลัง เพื่อทดสอบว่าผู้ใช้งานสามารถอ่านเนื้อหาได้อย่างสบายตาหรือไม่
            </p>
          </div>

          {/* WCAG Audit Checklist */}
          <div className="glass-panel p-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-2">ผลการตรวจสอบเกณฑ์ WCAG 2.1</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* AA Normal */}
              <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-text">WCAG AA (Normal Text)</div>
                  <div className="text-[11px] text-muted">อัตราส่วนขั้นต่ำ 4.5:1</div>
                </div>
                {aaNormal ? (
                  <span className="flex items-center gap-1 text-green-400 font-bold text-xs bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                    <Check size={14} /> Pass
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400 font-bold text-xs bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                    <XCircle size={14} /> Fail
                  </span>
                )}
              </div>

              {/* AA Large */}
              <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-text">WCAG AA (Large Text)</div>
                  <div className="text-[11px] text-muted">อัตราส่วนขั้นต่ำ 3.0:1</div>
                </div>
                {aaLarge ? (
                  <span className="flex items-center gap-1 text-green-400 font-bold text-xs bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                    <Check size={14} /> Pass
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400 font-bold text-xs bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                    <XCircle size={14} /> Fail
                  </span>
                )}
              </div>

              {/* AAA Normal */}
              <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-text">WCAG AAA (Normal Text)</div>
                  <div className="text-[11px] text-muted">อัตราส่วนขั้นต่ำ 7.0:1</div>
                </div>
                {aaaNormal ? (
                  <span className="flex items-center gap-1 text-green-400 font-bold text-xs bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                    <Check size={14} /> Pass
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    <AlertTriangle size={14} /> Fail
                  </span>
                )}
              </div>

              {/* AAA Large */}
              <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-text">WCAG AAA (Large Text)</div>
                  <div className="text-[11px] text-muted">อัตราส่วนขั้นต่ำ 4.5:1</div>
                </div>
                {aaaLarge ? (
                  <span className="flex items-center gap-1 text-green-400 font-bold text-xs bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                    <Check size={14} /> Pass
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    <AlertTriangle size={14} /> Fail
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
