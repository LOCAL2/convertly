import { useState } from 'react';
import { motion } from 'framer-motion';

export default function JwtDecoder() {
  const [input, setInput] = useState<string>('');
  const [header, setHeader] = useState<string>('');
  const [payload, setPayload] = useState<string>('');
  const [error, setError] = useState<string>('');

  const decodeBase64Url = (str: string) => {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    // Handle utf-8 properly
    const raw = atob(base64);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      bytes[i] = raw.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  };

  const handleDecode = (token: string) => {
    setInput(token);
    if (!token.trim()) {
      setHeader('');
      setPayload('');
      setError('');
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('A JWT must have 3 parts separated by dots');
      }

      const h = JSON.parse(decodeBase64Url(parts[0]));
      const p = JSON.parse(decodeBase64Url(parts[1]));

      setHeader(JSON.stringify(h, null, 2));
      setPayload(JSON.stringify(p, null, 2));
      setError('');
    } catch (e: any) {
      setHeader('');
      setPayload('');
      setError(e.message || 'Invalid JWT format');
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 z-10">
      
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-2 tracking-tight">JWT Decoder</h1>
        <p className="text-muted font-medium">Decode JSON Web Tokens instantly to see their contents.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel w-full max-w-4xl flex flex-col md:flex-row h-full min-h-[50vh]"
      >
        {/* Input */}
        <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-border p-1 relative">
          <div className="p-4 bg-background/50 border-b border-border text-xs font-bold text-muted uppercase tracking-widest">
            Encoded Token
          </div>
          <textarea 
            className="w-full h-full min-h-[150px] md:min-h-[400px] bg-background/30 border-none p-5 text-text font-mono text-sm resize-none outline-none focus:ring-1 focus:ring-primary/50 shadow-inner break-all"
            value={input}
            onChange={(e) => handleDecode(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            spellCheck="false"
          />
          {input && (
            <button 
              onClick={() => handleDecode('')}
              className="absolute top-16 right-6 text-xs bg-surface border border-border hover:bg-black/5 dark:hover:bg-white/5 text-muted px-2 py-1 rounded-md transition-colors"
            >
              Clear
            </button>
          )}
          {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-500/10 border border-red-500/30 p-3 text-red-600 dark:text-red-300 text-sm font-mono rounded-lg backdrop-blur-md">
              ⚠ {error}
            </div>
          )}
        </div>

        {/* Output */}
        <div className="w-full md:w-1/2 flex flex-col bg-black/5 dark:bg-black/20 overflow-y-auto">
          {/* Header */}
          <div className="flex-1 flex flex-col border-b border-border">
            <div className="p-4 bg-background/50 border-b border-border text-xs font-bold text-red-500 uppercase tracking-widest">
              Header
            </div>
            <textarea 
              className="w-full h-full min-h-[150px] bg-transparent border-none p-5 text-red-600 dark:text-red-400 font-mono text-sm resize-none outline-none"
              value={header}
              readOnly
              placeholder="Decoded header..."
              spellCheck="false"
            />
          </div>

          {/* Payload */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 bg-background/50 border-b border-border text-xs font-bold text-purple-500 uppercase tracking-widest">
              Payload
            </div>
            <textarea 
              className="w-full h-full min-h-[250px] bg-transparent border-none p-5 text-purple-600 dark:text-purple-400 font-mono text-sm resize-none outline-none"
              value={payload}
              readOnly
              placeholder="Decoded payload..."
              spellCheck="false"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
