import { useState } from 'react';
import { motion } from 'framer-motion';

export default function JsonFormatter() {
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFormat = () => {
    if (!input.trim()) {
      setError('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e: any) {
      setError(e.message || 'Invalid JSON format');
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setError('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError('');
    } catch (e: any) {
      setError(e.message || 'Invalid JSON format');
    }
  };

  const handleClear = () => {
    setInput('');
    setError('');
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 z-10 h-[calc(100vh-100px)]">
      <div className="w-full max-w-4xl flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2 tracking-tight">JSON Formatter</h1>
          <p className="text-muted text-sm font-medium">Format, prettify, or minify JSON data.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleMinify} className="px-4 py-2 bg-surface hover:bg-black/5 dark:hover:bg-white/10 border border-border text-text rounded-lg text-sm font-medium transition-colors">
            Minify
          </button>
          <button onClick={handleFormat} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all active:scale-95">
            Format JSON
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel w-full max-w-4xl flex-1 flex flex-col relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        
        {error && (
          <div className="w-full bg-red-500/10 border-b border-red-500/30 p-3 px-6 text-red-600 dark:text-red-300 text-sm font-mono flex items-center justify-between z-10">
            <span>⚠ {error}</span>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 dark:hover:text-red-100">✕</button>
          </div>
        )}

        <div className="flex-1 p-1 relative group z-10">
          <textarea 
            className="w-full h-full bg-background/50 border-none rounded-xl p-5 text-text font-mono text-sm resize-none outline-none focus:ring-1 focus:ring-primary/50 shadow-inner"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            spellCheck="false"
          />
          {input && (
            <button 
              onClick={handleClear}
              className="absolute top-4 right-6 text-xs bg-surface border border-border hover:bg-black/5 dark:hover:bg-white/5 text-muted px-2 py-1 rounded-md transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
