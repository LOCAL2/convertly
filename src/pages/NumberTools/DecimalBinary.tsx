import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DecimalBinary() {
  const [decimal, setDecimal] = useState<string>('');
  const [binary, setBinary] = useState<string>('');

  const handleDecimalChange = (val: string) => {
    setDecimal(val);
    if (!val) {
      setBinary('');
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setBinary((num >>> 0).toString(2));
    } else {
      setBinary('Invalid');
    }
  };

  const handleBinaryChange = (val: string) => {
    // Only allow 0 and 1
    const cleanVal = val.replace(/[^01]/g, '');
    setBinary(cleanVal);
    if (!cleanVal) {
      setDecimal('');
      return;
    }
    const num = parseInt(cleanVal, 2);
    if (!isNaN(num)) {
      setDecimal(num.toString(10));
    } else {
      setDecimal('Invalid');
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-secondary/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-2xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Decimal ↔ Binary</h1>
        <p className="text-muted font-medium text-lg">Convert numbers between base-10 and base-2 systems.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel w-full max-w-2xl p-8 md:p-10"
      >
        <div className="relative z-10 flex flex-col gap-8">
          
          {/* Decimal Input */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Decimal (Base 10)</label>
            <div className="relative">
              <input 
                type="number" 
                className="w-full bg-background border border-border focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 rounded-xl px-5 py-4 text-text font-medium text-xl outline-none transition-all placeholder:text-muted/50 shadow-inner"
                value={decimal}
                onChange={(e) => handleDecimalChange(e.target.value)}
                placeholder="e.g. 42"
              />
            </div>
          </div>

          <div className="flex justify-center -my-2 z-10">
            <div className="p-3 bg-surface border border-border text-muted rounded-full shadow-lg">
              <span className="text-xl">↕</span>
            </div>
          </div>

          {/* Binary Input */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Binary (Base 2)</label>
            <div className="relative">
              <input 
                type="text" 
                className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl px-5 py-4 text-text font-medium text-xl outline-none transition-all placeholder:text-muted/50 shadow-inner tracking-widest font-mono"
                value={binary}
                onChange={(e) => handleBinaryChange(e.target.value)}
                placeholder="e.g. 101010"
              />
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
