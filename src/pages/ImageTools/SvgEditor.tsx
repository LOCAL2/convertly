import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Code, Eye } from 'lucide-react';

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">
  <circle cx="50" cy="50" r="40" fill="#10B981" stroke="#047857" stroke-width="4" />
  <path d="M30 50 L45 65 L70 35" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export default function SvgEditor() {
  const [svgCode, setSvgCode] = useState<string>(SAMPLE_SVG);

  const handleDownloadPng = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 400, 400);
        const link = document.createElement('a');
        link.download = 'vector-icon.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-5xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">SVG Code Editor & Previewer</h1>
        <p className="text-muted font-medium text-lg">Edit raw SVG XML code, preview vector graphics, and export as PNG.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-5xl p-6 md:p-8 flex flex-col gap-6"
      >
        <div className="flex justify-between items-center pb-4 border-b border-border">
          <span className="text-xs font-bold text-muted uppercase tracking-widest">SVG Live Editor</span>
          <button
            onClick={handleDownloadPng}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export High-Res PNG
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[420px]">
          {/* Source Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-emerald-500" /> SVG Markup Source
            </label>
            <textarea
              className="w-full h-full min-h-[380px] bg-background border border-border focus:border-emerald-500/50 rounded-2xl p-4 text-text font-mono text-sm outline-none shadow-inner resize-none"
              value={svgCode}
              onChange={(e) => setSvgCode(e.target.value)}
            />
          </div>

          {/* Render Preview */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-500" /> Rendered Vector Preview
            </label>
            <div 
              className="w-full h-full min-h-[380px] bg-surface border border-border rounded-2xl p-6 flex items-center justify-center shadow-sm overflow-hidden"
              dangerouslySetInnerHTML={{ __html: svgCode }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
