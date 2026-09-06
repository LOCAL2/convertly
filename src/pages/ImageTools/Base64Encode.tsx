import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Copy, Download } from 'lucide-react';

type Mode = 'encode' | 'decode';

export default function Base64Encode() {
  const [mode, setMode] = useState<Mode>('encode');
  
  // Encode State
  const [encodeBase64, setEncodeBase64] = useState<string>('');
  const [encodePreview, setEncodePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedEncode, setCopiedEncode] = useState(false);

  // Decode State
  const [decodeBase64, setDecodeBase64] = useState<string>('');
  const [decodeError, setDecodeError] = useState<string>('');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setEncodeBase64(result);
      setEncodePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = () => {
    if (encodeBase64) {
      navigator.clipboard.writeText(encodeBase64);
      setCopiedEncode(true);
      setTimeout(() => setCopiedEncode(false), 2000);
    }
  };

  const handleDecodeChange = (val: string) => {
    setDecodeBase64(val);
    setDecodeError('');
    if (!val.trim()) return;
    
    // Simple validation for Data URI or raw base64
    if (!val.startsWith('data:image')) {
      // Try to determine if it's raw base64 and prepend data uri
      // Note: In a real app we might guess mime type by magic bytes
      if (/^[A-Za-z0-9+/=]+$/.test(val.replace(/\s/g, ''))) {
        setDecodeBase64(`data:image/png;base64,${val}`);
      } else {
        setDecodeError('Invalid Base64 format');
      }
    }
  };

  const downloadImage = () => {
    if (!decodeBase64 || decodeError) return;
    const a = document.createElement('a');
    a.href = decodeBase64;
    a.download = 'decoded_image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 z-10">
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-primary/10 dark:bg-primary/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-2 tracking-tight">Image ↔ Base64</h1>
        <p className="text-muted font-medium">Convert images to Base64 strings, or decode Base64 strings back to images.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel w-full max-w-4xl p-6 md:p-8 flex flex-col gap-6"
      >
        
        {/* Mode Switcher */}
        <div className="flex bg-background border border-border rounded-xl p-1 w-full max-w-sm mx-auto shadow-inner mb-2">
          <button
            onClick={() => setMode('encode')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
              mode === 'encode' ? 'bg-surface shadow-sm text-text' : 'text-muted hover:text-text'
            }`}
          >
            Image to Base64
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
              mode === 'decode' ? 'bg-surface shadow-sm text-text' : 'text-muted hover:text-text'
            }`}
          >
            Base64 to Image
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'encode' ? (
            <motion.div 
              key="encode"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* Upload Area */}
              <div 
                className="w-full h-48 border-2 border-dashed border-border hover:border-primary/50 rounded-2xl flex flex-col items-center justify-center gap-4 bg-background/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="p-4 bg-surface rounded-full group-hover:scale-110 group-hover:text-primary transition-all shadow-sm">
                  <Upload size={32} className="text-muted group-hover:text-primary transition-colors" />
                </div>
                <div className="text-muted font-medium">
                  <span className="text-text font-bold">Click to upload</span> or drag and drop an image
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              {/* Results Area */}
              {encodeBase64 && (
                <div className="flex flex-col md:flex-row gap-6 mt-4">
                  {/* Preview */}
                  <div className="w-full md:w-1/3 flex flex-col gap-2">
                    <div className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Preview</div>
                    <div className="w-full aspect-square bg-background border border-border rounded-xl overflow-hidden flex items-center justify-center p-2 shadow-inner">
                      {encodePreview ? (
                        <img src={encodePreview} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg" />
                      ) : (
                        <ImageIcon size={48} className="text-muted/20" />
                      )}
                    </div>
                  </div>

                  {/* Base64 String */}
                  <div className="w-full md:w-2/3 flex flex-col gap-2 relative">
                    <div className="flex justify-between items-end">
                      <div className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Base64 Output</div>
                      {copiedEncode && <span className="text-xs font-bold text-emerald-500 mr-2 animate-pulse">Copied!</span>}
                    </div>
                    <div className="relative h-full">
                      <textarea 
                        className="w-full h-full min-h-[200px] bg-background/50 border border-border rounded-xl p-4 pr-12 text-muted font-mono text-xs resize-none outline-none focus:ring-1 focus:ring-primary/50 shadow-inner break-all"
                        value={encodeBase64}
                        readOnly
                      />
                      <button 
                        onClick={copyToClipboard}
                        className="absolute right-4 top-4 p-2 text-muted hover:text-primary bg-surface border border-border shadow-sm hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-all active:scale-95"
                        title="Copy String"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="decode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col md:flex-row gap-6"
            >
              {/* Base64 Input */}
              <div className="w-full md:w-2/3 flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <div className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Paste Base64 String</div>
                  {decodeError && <span className="text-xs font-bold text-red-500 mr-1">{decodeError}</span>}
                </div>
                <div className="relative h-full">
                  <textarea 
                    className="w-full h-full min-h-[200px] bg-background/50 border border-border rounded-xl p-4 text-text font-mono text-xs resize-none outline-none focus:ring-1 focus:ring-primary/50 shadow-inner break-all"
                    value={decodeBase64}
                    onChange={(e) => handleDecodeChange(e.target.value)}
                    placeholder="data:image/png;base64,iVBORw0KGgo..."
                    spellCheck="false"
                  />
                  {decodeBase64 && (
                    <button 
                      onClick={() => { setDecodeBase64(''); setDecodeError(''); }}
                      className="absolute right-4 top-4 text-xs bg-surface border border-border hover:bg-black/5 dark:hover:bg-white/5 text-muted px-2 py-1 rounded-md transition-colors shadow-sm"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div className="w-full md:w-1/3 flex flex-col gap-2">
                <div className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Image Preview</div>
                <div className="w-full aspect-square bg-background border border-border rounded-xl overflow-hidden flex flex-col items-center justify-center p-2 shadow-inner relative group">
                  {decodeBase64 && !decodeError ? (
                    <>
                      <img src={decodeBase64} alt="Decoded Preview" className="max-w-full max-h-full object-contain rounded-lg" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <button 
                          onClick={downloadImage}
                          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold shadow-lg transition-transform active:scale-95"
                        >
                          <Download size={18} />
                          Download
                        </button>
                      </div>
                    </>
                  ) : (
                    <ImageIcon size={48} className="text-muted/20" />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
