import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Download, FileText, Eye } from 'lucide-react';

const DEFAULT_MARKDOWN = `# 🚀 Welcome to Convertly Markdown Editor

Write Markdown on the left, see live rendered preview on the right!

## Features:
- **Bold text** and *italic text*
- [Clickable Links](https://github.com)
- Inline \`code blocks\`

### Lists:
1. Item 1
2. Item 2
3. Item 3

> "Simple, fast, and beautiful markdown tool."
`;

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [copied, setCopied] = useState<boolean>(false);

  // Simple Client-side Markdown to HTML Converter
  const renderHtml = (md: string) => {
    let html = md
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold my-3 text-text">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold my-2 text-text">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold my-2 text-text">$1</h3>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-emerald-500 pl-4 italic text-muted my-3">$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code class="bg-background px-1.5 py-0.5 rounded font-mono text-emerald-500 text-sm">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" class="text-emerald-500 hover:underline font-semibold">$1</a>')
      .replace(/\n$/gim, '<br />');

    return html.split('\n\n').map(p => `<p class="my-2 leading-relaxed text-text">${p}</p>`).join('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-5xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Markdown Editor & Preview</h1>
        <p className="text-muted font-medium text-lg">เขียนโค้ด Markdown และแสดงผลลัพธ์พรีวิวทันทีแบบเรียลไทม์</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-5xl p-6 md:p-8 flex flex-col gap-6"
      >
        {/* Action Header */}
        <div className="flex justify-between items-center pb-4 border-b border-border">
          <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-wider">
            <FileText className="w-4 h-4 text-emerald-500" /> Live Editor
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-text hover:bg-surface transition-all flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy MD'}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Download className="w-3.5 h-3.5" /> Download .md
            </button>
          </div>
        </div>

        {/* Editor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[450px]">
          {/* Raw Textarea */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Markdown Source</label>
            <textarea
              className="w-full h-full min-h-[400px] bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-2xl p-4 text-text font-mono text-sm outline-none shadow-inner resize-none"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
            />
          </div>

          {/* Rendered Preview */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-500" /> Live Preview
            </label>
            <div 
              className="w-full h-full min-h-[400px] bg-surface border border-border rounded-2xl p-6 overflow-y-auto shadow-sm prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderHtml(markdown) }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
