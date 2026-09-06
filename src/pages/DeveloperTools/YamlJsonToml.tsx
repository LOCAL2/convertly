import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowRightLeft, AlertCircle } from 'lucide-react';

export default function YamlJsonToml() {
  const [inputContent, setInputContent] = useState<string>('');
  const [sourceFormat, setSourceFormat] = useState<'yaml' | 'json'>('yaml');
  const [targetFormat, setTargetFormat] = useState<'json' | 'yaml'>('json');
  const [copied, setCopied] = useState<boolean>(false);

  // Convert JSON <-> YAML (client-side simulation & JSON parsing)
  const getConvertedOutput = () => {
    if (!inputContent.trim()) return { output: '', errorMsg: null };

    try {
      if (sourceFormat === 'yaml' && targetFormat === 'json') {
        const lines = inputContent.split('\n');
        const obj: Record<string, any> = {};
        lines.forEach(line => {
          const parts = line.split(':');
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join(':').trim();
            if (val === 'true') obj[key] = true;
            else if (val === 'false') obj[key] = false;
            else if (!isNaN(Number(val)) && val !== '') obj[key] = Number(val);
            else obj[key] = val.replace(/^["']|["']$/g, '');
          }
        });
        return { output: JSON.stringify(obj, null, 2), errorMsg: null };
      } else if (sourceFormat === 'json' && targetFormat === 'yaml') {
        const parsed = JSON.parse(inputContent);
        let yamlStr = '';
        for (const [k, v] of Object.entries(parsed)) {
          if (typeof v === 'object' && v !== null) {
            yamlStr += `${k}:\n  ${JSON.stringify(v)}\n`;
          } else {
            yamlStr += `${k}: ${v}\n`;
          }
        }
        return { output: yamlStr, errorMsg: null };
      }
    } catch (e: any) {
      return { output: '', errorMsg: e.message || 'Format conversion error' };
    }
    return { output: inputContent, errorMsg: null };
  };

  const { output: outputCode, errorMsg } = getConvertedOutput();

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-5xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">YAML ↔ JSON Converter</h1>
        <p className="text-muted font-medium text-lg">Convert configuration files between YAML and JSON seamlessly.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-5xl p-6 md:p-8 flex flex-col gap-6"
      >
        {/* Toggle Mode */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => { setSourceFormat('yaml'); setTargetFormat('json'); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${sourceFormat === 'yaml' ? 'bg-emerald-500 text-white shadow-md' : 'bg-background border border-border text-muted'}`}
          >
            YAML ➔ JSON
          </button>
          <ArrowRightLeft className="w-5 h-5 text-muted" />
          <button
            onClick={() => { setSourceFormat('json'); setTargetFormat('yaml'); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${sourceFormat === 'json' ? 'bg-emerald-500 text-white shadow-md' : 'bg-background border border-border text-muted'}`}
          >
            JSON ➔ YAML
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[420px] items-stretch">
          {/* Source Input */}
          <div className="flex flex-col gap-2 h-full">
            <div className="h-7 flex items-center justify-between">
              <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1 capitalize">{sourceFormat} Source</label>
            </div>
            <textarea
              className="w-full flex-1 h-full min-h-[380px] bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-2xl p-4 text-text font-mono text-sm outline-none shadow-inner resize-none"
              placeholder={sourceFormat === 'yaml' ? 'วางโค้ด YAML ที่นี่...\n\nname: Convertly\nversion: 1.0.0' : 'วางโค้ด JSON ที่นี่...\n\n{\n  "name": "Convertly",\n  "version": "1.0.0"\n}'}
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
            />
          </div>

          {/* Target Output */}
          <div className="flex flex-col gap-2 h-full">
            <div className="h-7 flex items-center justify-between">
              <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1 capitalize">{targetFormat} Output</label>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-bold text-text hover:bg-surface transition-all flex items-center gap-1.5 shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            {errorMsg ? (
              <div className="w-full flex-1 h-full min-h-[380px] bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-500 font-mono text-sm flex items-center justify-center gap-3">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                {errorMsg}
              </div>
            ) : (
              <textarea
                readOnly
                className="w-full flex-1 h-full min-h-[380px] bg-surface border border-border rounded-2xl p-4 text-emerald-600 dark:text-emerald-400 font-mono text-sm outline-none shadow-sm resize-none"
                placeholder={targetFormat === 'json' ? 'ผลลัพธ์ JSON จะแสดงที่นี่...' : 'ผลลัพธ์ YAML จะแสดงที่นี่...'}
                value={outputCode}
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
