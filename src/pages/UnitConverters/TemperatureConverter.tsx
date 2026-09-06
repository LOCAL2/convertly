import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft } from 'lucide-react';

const tempUnits = [
  { id: 'c', name: 'Celsius (°C)' },
  { id: 'f', name: 'Fahrenheit (°F)' },
  { id: 'k', name: 'Kelvin (K)' },
];

export default function TemperatureConverter() {
  const [fromValue, setFromValue] = useState<string>('0');
  const [toValue, setToValue] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('c');
  const [toUnit, setToUnit] = useState<string>('f');

  useEffect(() => {
    calculate(fromValue, fromUnit, toUnit, true);
  }, [fromUnit, toUnit]);

  const convertTemp = (value: number, from: string, to: string) => {
    let celsius = value;
    // Convert to Celsius first
    if (from === 'f') celsius = (value - 32) * 5/9;
    if (from === 'k') celsius = value - 273.15;

    // Convert from Celsius to Target
    if (to === 'c') return celsius;
    if (to === 'f') return (celsius * 9/5) + 32;
    if (to === 'k') return celsius + 273.15;
    
    return value;
  };

  const calculate = (value: string, from: string, to: string, isForward: boolean) => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      if (isForward) setToValue('');
      else setFromValue('');
      return;
    }

    const result = convertTemp(num, from, to);
    const formattedResult = parseFloat(result.toFixed(4)).toString();

    if (isForward) {
      setToValue(formattedResult);
    } else {
      setFromValue(formattedResult);
    }
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromValue(e.target.value);
    calculate(e.target.value, fromUnit, toUnit, true);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToValue(e.target.value);
    calculate(e.target.value, toUnit, fromUnit, false);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-primary/10 dark:bg-primary/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-2xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">เครื่องมือแปลงอุณหภูมิ</h1>
        <p className="text-muted font-medium text-lg">แปลงอุณหภูมิระหว่าง เซลเซียส, ฟาเรนไฮต์ และเคลวิน ได้ทันที</p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel w-full max-w-4xl p-8 md:p-12 flex flex-col items-center justify-center gap-8"
      >
        <div className="flex flex-col md:flex-row items-center w-full gap-4 md:gap-8">
          
          {/* FROM */}
          <div className="flex-1 w-full flex flex-col gap-3">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">จากหน่วย (From)</label>
            <div className="relative">
              <input 
                type="number" 
                className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl px-5 py-4 text-text font-medium text-xl outline-none transition-all placeholder:text-muted/50 shadow-inner"
                value={fromValue}
                onChange={handleFromChange}
                placeholder="0"
              />
            </div>
            <select 
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text font-medium outline-none focus:border-primary/50 cursor-pointer shadow-sm"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
            >
              {tempUnits.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>
          </div>

          {/* SWAP BUTTON */}
          <div className="flex items-center justify-center pt-6 md:pt-4">
            <button 
              onClick={swapUnits}
              className="p-4 bg-surface hover:bg-black/5 dark:hover:bg-white/5 border border-border rounded-full text-muted hover:text-primary transition-all active:scale-95 shadow-sm"
              title="สลับหน่วย"
            >
              <ArrowRightLeft size={24} />
            </button>
          </div>

          {/* TO */}
          <div className="flex-1 w-full flex flex-col gap-3">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">แปลงเป็นหน่วย (To)</label>
            <div className="relative">
              <input 
                type="number" 
                className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl px-5 py-4 text-text font-medium text-xl outline-none transition-all placeholder:text-muted/50 shadow-inner"
                value={toValue}
                onChange={handleToChange}
                placeholder="0"
              />
            </div>
            <select 
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text font-medium outline-none focus:border-primary/50 cursor-pointer shadow-sm"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
            >
              {tempUnits.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
