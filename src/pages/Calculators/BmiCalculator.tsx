import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BmiCalculator() {
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('175');
  
  const [results, setResults] = useState<{
    bmi: string;
    category: string;
    color: string;
  } | null>(null);

  useEffect(() => {
    calculate();
  }, [weight, height]);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // cm to m

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      setResults(null);
      return;
    }

    const bmiValue = w / (h * h);
    
    let category = '';
    let color = '';

    if (bmiValue < 18.5) {
      category = 'น้ำหนักต่ำกว่าเกณฑ์';
      color = 'text-blue-500';
    } else if (bmiValue < 25) {
      category = 'น้ำหนักปกติ';
      color = 'text-emerald-500';
    } else if (bmiValue < 30) {
      category = 'น้ำหนักเกินเกณฑ์';
      color = 'text-amber-500';
    } else {
      category = 'โรคอ้วน';
      color = 'text-red-500';
    }

    setResults({
      bmi: bmiValue.toFixed(1),
      category,
      color
    });
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="w-full max-w-2xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">เครื่องมือคำนวณ BMI</h1>
        <p className="text-muted font-medium text-lg">คำนวณดัชนีมวลกายของคุณอย่างรวดเร็วและง่ายดาย</p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel w-full max-w-2xl p-8 flex flex-col gap-8"
      >
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">น้ำหนัก (กก.)</label>
            <input 
              type="number"
              className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl p-4 text-text font-medium text-xl outline-none shadow-inner text-center"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">ส่วนสูง (ซม.)</label>
            <input 
              type="number"
              className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl p-4 text-text font-medium text-xl outline-none shadow-inner text-center"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="175"
            />
          </div>
        </div>

        {results && (
          <div className="mt-4 p-8 bg-surface border border-border rounded-xl flex flex-col items-center justify-center gap-2">
            <span className="text-xs font-bold text-muted uppercase tracking-widest">ค่า BMI ของคุณ</span>
            <div className={`text-6xl font-black ${results.color} my-2 drop-shadow-sm`}>
              {results.bmi}
            </div>
            <div className={`text-xl font-bold ${results.color} px-4 py-1 rounded-full bg-black/5 dark:bg-white/5`}>
              {results.category}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
