import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState<string>('100000');
  const [rate, setRate] = useState<string>('5');
  const [years, setYears] = useState<string>('10');

  const [results, setResults] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
  } | null>(null);

  useEffect(() => {
    calculate();
  }, [principal, rate, years]);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12; // monthly interest rate
    const n = parseFloat(years) * 12; // number of months

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || n <= 0) {
      setResults(null);
      return;
    }

    let monthly = 0;
    if (r === 0) {
      monthly = p / n;
    } else {
      monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const total = monthly * n;
    const interest = total - p;

    setResults({
      monthlyPayment: monthly,
      totalPayment: total,
      totalInterest: interest
    });
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="w-full max-w-2xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">เครื่องมือคำนวณสินเชื่อ</h1>
        <p className="text-muted font-medium text-lg">คำนวณค่างวดสินเชื่อหรือการจำนองรายเดือน</p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel w-full max-w-4xl p-8 flex flex-col md:flex-row gap-8"
      >
        {/* Input Form */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2 relative">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">วงเงินกู้</label>
            <input 
              type="number"
              className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl p-4 text-text font-medium text-lg outline-none shadow-inner"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-2 relative">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">อัตราดอกเบี้ย (%)</label>
            <input 
              type="number"
              className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl p-4 text-text font-medium text-lg outline-none shadow-inner"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">ระยะเวลากู้ (ปี)</label>
            <input 
              type="number"
              className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl p-4 text-text font-medium text-lg outline-none shadow-inner"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="p-6 bg-surface border border-border rounded-xl flex flex-col gap-2 shadow-sm h-full justify-center text-center">
            {results ? (
              <>
                <div className="mb-4">
                  <span className="text-xs font-bold text-muted uppercase tracking-widest block mb-2">ยอดผ่อนต่อเดือน</span>
                  <div className="text-4xl font-bold text-primary">{formatCurrency(results.monthlyPayment)}</div>
                </div>
                <div className="h-px w-full bg-border my-2"></div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-muted">เงินต้นรวม</span>
                  <span className="font-bold text-text">{formatCurrency(parseFloat(principal) || 0)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-muted">ดอกเบี้ยรวม</span>
                  <span className="font-bold text-text">{formatCurrency(results.totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-muted">ยอดชำระรวม</span>
                  <span className="font-bold text-text">{formatCurrency(results.totalPayment)}</span>
                </div>
              </>
            ) : (
              <div className="text-muted font-medium">Please enter valid loan details to see results.</div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
