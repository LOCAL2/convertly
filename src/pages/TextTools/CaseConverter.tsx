import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';

export default function CaseConverter() {
  const [input, setInput] = useState<string>('');
  
  const conversions = {
    'UPPERCASE': input.toUpperCase(),
    'lowercase': input.toLowerCase(),
    'Title Case': input.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
    'camelCase': input.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, ''),
    'PascalCase': input.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
      return word.toUpperCase();
    }).replace(/\s+/g, ''),
    'snake_case': input.replace(/\W+/g, ' ').split(/ |\B(?=[A-Z])/).map(word => word.toLowerCase()).join('_'),
    'kebab-case': input.replace(/\W+/g, ' ').split(/ |\B(?=[A-Z])/).map(word => word.toLowerCase()).join('-'),
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">เปลี่ยนรูปแบบตัวพิมพ์</h1>
        <p className="text-muted font-medium text-lg">แปลงข้อความระหว่างรูปแบบตัวพิมพ์ต่างๆ ทันที</p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel w-full max-w-4xl p-6 md:p-8 flex flex-col gap-8"
      >
        <div className="flex flex-col gap-2 relative">
          <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">ข้อความต้นฉบับ</label>
          <textarea 
            className="w-full min-h-[150px] bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl p-5 text-text font-medium text-lg resize-none outline-none transition-all shadow-inner"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your text here..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(conversions).map(([name, text]) => (
            <div key={name} className="flex flex-col gap-2 relative group">
              <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">{name}</label>
              <div className="relative">
                <textarea 
                  className="w-full h-24 bg-black/5 dark:bg-black/20 border border-border rounded-xl p-4 pr-12 text-muted text-sm resize-none outline-none shadow-inner"
                  value={text}
                  readOnly
                  placeholder={`${name} output`}
                />
                {text && (
                  <button 
                    onClick={() => copyToClipboard(text)}
                    className="absolute right-3 top-3 p-2 text-muted hover:text-primary hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-all active:scale-95"
                    title="Copy"
                  >
                    <Copy size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
