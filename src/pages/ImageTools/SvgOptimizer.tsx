import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCode, Copy, Check, Sparkles, Download, Upload } from 'lucide-react';

export default function SvgOptimizer() {
  const [inputSvg, setInputSvg] = useState<string>('');

  const [outputSvg, setOutputSvg] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [removeComments, setRemoveComments] = useState<boolean>(true);
  const [removeMetadata, setRemoveMetadata] = useState<boolean>(true);
  const [minifySpaces, setMinifySpaces] = useState<boolean>(true);

  const [stats, setStats] = useState<{ origSize: number; newSize: number; saved: number }>({
    origSize: 0,
    newSize: 0,
    saved: 0,
  });

  const optimizeSvg = (svg: string) => {
    if (!svg.trim()) {
      setOutputSvg('');
      setStats({ origSize: 0, newSize: 0, saved: 0 });
      return;
    }

    let result = svg;

    // Remove comments
    if (removeComments) {
      result = result.replace(/<!--[\s\S]*?-->/g, '');
    }

    // Remove metadata/xml declaration
    if (removeMetadata) {
      result = result.replace(/<\?xml[\s\S]*?\?>/gi, '');
      result = result.replace(/<!DOCTYPE[\s\S]*?>/gi, '');
      result = result.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
    }

    // Minify spaces & newlines
    if (minifySpaces) {
      result = result
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
    }

    setOutputSvg(result);

    const origSize = new Blob([svg]).size;
    const newSize = new Blob([result]).size;
    const saved = origSize > 0 ? Math.round(((origSize - newSize) / origSize) * 100) : 0;

    setStats({ origSize, newSize, saved });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputSvg(content);
        optimizeSvg(content);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!outputSvg) return;
    navigator.clipboard.writeText(outputSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputSvg) return;
    const blob = new Blob([outputSvg], { type: 'image/svg+xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Run initial optimization
  useState(() => {
    optimizeSvg(inputSvg);
  });

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 px-4 md:px-8 z-10">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 uppercase tracking-wider">
            <FileCode size={18} />
            <span>Developer Tools</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">SVG Optimizer</h1>
          <p className="text-muted text-sm font-medium mt-1">
            บีบอัดและทำความสะอาดโค้ด SVG ตัดคอมเมนต์และแท็กส่วนเกินออก โดยไม่เสียความคมชัด
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-black/5 dark:hover:bg-white/10 border border-border text-text rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-sm">
            <Upload size={16} />
            <span>อัปโหลดไฟล์ SVG</span>
            <input type="file" accept=".svg,image/svg+xml" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Settings Bar */}
      <div className="glass-panel w-full max-w-6xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-text font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={removeComments}
              onChange={(e) => {
                setRemoveComments(e.target.checked);
                optimizeSvg(inputSvg);
              }}
              className="rounded border-border text-primary focus:ring-primary/50 bg-background w-4 h-4"
            />
            <span>ลบ Comments</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-text font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={removeMetadata}
              onChange={(e) => {
                setRemoveMetadata(e.target.checked);
                optimizeSvg(inputSvg);
              }}
              className="rounded border-border text-primary focus:ring-primary/50 bg-background w-4 h-4"
            />
            <span>ลบ Metadata & Doctype</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-text font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={minifySpaces}
              onChange={(e) => {
                setMinifySpaces(e.target.checked);
                optimizeSvg(inputSvg);
              }}
              className="rounded border-border text-primary focus:ring-primary/50 bg-background w-4 h-4"
            />
            <span>Minify Spaces</span>
          </label>
        </div>

        {stats.origSize > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-500 rounded-full font-bold text-xs">
            <Sparkles size={14} />
            <span>
              ประหยัดได้ {stats.saved}% ({(stats.origSize / 1024).toFixed(2)} KB → {(stats.newSize / 1024).toFixed(2)} KB)
            </span>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Input */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel flex flex-col h-[500px]">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-black/5 dark:bg-white/5">
            <span className="text-text font-bold text-sm">Raw SVG Code</span>
            <button
              onClick={() => {
                setInputSvg('');
                setOutputSvg('');
                setStats({ origSize: 0, newSize: 0, saved: 0 });
              }}
              className="text-xs text-muted hover:text-text px-2 py-1 rounded bg-surface border border-border transition-colors"
            >
              ล้างข้อมูล
            </button>
          </div>

          <div className="flex-1 p-3 relative">
            <textarea
              className="w-full h-full bg-background/50 border-none rounded-xl p-4 text-text font-mono text-xs resize-none outline-none focus:ring-1 focus:ring-primary/50 shadow-inner"
              value={inputSvg}
              onChange={(e) => {
                setInputSvg(e.target.value);
                optimizeSvg(e.target.value);
              }}
              placeholder="วางโค้ด SVG ของคุณที่นี่..."
              spellCheck="false"
            />
          </div>
        </motion.div>

        {/* Output & Preview */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel flex flex-col h-[500px]">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-black/5 dark:bg-white/5">
            <span className="text-text font-bold text-sm">Optimized SVG Output</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!outputSvg}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border hover:bg-black/5 dark:hover:bg-white/5 text-text rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={!outputSvg}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Download size={14} />
                <span>ดาวน์โหลด SVG</span>
              </button>
            </div>
          </div>

          <div className="flex-1 p-3 flex flex-col gap-3">
            {/* Visual SVG Preview */}
            {outputSvg && (
              <div className="h-32 bg-background/80 rounded-xl border border-border flex items-center justify-center p-4 relative overflow-hidden group">
                <div
                  className="w-full h-full flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: outputSvg }}
                />
              </div>
            )}

            <textarea
              readOnly
              className="flex-1 w-full bg-background/50 border-none rounded-xl p-4 text-text font-mono text-xs resize-none outline-none shadow-inner"
              value={outputSvg}
              placeholder="ผลลัพธ์ SVG จะปรากฏที่นี่..."
              spellCheck="false"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
