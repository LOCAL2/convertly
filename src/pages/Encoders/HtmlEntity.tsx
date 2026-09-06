import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';

type Mode = 'encode' | 'decode';

export default function HtmlEntity() {
  const [mode, setMode] = useState<Mode>('encode');
  
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const encodeHtml = (str: string) => {
    return str.replace(/[\u00A0-\u9999<>\&]/g, (i) => `&#${i.charCodeAt(0)};`);
  };

  const decodeHtml = (str: string) => {
    // In browser environment, we can use a DOM parser
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.documentElement.textContent || '';
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    
    if (!val) {
      setOutput('');
      return;
    }

    if (mode === 'encode') {
      setOutput(encodeHtml(val));
    } else {
      setOutput(decodeHtml(val));
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setInput(output);
    handleInputChange(output);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 z-10">
      
      <div className="w-full max-w-4xl flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-2 tracking-tight">HTML Entity</h1>
          <p className="text-muted font-medium">Escape HTML tags to characters like &amp;lt; and &amp;gt;</p>
        </div>
        
        {/* Mode Switcher */}
        <div className="flex bg-background border border-border rounded-xl p-1 w-full md:w-64 shadow-inner">
          <button
            onClick={() => switchMode('encode')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
              mode === 'encode' ? 'bg-surface shadow-sm text-text' : 'text-muted hover:text-text'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => switchMode('decode')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
              mode === 'decode' ? 'bg-surface shadow-sm text-text' : 'text-muted hover:text-text'
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel w-full max-w-4xl flex flex-col md:flex-row h-full min-h-[50vh]"
      >
        {/* Input */}
        <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-border p-1 relative">
          <textarea 
            className="w-full h-full min-h-[250px] bg-background/30 border-none rounded-xl p-5 text-text font-mono text-sm resize-none outline-none focus:ring-1 focus:ring-primary/50 shadow-inner"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={mode === 'encode' ? "<div>Hello World</div>" : "&#60;div&#62;Hello World&#60;/div&#62;"}
            spellCheck="false"
          />
          {input && (
            <button 
              onClick={() => handleInputChange('')}
              className="absolute top-4 right-6 text-xs bg-surface border border-border hover:bg-black/5 dark:hover:bg-white/5 text-muted px-2 py-1 rounded-md transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Output */}
        <div className="w-full md:w-1/2 flex flex-col p-1 relative bg-black/5 dark:bg-black/20">
          <textarea 
            className="w-full h-full min-h-[250px] bg-transparent border-none rounded-xl p-5 pr-12 text-text font-mono text-sm resize-none outline-none"
            value={output}
            readOnly
            placeholder={mode === 'encode' ? "Encoded string will appear here..." : "Decoded string will appear here..."}
            spellCheck="false"
          />
          {output && (
            <div className="absolute top-4 right-6 flex items-center gap-2">
              {copied && <span className="text-xs font-bold text-emerald-500 animate-pulse">Copied!</span>}
              <button 
                onClick={copyToClipboard}
                className="p-2 text-muted hover:text-primary bg-surface border border-border shadow-sm hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all active:scale-95"
                title="Copy String"
              >
                <Copy size={18} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
