import { useState } from 'react';
import { motion } from 'framer-motion';

export default function RomanNumerals() {
  const [numberInput, setNumberInput] = useState<string>('');
  const [romanInput, setRomanInput] = useState<string>('');
  const [error, setError] = useState<string>('');

  const intToRoman = (num: number) => {
    const romanMap: { [key: string]: number } = {
      M: 1000, CM: 900, D: 500, CD: 400,
      C: 100, XC: 90, L: 50, XL: 40,
      X: 10, IX: 9, V: 5, IV: 4, I: 1
    };
    let str = '';
    for (let i of Object.keys(romanMap)) {
      let q = Math.floor(num / romanMap[i]);
      num -= q * romanMap[i];
      str += i.repeat(q);
    }
    return str;
  };

  const romanToInt = (str: string) => {
    const romanMap: { [key: string]: number } = {
      M: 1000, CM: 900, D: 500, CD: 400,
      C: 100, XC: 90, L: 50, XL: 40,
      X: 10, IX: 9, V: 5, IV: 4, I: 1
    };
    let result = 0;
    for (let i = 0; i < str.length; i++) {
      if (i > 0 && romanMap[str[i]] > romanMap[str[i - 1]]) {
        result += romanMap[str[i]] - 2 * romanMap[str[i - 1]];
      } else {
        result += romanMap[str[i]];
      }
    }
    return result;
  };

  const handleNumberChange = (val: string) => {
    setNumberInput(val);
    setError('');
    const num = parseInt(val, 10);
    if (!val) {
      setRomanInput('');
      return;
    }
    if (isNaN(num) || num < 1 || num > 3999) {
      setError('Number must be between 1 and 3999');
      setRomanInput('');
      return;
    }
    setRomanInput(intToRoman(num));
  };

  const handleRomanChange = (val: string) => {
    const upperVal = val.toUpperCase();
    setRomanInput(upperVal);
    setError('');
    
    if (!upperVal) {
      setNumberInput('');
      return;
    }

    const isValid = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(upperVal);
    if (!isValid) {
      setError('Invalid Roman Numeral format');
      setNumberInput('');
      return;
    }
    setNumberInput(romanToInt(upperVal).toString());
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="w-full max-w-2xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Roman Numerals</h1>
        <p className="text-muted font-medium text-lg">Convert standard numbers to Roman numerals and vice versa.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel w-full max-w-2xl p-8 md:p-12 flex flex-col items-center gap-8"
      >
        <div className="flex flex-col w-full gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Standard Number (1 - 3999)</label>
            <input 
              type="number"
              min="1" max="3999"
              className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl p-4 text-text font-mono text-xl outline-none shadow-inner"
              value={numberInput}
              onChange={(e) => handleNumberChange(e.target.value)}
              placeholder="e.g. 2026"
            />
          </div>

          <div className="flex items-center justify-center">
            <div className="w-px h-8 bg-border"></div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Roman Numeral</label>
              {error && <span className="text-xs font-bold text-red-500 mr-1">{error}</span>}
            </div>
            <input 
              type="text"
              className={`w-full bg-background border ${error ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary/50'} focus:ring-1 focus:ring-primary/50 rounded-xl p-4 text-text font-mono text-xl outline-none shadow-inner`}
              value={romanInput}
              onChange={(e) => handleRomanChange(e.target.value)}
              placeholder="e.g. MMXXVI"
              spellCheck="false"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
