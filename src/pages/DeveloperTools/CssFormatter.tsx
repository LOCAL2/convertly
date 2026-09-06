import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Code2, Sparkles, Download, Minimize2, Maximize2 } from 'lucide-react';

export default function CssFormatter() {
  const [inputCss, setInputCss] = useState<string>('');

  const [outputCss, setOutputCss] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const [stats, setStats] = useState<{ originalSize: number; newSize: number; savedPercent: number }>({
    originalSize: 0,
    newSize: 0,
    savedPercent: 0,
  });

  const minifyCss = (css: string): string => {
    return css
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove whitespace around selectors and block braces
      .replace(/\s*([{} rein;,:])\s*/g, '$1')
      // Remove multiple spaces/newlines
      .replace(/\s+/g, ' ')
      // Remove trailing semicolons before closing brace
      .replace(/;}/g, '}')
      // Remove leading zeros in decimals (e.g. 0.5rem -> .5rem)
      .replace(/(:|\s)0\.(\d+)/g, '$1.$2')
      // Remove zero units (e.g. 0px -> 0)
      .replace(/(:|\s)0(px|rem|em|%|pt|vh|vw)/g, '$10')
      .trim();
  };

  const formatCss = (css: string): string => {
    // First minify to standardize
    let clean = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();
    
    let formatted = '';
    let indentLevel = 0;
    const indentStr = '  ';

    for (let i = 0; i < clean.length; i++) {
      const char = clean[i];
      if (char === '{') {
        formatted = formatted.trimEnd() + ' {\n';
        indentLevel++;
        formatted += indentStr.repeat(indentLevel);
      } else if (char === '}') {
        formatted = formatted.trimEnd() + '\n';
        indentLevel = Math.max(0, indentLevel - 1);
        formatted += indentStr.repeat(indentLevel) + '}\n\n';
      } else if (char === ';') {
        formatted += ';\n' + indentStr.repeat(indentLevel);
      } else if (char === ':') {
        formatted += ': ';
      } else {
        formatted += char;
      }
    }

    return formatted.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
  };

  const processCss = (input: string, currentMode: 'format' | 'minify') => {
    if (!input.trim()) {
      setOutputCss('');
      setStats({ originalSize: 0, newSize: 0, savedPercent: 0 });
      return;
    }

    const result = currentMode === 'minify' ? minifyCss(input) : formatCss(input);
    setOutputCss(result);

    const origSize = new Blob([input]).size;
    const newS = new Blob([result]).size;
    const saved = origSize > 0 ? Math.round(((origSize - newS) / origSize) * 100) : 0;

    setStats({
      originalSize: origSize,
      newSize: newS,
      savedPercent: saved,
    });
  };

  const handleMinify = () => {
    setMode('minify');
    processCss(inputCss, 'minify');
  };

  const handleFormat = () => {
    setMode('format');
    processCss(inputCss, 'format');
  };

  const handleCopy = () => {
    if (!outputCss) return;
    navigator.clipboard.writeText(outputCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputCss) return;
    const blob = new Blob([outputCss], { type: 'text/css;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'minify' ? 'style.min.css' : 'style.formatted.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Initial processing
  useState(() => {
    processCss(inputCss, mode);
  });

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 px-4 md:px-8 z-10">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 uppercase tracking-wider">
            <Code2 size={18} />
            <span>Developer Tools</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">CSS Minifier / Formatter</h1>
          <p className="text-muted text-sm font-medium mt-1">
            บีบอัดโค้ด CSS ให้มีขนาดเล็กลง (Minify) หรือจัดระเบียบให้สวยงามอ่านง่าย (Prettify)
          </p>
        </div>

        {/* Mode Actions */}
        <div className="flex items-center gap-2 bg-surface p-1.5 rounded-2xl border border-border">
          <button
            onClick={handleFormat}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              mode === 'format'
                ? 'bg-primary text-white shadow-md'
                : 'text-muted hover:text-text'
            }`}
          >
            <Maximize2 size={16} />
            <span>จัดรูปแบบ (Format)</span>
          </button>
          <button
            onClick={handleMinify}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              mode === 'minify'
                ? 'bg-primary text-white shadow-md'
                : 'text-muted hover:text-text'
            }`}
          >
            <Minimize2 size={16} />
            <span>บีบอัด (Minify)</span>
          </button>
        </div>
      </div>

      {/* Stats Banner */}
      {stats.originalSize > 0 && (
        <div className="glass-panel w-full max-w-6xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-muted">ขนาดเดิม:</span>{' '}
              <strong className="text-text font-mono">{(stats.originalSize / 1024).toFixed(2)} KB</strong>
            </div>
            <div>
              <span className="text-muted">ขนาดใหม่:</span>{' '}
              <strong className="text-primary font-mono">{(stats.newSize / 1024).toFixed(2)} KB</strong>
            </div>
            {mode === 'minify' && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-500 rounded-full font-bold text-xs">
                <Sparkles size={14} />
                <span>ประหยัดได้ {stats.savedPercent}%</span>
              </div>
            )}
          </div>
          <div className="text-xs text-muted font-medium">
            โหมดปัจจุบัน: <strong className="text-primary uppercase">{mode}</strong>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Left: Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel flex flex-col h-[520px] overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-black/5 dark:bg-white/5">
            <span className="text-text font-bold text-sm">Input CSS</span>
            <button
              onClick={() => {
                setInputCss('');
                setOutputCss('');
                setStats({ originalSize: 0, newSize: 0, savedPercent: 0 });
              }}
              className="text-xs text-muted hover:text-text px-2 py-1 rounded bg-surface border border-border transition-colors"
            >
              ล้างข้อมูล
            </button>
          </div>

          <div className="flex-1 p-3 relative">
            <textarea
              className="w-full h-full bg-background/50 border-none rounded-xl p-4 text-text font-mono text-sm resize-none outline-none focus:ring-1 focus:ring-primary/50 shadow-inner"
              value={inputCss}
              onChange={(e) => {
                setInputCss(e.target.value);
                processCss(e.target.value, mode);
              }}
              placeholder="วางโค้ด CSS ของคุณที่นี่..."
              spellCheck="false"
            />
          </div>
        </motion.div>

        {/* Right: Output */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel flex flex-col h-[520px] overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-black/5 dark:bg-white/5">
            <span className="text-text font-bold text-sm">Output CSS ({mode})</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!outputCss}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border hover:bg-black/5 dark:hover:bg-white/5 text-text rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={!outputCss}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Download size={14} />
                <span>ดาวน์โหลด .css</span>
              </button>
            </div>
          </div>

          <div className="flex-1 p-3 relative">
            <textarea
              readOnly
              className="w-full h-full bg-background/50 border-none rounded-xl p-4 text-text font-mono text-sm resize-none outline-none shadow-inner"
              value={outputCss}
              placeholder="ผลลัพธ์ CSS จะปรากฏที่นี่..."
              spellCheck="false"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
