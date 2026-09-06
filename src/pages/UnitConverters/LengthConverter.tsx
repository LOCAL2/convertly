import { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const units = {
  meters: { name: 'Meters', multiplier: 1 },
  kilometers: { name: 'Kilometers', multiplier: 1000 },
  centimeters: { name: 'Centimeters', multiplier: 0.01 },
  millimeters: { name: 'Millimeters', multiplier: 0.001 },
  miles: { name: 'Miles', multiplier: 1609.34 },
  yards: { name: 'Yards', multiplier: 0.9144 },
  feet: { name: 'Feet', multiplier: 0.3048 },
  inches: { name: 'Inches', multiplier: 0.0254 },
};

type UnitKey = keyof typeof units;

export default function LengthConverter() {
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<UnitKey>('meters');
  const [toUnit, setToUnit] = useState<UnitKey>('feet');
  const [result, setResult] = useState<string>('');
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setResult('');
      return;
    }

    const valueInMeters = numValue * units[fromUnit].multiplier;
    const finalValue = valueInMeters / units[toUnit].multiplier;
    
    setResult(finalValue.toLocaleString('en-US', { maximumFractionDigits: 6 }));
  }, [value, fromUnit, toUnit]);

  const handleSwap = () => {
    setIsSwapping(true);
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setTimeout(() => setIsSwapping(false), 300);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-2xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Length Converter</h1>
        <p className="text-muted font-medium text-lg">แปลงหน่วยความยาวและระยะทางชนิดต่างๆ ได้อย่างแม่นยำ</p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel w-full max-w-2xl p-8 md:p-10"
      >
        <div className="relative z-10 flex flex-col gap-8">
          
          {/* Input Value */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">ค่าที่ต้องการแปลง</label>
            <div className="relative">
              <input 
                type="number" 
                className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl px-5 py-4 text-text font-medium text-xl outline-none transition-all placeholder:text-muted/50 shadow-inner"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="กรอกค่าตัวเลข..."
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-bold text-lg opacity-80">
                {units[fromUnit].name.substring(0, 3).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 w-full relative">
            {/* From Unit */}
            <div className="flex flex-col gap-3 w-full md:w-[45%]">
              <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">จากหน่วย (From)</label>
              <div className="relative">
                <select 
                  className="w-full bg-background border border-border focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 rounded-xl px-5 py-4 text-text font-medium outline-none transition-all cursor-pointer appearance-none shadow-inner"
                  value={fromUnit} 
                  onChange={(e) => setFromUnit(e.target.value as UnitKey)}
                >
                  {Object.entries(units).map(([key, unit]) => (
                    <option key={key} value={key} className="bg-surface text-text">{unit.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                  ▼
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <button 
              className="mt-6 md:mt-8 p-4 bg-surface border border-border hover:border-primary text-muted hover:text-text rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all active:scale-90 cursor-pointer z-10"
              onClick={handleSwap}
              title="สลับหน่วย"
            >
              <motion.div animate={{ rotate: isSwapping ? 180 : 0 }} transition={{ duration: 0.4, type: "spring" }}>
                <ArrowRightLeft size={22} strokeWidth={2} />
              </motion.div>
            </button>

            {/* To Unit */}
            <div className="flex flex-col gap-3 w-full md:w-[45%]">
              <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">แปลงเป็นหน่วย (To)</label>
              <div className="relative">
                <select 
                  className="w-full bg-background border border-border focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 rounded-xl px-5 py-4 text-text font-medium outline-none transition-all cursor-pointer appearance-none shadow-inner"
                  value={toUnit} 
                  onChange={(e) => setToUnit(e.target.value as UnitKey)}
                >
                  {Object.entries(units).map(([key, unit]) => (
                    <option key={key} value={key} className="bg-surface text-text">{unit.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Result Area */}
          <div className="mt-6 p-8 bg-black/5 dark:bg-black/40 border border-border rounded-2xl text-center relative overflow-hidden group shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
            
            <div className="text-xs font-bold text-muted mb-3 uppercase tracking-widest">
              Conversion Result
            </div>
            
            <div className="text-4xl md:text-5xl font-bold text-text break-all tracking-tight">
              {result ? (
                <div className="flex items-baseline justify-center gap-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-text to-muted">
                    {result}
                  </span>
                  <span className="text-2xl text-primary font-medium">{units[toUnit].name}</span>
                </div>
              ) : (
                <span className="text-muted/30">---</span>
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
