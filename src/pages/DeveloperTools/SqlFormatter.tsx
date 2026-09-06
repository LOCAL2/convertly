import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Database, Play, Download } from 'lucide-react';

export default function SqlFormatter() {
  const [inputSql, setInputSql] = useState<string>('');

  const [outputSql, setOutputSql] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [uppercaseKeywords, setUppercaseKeywords] = useState<boolean>(true);

  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING',
    'LIMIT', 'OFFSET', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
    'OUTER JOIN', 'CROSS JOIN', 'ON', 'INSERT INTO', 'VALUES', 'UPDATE',
    'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
    'UNION', 'UNION ALL', 'WITH', 'AS', 'IN', 'NOT IN', 'EXISTS', 'NOT EXISTS',
    'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL', 'CASE', 'WHEN', 'THEN',
    'ELSE', 'END', 'ASC', 'DESC', 'DISTINCT'
  ];

  const mainClauseKeywords = [
    'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT',
    'OFFSET', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
    'CROSS JOIN', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
    'CREATE TABLE', 'ALTER TABLE', 'WITH', 'UNION', 'UNION ALL'
  ];

  const formatSql = (sql: string, uppercase: boolean): string => {
    if (!sql.trim()) return '';

    // Standardize spaces
    let clean = sql.replace(/\s+/g, ' ').trim();

    // Uppercase or standard keywords matching
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      clean = clean.replace(regex, uppercase ? kw.toUpperCase() : kw.toLowerCase());
    });

    // Insert newlines before main clause keywords
    mainClauseKeywords.forEach((kw) => {
      const targetKw = uppercase ? kw.toUpperCase() : kw.toLowerCase();
      const regex = new RegExp(`\\b${targetKw}\\b`, 'g');
      clean = clean.replace(regex, `\n${targetKw}`);
    });

    // Insert newlines for AND, OR, ON
    ['AND', 'OR', 'ON'].forEach((kw) => {
      const targetKw = uppercase ? kw.toUpperCase() : kw.toLowerCase();
      const regex = new RegExp(`\\b${targetKw}\\b`, 'g');
      clean = clean.replace(regex, `\n  ${targetKw}`);
    });

    // Formatting indentations
    const lines = clean.split('\n').filter((l) => l.trim().length > 0);
    const formattedLines: string[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      const firstWord = trimmed.split(' ')[0].toUpperCase();

      if (['AND', 'OR', 'ON'].includes(firstWord)) {
        formattedLines.push(`  ${trimmed}`);
      } else if (mainClauseKeywords.some((kw) => kw.startsWith(firstWord))) {
        formattedLines.push(trimmed);
      } else {
        formattedLines.push(`  ${trimmed}`);
      }
    });

    return formattedLines.join('\n').trim();
  };

  const handleFormat = () => {
    const formatted = formatSql(inputSql, uppercaseKeywords);
    setOutputSql(formatted);
  };

  const handleCopy = () => {
    if (!outputSql) return;
    navigator.clipboard.writeText(outputSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputSql) return;
    const blob = new Blob([outputSql], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted_query.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Run initial format
  useState(() => {
    handleFormat();
  });

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 px-4 md:px-8 z-10">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 uppercase tracking-wider">
            <Database size={18} />
            <span>Developer Tools</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">SQL Formatter</h1>
          <p className="text-muted text-sm font-medium mt-1">
            จัดเรียงคำสั่ง SQL ที่ยาวและซับซ้อนให้มีระเบียบ อ่านง่าย ปรับตัวพิมพ์ใหญ่สำหรับ Keyword ได้ทันที
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const formatted = formatSql(inputSql, uppercaseKeywords);
              setOutputSql(formatted);
            }}
            className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all active:scale-95"
          >
            <Play size={16} />
            <span>จัดรูปแบบ SQL</span>
          </button>
        </div>
      </div>

      {/* Settings Bar */}
      <div className="glass-panel w-full max-w-6xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm text-text font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={uppercaseKeywords}
            onChange={(e) => {
              setUppercaseKeywords(e.target.checked);
              setOutputSql(formatSql(inputSql, e.target.checked));
            }}
            className="rounded border-border text-primary focus:ring-primary/50 bg-background w-4 h-4"
          />
          <span>เปลี่ยนคำสั่ง (Keywords) ให้เป็นตัวพิมพ์ใหญ่ (UPPERCASE)</span>
        </label>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Left: Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel flex flex-col h-[520px] overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-black/5 dark:bg-white/5">
            <span className="text-text font-bold text-sm">Raw SQL Input</span>
            <button
              onClick={() => {
                setInputSql('');
                setOutputSql('');
              }}
              className="text-xs text-muted hover:text-text px-2 py-1 rounded bg-surface border border-border transition-colors"
            >
              ล้างข้อมูล
            </button>
          </div>

          <div className="flex-1 p-3 relative">
            <textarea
              className="w-full h-full bg-background/50 border-none rounded-xl p-4 text-text font-mono text-sm resize-none outline-none focus:ring-1 focus:ring-primary/50 shadow-inner"
              value={inputSql}
              onChange={(e) => {
                setInputSql(e.target.value);
                setOutputSql(formatSql(e.target.value, uppercaseKeywords));
              }}
              placeholder="วางคำสั่ง SQL ที่ต้องการจัดรูปแบบ..."
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
            <span className="text-text font-bold text-sm">Formatted SQL Output</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!outputSql}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border hover:bg-black/5 dark:hover:bg-white/5 text-text rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={!outputSql}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Download size={14} />
                <span>ดาวน์โหลด .sql</span>
              </button>
            </div>
          </div>

          <div className="flex-1 p-3 relative">
            <textarea
              readOnly
              className="w-full h-full bg-background/50 border-none rounded-xl p-4 text-text font-mono text-sm resize-none outline-none shadow-inner"
              value={outputSql}
              placeholder="ผลลัพธ์ SQL จะปรากฏที่นี่..."
              spellCheck="false"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
