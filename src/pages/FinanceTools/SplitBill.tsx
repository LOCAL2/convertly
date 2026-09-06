import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function SplitBill() {
  const [billAmount, setBillAmount] = useState<string>('');
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [customTip, setCustomTip] = useState<string>('');
  const [peopleCount, setPeopleCount] = useState<number>(4);

  const bill = parseFloat(billAmount) || 0;
  const tipPct = customTip !== '' ? parseFloat(customTip) || 0 : tipPercent;
  const people = peopleCount > 0 ? peopleCount : 1;

  const tipTotal = bill * (tipPct / 100);
  const totalAmount = bill + tipTotal;
  const perPersonTotal = totalAmount / people;
  const perPersonTip = tipTotal / people;

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-2xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Split Bill & Tip Calculator</h1>
        <p className="text-muted font-medium text-lg">คำนวณค่าทิปและหารค่าใช้จ่ายกับเพื่อนๆ ได้อย่างเที่ยงตรงและรวดเร็ว</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-2xl p-8 md:p-10 flex flex-col gap-8"
      >
        <div className="flex flex-col gap-6">
          {/* Bill Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">ยอดรวมบิลทั้งหมด</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">$ / ฿</span>
              <input 
                type="number" 
                className="w-full bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-xl pl-16 pr-4 py-3 text-text font-medium text-lg outline-none shadow-inner"
                value={billAmount}
                placeholder="เช่น 1000"
                onChange={(e) => setBillAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Tip Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">เปอร์เซ็นต์ทิป (Tip %)</label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {[0, 5, 10, 15, 20].map((pct) => (
                <button
                  key={pct}
                  className={`py-2.5 rounded-xl font-bold text-sm border transition-all ${
                    customTip === '' && tipPercent === pct 
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' 
                      : 'bg-background border-border text-text hover:border-emerald-500/40'
                  }`}
                  onClick={() => {
                    setTipPercent(pct);
                    setCustomTip('');
                  }}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* People Count */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">จำนวนคนหาร (จำนวนคน)</label>
            <div className="flex items-center gap-4">
              <button 
                className="w-12 h-12 rounded-xl bg-background border border-border text-text font-bold text-xl hover:bg-surface transition-colors flex items-center justify-center shadow-inner"
                onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
              >
                -
              </button>
              <div className="flex-1 relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
                <input 
                  type="number" 
                  min="1"
                  className="w-full bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-xl pl-12 pr-4 py-3 text-text font-bold text-center text-xl outline-none shadow-inner"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
              <button 
                className="w-12 h-12 rounded-xl bg-background border border-border text-text font-bold text-xl hover:bg-surface transition-colors flex items-center justify-center shadow-inner"
                onClick={() => setPeopleCount(peopleCount + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Output Summary */}
        <div className="p-6 bg-surface border border-border rounded-2xl flex flex-col gap-4 shadow-sm">
          <div className="flex justify-between items-center text-muted font-medium pb-3 border-b border-border">
            <span>ยอดรวมทิป ({tipPct}%)</span>
            <span className="font-semibold text-text">฿{tipTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-muted font-medium pb-3 border-b border-border">
            <span>ยอดรวมบิล + ทิป</span>
            <span className="font-semibold text-text">฿{totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-muted font-medium pb-3 border-b border-border">
            <span>ค่าทิปต่อคน</span>
            <span className="font-semibold text-text">฿{perPersonTip.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div>
              <span className="text-xl font-bold text-text block">ยอดจ่ายต่อคน</span>
              <span className="text-xs text-muted font-medium">แบ่งจ่ายจำนวน {people} คน</span>
            </div>
            <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              ฿{perPersonTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
