import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';

export default function HashGenerator() {
  const [input, setInput] = useState<string>('');
  
  const [hashes, setHashes] = useState({
    'SHA-1': '',
    'SHA-256': '',
    'SHA-384': '',
    'SHA-512': ''
  });

  const generateHashes = async (text: string) => {
    if (!text) {
      setHashes({ 'SHA-1': '', 'SHA-256': '', 'SHA-384': '', 'SHA-512': '' });
      return;
    }

    const msgUint8 = new TextEncoder().encode(text);
    const algos = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    
    const results: any = {};
    
    for (const algo of algos) {
      try {
        const hashBuffer = await crypto.subtle.digest(algo, msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        results[algo] = hashHex;
      } catch (e) {
        results[algo] = 'Error generating hash';
      }
    }
    
    setHashes(results as any);
  };

  useEffect(() => {
    generateHashes(input);
  }, [input]);

  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      // add a small visual indicator here if desired
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 z-10">
      
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-2 tracking-tight">Hash Generator</h1>
        <p className="text-muted font-medium">Generate secure cryptographic hashes from text instantly.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel w-full max-w-4xl flex flex-col p-6 md:p-8 gap-8"
      >
        <div className="flex flex-col gap-2 relative">
          <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Input Text</label>
          <textarea 
            className="w-full min-h-[120px] bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl p-5 text-text font-mono text-sm resize-none outline-none transition-all shadow-inner"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type something to hash..."
          />
        </div>

        <div className="flex flex-col gap-4">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="flex flex-col gap-2 relative group">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-primary uppercase tracking-widest ml-1">{algo}</label>
              </div>
              <div className="relative">
                <input 
                  type="text"
                  className="w-full bg-black/5 dark:bg-black/20 border border-border rounded-xl pl-4 pr-12 py-3 text-muted font-mono text-sm outline-none shadow-inner"
                  value={hash}
                  readOnly
                  placeholder={`${algo} hash will appear here`}
                />
                {hash && (
                  <button 
                    onClick={() => copyToClipboard(hash)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted hover:text-primary hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-all active:scale-95"
                    title="Copy Hash"
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
