import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight, Copy, Check, RefreshCw } from 'lucide-react';

export default function PercentageCalc() {
  // Mode 1: What is X% of Y?
  const [m1Percent, setM1Percent] = useState<string>('');
  const [m1Total, setM1Total] = useState<string>('');

  // Mode 2: X is what percent of Y?
  const [m2Part, setM2Part] = useState<string>('');
  const [m2Total, setM2Total] = useState<string>('');

  // Mode 3: Percentage Change (From X to Y)
  const [m3From, setM3From] = useState<string>('');
  const [m3To, setM3To] = useState<string>('');

  // Mode 4: Add / Subtract X% from Y
  const [m4Val, setM4Val] = useState<string>('');
  const [m4Percent, setM4Percent] = useState<string>('');
  const [m4Op, setM4Op] = useState<'add' | 'sub'>('add');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Calculations
  const calc1 = () => {
    const p = parseFloat(m1Percent);
    const t = parseFloat(m1Total);
    if (isNaN(p) || isNaN(t)) return null;
    return (p / 100) * t;
  };

  const calc2 = () => {
    const part = parseFloat(m2Part);
    const total = parseFloat(m2Total);
    if (isNaN(part) || isNaN(total) || total === 0) return null;
    return (part / total) * 100;
  };

  const calc3 = () => {
    const from = parseFloat(m3From);
    const to = parseFloat(m3To);
    if (isNaN(from) || isNaN(to) || from === 0) return null;
    const diff = to - from;
    const pct = (diff / from) * 100;
    return { diff, pct };
  };

  const calc4 = () => {
    const val = parseFloat(m4Val);
    const pct = parseFloat(m4Percent);
    if (isNaN(val) || isNaN(pct)) return null;
    const amount = (pct / 100) * val;
    return m4Op === 'add' ? val + amount : val - amount;
  };

  const res1 = calc1();
  const res2 = calc2();
  const res3 = calc3();
  const res4 = calc4();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const resetAll = () => {
    setM1Percent(''); setM1Total('');
    setM2Part(''); setM2Total('');
    setM3From(''); setM3To('');
    setM4Val(''); setM4Percent('');
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      {/* Header */}
      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Percentage Calculator</h1>
        <p className="text-muted font-medium text-lg">คำนวณเปอร์เซ็นต์ ร้อยละ ส่วนต่าง และการเปลี่ยนแปลงอย่างรวดเร็วและแม่นยำ</p>
      </div>

      <div className="w-full max-w-4xl flex justify-end mb-4">
        <button
          onClick={resetAll}
          className="px-3.5 py-2 bg-background hover:bg-surface border border-border rounded-xl text-xs font-bold text-muted hover:text-text transition-all flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> ล้างข้อมูลทั้งหมด
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Card 1: What is X% of Y? */}
        <div className="glass-panel p-6 flex flex-col justify-between gap-5 relative overflow-hidden border border-border/80 hover:border-emerald-500/30 transition-all">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-text text-base">หาค่าจากเปอร์เซ็นต์ (X% ของ Y คือเท่าไหร่?)</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="เช่น 20"
                  value={m1Percent}
                  onChange={(e) => setM1Percent(e.target.value)}
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-text font-semibold text-sm outline-none shadow-inner"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">%</span>
              </div>
              <span className="text-xs font-bold text-muted uppercase">ของ</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="เช่น 500"
                  value={m1Total}
                  onChange={(e) => setM1Total(e.target.value)}
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-text font-semibold text-sm outline-none shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">คำตอบ</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {res1 !== null ? res1.toLocaleString('th-TH', { maximumFractionDigits: 4 }) : '-'}
              </span>
              {res1 !== null && (
                <button
                  onClick={() => handleCopy(res1.toString(), 'c1')}
                  className="p-1.5 hover:bg-surface rounded-lg text-muted hover:text-text transition-all"
                  title="คัดลอกผลลัพธ์"
                >
                  {copiedKey === 'c1' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: X is what percent of Y? */}
        <div className="glass-panel p-6 flex flex-col justify-between gap-5 relative overflow-hidden border border-border/80 hover:border-emerald-500/30 transition-all">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-text text-base">หาสัดส่วนเปอร์เซ็นต์ (X เป็นกี่ % ของ Y?)</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="เช่น 50"
                  value={m2Part}
                  onChange={(e) => setM2Part(e.target.value)}
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-text font-semibold text-sm outline-none shadow-inner"
                />
              </div>
              <span className="text-xs font-bold text-muted uppercase">คิดเป็น % ของ</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="เช่น 200"
                  value={m2Total}
                  onChange={(e) => setM2Total(e.target.value)}
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-text font-semibold text-sm outline-none shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">คำตอบ</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {res2 !== null ? `${res2.toLocaleString('th-TH', { maximumFractionDigits: 4 })}%` : '-'}
              </span>
              {res2 !== null && (
                <button
                  onClick={() => handleCopy(`${res2}%`, 'c2')}
                  className="p-1.5 hover:bg-surface rounded-lg text-muted hover:text-text transition-all"
                  title="คัดลอกผลลัพธ์"
                >
                  {copiedKey === 'c2' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Percentage Change */}
        <div className="glass-panel p-6 flex flex-col justify-between gap-5 relative overflow-hidden border border-border/80 hover:border-emerald-500/30 transition-all">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-text text-base">คำนวณการเปลี่ยนแปลง (จาก X เปลี่ยนเป็น Y)</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="ค่าเดิม (เช่น 100)"
                  value={m3From}
                  onChange={(e) => setM3From(e.target.value)}
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-text font-semibold text-sm outline-none shadow-inner"
                />
              </div>
              <ArrowRight className="w-4 h-4 text-muted shrink-0" />
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="ค่าใหม่ (เช่น 150)"
                  value={m3To}
                  onChange={(e) => setM3To(e.target.value)}
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-text font-semibold text-sm outline-none shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">เปอร์เซ็นต์ส่วนต่าง</span>
            <div className="flex items-center gap-2">
              {res3 !== null ? (
                <div className={`flex items-center gap-1 text-2xl font-extrabold font-mono ${res3.pct >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {res3.pct >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  <span>{res3.pct >= 0 ? '+' : ''}{res3.pct.toLocaleString('th-TH', { maximumFractionDigits: 2 })}%</span>
                </div>
              ) : (
                <span className="text-2xl font-extrabold text-muted font-mono">-</span>
              )}
              {res3 !== null && (
                <button
                  onClick={() => handleCopy(`${res3.pct >= 0 ? '+' : ''}${res3.pct}%`, 'c3')}
                  className="p-1.5 hover:bg-surface rounded-lg text-muted hover:text-text transition-all"
                  title="คัดลอกผลลัพธ์"
                >
                  {copiedKey === 'c3' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Card 4: Add / Subtract Percentage */}
        <div className="glass-panel p-6 flex flex-col justify-between gap-5 relative overflow-hidden border border-border/80 hover:border-emerald-500/30 transition-all">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h3 className="font-bold text-text text-base">บวก/ลบ เปอร์เซ็นต์ออกจากจำนวน</h3>
              </div>
              
              <div className="flex bg-background border border-border rounded-xl p-1 gap-1">
                <button
                  onClick={() => setM4Op('add')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${m4Op === 'add' ? 'bg-emerald-500 text-white shadow-sm' : 'text-muted hover:text-text'}`}
                >
                  + เพิ่ม
                </button>
                <button
                  onClick={() => setM4Op('sub')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${m4Op === 'sub' ? 'bg-rose-500 text-white shadow-sm' : 'text-muted hover:text-text'}`}
                >
                  - ลด
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="จำนวนเริ่มต้น (เช่น 1000)"
                  value={m4Val}
                  onChange={(e) => setM4Val(e.target.value)}
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-text font-semibold text-sm outline-none shadow-inner"
                />
              </div>
              <span className="text-xs font-bold text-muted uppercase">{m4Op === 'add' ? '+' : '-'}</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="เช่น 7 (VAT)"
                  value={m4Percent}
                  onChange={(e) => setM4Percent(e.target.value)}
                  className="w-full bg-background border border-border focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-text font-semibold text-sm outline-none shadow-inner"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">%</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">ผลลัพธ์สุทธิ</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {res4 !== null ? res4.toLocaleString('th-TH', { maximumFractionDigits: 4 }) : '-'}
              </span>
              {res4 !== null && (
                <button
                  onClick={() => handleCopy(res4.toString(), 'c4')}
                  className="p-1.5 hover:bg-surface rounded-lg text-muted hover:text-text transition-all"
                  title="คัดลอกผลลัพธ์"
                >
                  {copiedKey === 'c4' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
