import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState<string>('');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [years, setYears] = useState<string>('');

  const p = parseFloat(principal) || 0;
  const pmt = parseFloat(monthlyContribution) || 0;
  const r = (parseFloat(interestRate) || 0) / 100 / 12;
  const n = (parseFloat(years) || 0) * 12;

  // Calculate future value with monthly compounding
  let totalBalance = p;
  let totalDeposited = p;

  for (let i = 0; i < n; i++) {
    totalBalance = (totalBalance + pmt) * (1 + r);
    totalDeposited += pmt;
  }

  const totalInterest = Math.max(0, totalBalance - totalDeposited);

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Compound Interest Calculator</h1>
        <p className="text-muted font-medium text-lg">คำนวณการเติบโตของการลงทุนและดอกเบี้ยทบต้นระยะยาว</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-4xl p-6 md:p-8 flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">เงินต้นเริ่มแรก ($ / ฿)</label>
            <input 
              type="number" 
              className="w-full bg-background border border-border focus:border-emerald-500/50 rounded-xl px-4 py-3 text-text font-bold text-lg outline-none shadow-inner"
              value={principal}
              placeholder="เช่น 100000"
              onChange={(e) => setPrincipal(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">เงินออมสะสมเพิ่มรายเดือน</label>
            <input 
              type="number" 
              className="w-full bg-background border border-border focus:border-emerald-500/50 rounded-xl px-4 py-3 text-text font-bold text-lg outline-none shadow-inner"
              value={monthlyContribution}
              placeholder="เช่น 5000"
              onChange={(e) => setMonthlyContribution(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">อัตราดอกเบี้ยหรือผลตอบแทนต่อปี (%)</label>
            <input 
              type="number" 
              className="w-full bg-background border border-border focus:border-emerald-500/50 rounded-xl px-4 py-3 text-text font-bold text-lg outline-none shadow-inner"
              value={interestRate}
              placeholder="เช่น 7"
              onChange={(e) => setInterestRate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">ระยะเวลาการลงทุน (ปี)</label>
            <input 
              type="number" 
              className="w-full bg-background border border-border focus:border-emerald-500/50 rounded-xl px-4 py-3 text-text font-bold text-lg outline-none shadow-inner"
              value={years}
              placeholder="เช่น 10"
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">เงินต้นสะสมรวม</span>
            <span className="text-xl font-bold text-text mt-1">
              {totalDeposited.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>

          <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">ดอกเบี้ย/ผลตอบแทนรวมที่ได้รับ</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              +{totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>

          <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1 sm:col-span-3 md:col-span-1">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">ยอดเงินรวมในอนาคต</span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {totalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
