import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileDiff, RefreshCw } from 'lucide-react';

interface DiffResult {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  originalLineNumber?: number;
  modifiedLineNumber?: number;
}

export default function TextDiff() {
  const [originalText, setOriginalText] = useState<string>('');

  const [modifiedText, setModifiedText] = useState<string>('');

  // Basic line-by-line diff algorithm
  const computeDiff = (orig: string, mod: string): DiffResult[] => {
    const origLines = orig.split('\n');
    const modLines = mod.split('\n');

    const results: DiffResult[] = [];
    let i = 0;
    let j = 0;

    while (i < origLines.length || j < modLines.length) {
      if (i < origLines.length && j < modLines.length && origLines[i] === modLines[j]) {
        results.push({
          type: 'unchanged',
          text: origLines[i],
          originalLineNumber: i + 1,
          modifiedLineNumber: j + 1,
        });
        i++;
        j++;
      } else {
        if (i < origLines.length && (!modLines.includes(origLines[i]) || modLines.indexOf(origLines[i]) < j)) {
          results.push({
            type: 'removed',
            text: origLines[i],
            originalLineNumber: i + 1,
          });
          i++;
        } else if (j < modLines.length) {
          results.push({
            type: 'added',
            text: modLines[j],
            modifiedLineNumber: j + 1,
          });
          j++;
        }
      }
    }

    return results;
  };

  const diffResults = computeDiff(originalText, modifiedText);

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 px-4 md:px-8 z-10">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 uppercase tracking-wider">
            <FileDiff size={18} />
            <span>Text Tools</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">Text Diff Checker</h1>
          <p className="text-muted text-sm font-medium mt-1">
            เปรียบเทียบความแตกต่างของข้อความ 2 ชุด (Original vs Modified) พร้อมไฮไลท์แบบ GitHub
          </p>
        </div>

        <button
          onClick={() => {
            setOriginalText('');
            setModifiedText('');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-border hover:bg-black/5 dark:hover:bg-white/10 text-text rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <RefreshCw size={16} />
          <span>ล้างข้อความทั้งหมด</span>
        </button>
      </div>

      {/* Input Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl mb-8">
        <div className="glass-panel flex flex-col h-64">
          <div className="px-5 py-3 border-b border-border bg-red-500/5 font-bold text-sm text-red-400">
            Original Text (ข้อความเดิม)
          </div>
          <div className="flex-1 p-3">
            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="วางข้อความต้นฉบับที่นี่..."
              className="w-full h-full bg-background/50 border-none rounded-xl p-4 text-text font-mono text-xs resize-none outline-none shadow-inner"
            />
          </div>
        </div>

        <div className="glass-panel flex flex-col h-64">
          <div className="px-5 py-3 border-b border-border bg-green-500/5 font-bold text-sm text-green-400">
            Modified Text (ข้อความดัดแปลง)
          </div>
          <div className="flex-1 p-3">
            <textarea
              value={modifiedText}
              onChange={(e) => setModifiedText(e.target.value)}
              placeholder="วางข้อความที่แก้ไขแล้วที่นี่..."
              className="w-full h-full bg-background/50 border-none rounded-xl p-4 text-text font-mono text-xs resize-none outline-none shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Diff Result Viewer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel w-full max-w-6xl flex flex-col">
        <div className="px-5 py-3 border-b border-border bg-black/5 dark:bg-white/5 font-bold text-sm text-text flex items-center justify-between">
          <span>ผลการเปรียบเทียบ (Diff Output)</span>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-red-400">
              - Removed ({diffResults.filter((r) => r.type === 'removed').length})
            </span>
            <span className="text-green-400">
              + Added ({diffResults.filter((r) => r.type === 'added').length})
            </span>
          </div>
        </div>

        <div className="p-4 overflow-x-auto bg-background/80 font-mono text-xs rounded-b-2xl">
          {diffResults.length > 0 ? (
            <div className="flex flex-col font-mono text-xs">
              {/* Header Info */}
              <div className="flex items-center px-3 py-1.5 bg-black/10 dark:bg-white/5 font-sans text-[10px] font-bold text-muted border-b border-border select-none uppercase tracking-wider">
                <span className="w-8 text-right pr-2">เดิม</span>
                <span className="w-8 text-right pr-3 border-r border-border/50">ใหม่</span>
                <span className="w-6 text-center"> </span>
                <span className="pl-2">เนื้อหาข้อความ</span>
              </div>

              {diffResults.map((line, idx) => {
                let bgClass = 'hover:bg-black/5 dark:hover:bg-white/5 text-text/80';
                let indicator = ' ';
                if (line.type === 'added') {
                  bgClass = 'bg-green-500/10 text-green-300 border-l-4 border-green-500';
                  indicator = '+';
                } else if (line.type === 'removed') {
                  bgClass = 'bg-red-500/10 text-red-300 border-l-4 border-red-500';
                  indicator = '-';
                }

                return (
                  <div key={idx} className={`flex items-center px-3 py-1 font-mono text-xs ${bgClass}`}>
                    <span className="w-8 text-muted/60 select-none text-right pr-2">
                      {line.originalLineNumber || ''}
                    </span>
                    <span className="w-8 text-muted/60 select-none text-right pr-3 border-r border-border/30">
                      {line.modifiedLineNumber || ''}
                    </span>
                    <span className="w-6 font-bold select-none text-center">{indicator}</span>
                    <span className="whitespace-pre-wrap break-all pl-2">{line.text}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-muted text-xs">ไม่มีข้อความสำหรับเปรียบเทียบ</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
