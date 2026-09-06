import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Code, Scissors } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript / TS' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
];

export default function CommentRemover() {
  const [sourceCode, setSourceCode] = useState<string>('');
  const [language, setLanguage] = useState<'javascript' | 'python' | 'html' | 'css' | 'sql'>('javascript');
  const [copied, setCopied] = useState<boolean>(false);

  // Safe comment removal that respects quotes/strings (so "http://example.com" or '//#hash' inside strings are NOT stripped)
  const removeComments = (code: string, lang: string) => {
    if (!code) return '';

    let cleaned = code;

    if (lang === 'javascript' || lang === 'css') {
      // RegEx matching strings ("...", '...', `...`) OR comments (/*...*/, //...)
      const jsRegex = /("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`)|(\/\*[\s\S]*?\*\/|\/\/[^\n]*)/g;
      cleaned = cleaned.replace(jsRegex, (match, stringGroup) => {
        if (stringGroup) return match; // Retain string content intact
        return ''; // Strip comment
      });
    } else if (lang === 'python') {
      // RegEx matching strings ("""...""", '''...''', "...", '...') OR comments (#...)
      const pyRegex = /("""[\s\S]*?"""|'''[\s\S]*?'''|"([^"\\]|\\.)*"|'([^'\\]|\\.)*')|(#(?!.*"""|.*''')[^\n]*)/g;
      cleaned = cleaned.replace(pyRegex, (match, stringGroup) => {
        if (stringGroup) return match;
        return '';
      });
    } else if (lang === 'html') {
      // Remove HTML comments <!-- ... -->
      cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
    } else if (lang === 'sql') {
      // RegEx matching strings ('...') OR comments (--..., /*...*/)
      const sqlRegex = /('([^'\\]|\\.)*')|(\/\*[\s\S]*?\*\/|--[^\n]*)/g;
      cleaned = cleaned.replace(sqlRegex, (match, stringGroup) => {
        if (stringGroup) return match;
        return '';
      });
    }

    return cleaned.split('\n').filter(line => line.trim() !== '').join('\n');
  };

  const outputCode = removeComments(sourceCode, language);

  const handleCopy = () => {
    if (!outputCode) return;
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-5xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Code Comment Remover</h1>
        <p className="text-muted font-medium text-lg">ลบคอมเมนต์ออกจากซอร์สโค้ด JavaScript, Python, HTML, CSS และ SQL ได้ทันที</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-5xl p-6 md:p-8 flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[420px] items-stretch">
          {/* Source Input */}
          <div className="flex flex-col gap-2 h-full">
            <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 min-h-[36px]">
              <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1 flex items-center gap-1.5 whitespace-nowrap">
                <Code className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Source Code
              </label>
              <CustomSelect
                value={language}
                onChange={(val) => setLanguage(val as any)}
                options={LANGUAGE_OPTIONS}
                size="sm"
                className="w-44"
              />
            </div>
            <textarea
              className="w-full flex-1 h-full min-h-[380px] bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-2xl p-4 text-text font-mono text-sm outline-none shadow-inner resize-none"
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              placeholder="Paste code with comments here..."
            />
          </div>

          {/* Cleaned Output */}
          <div className="flex flex-col gap-2 h-full">
            <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 min-h-[36px]">
              <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1 flex items-center gap-1.5 whitespace-nowrap">
                <Scissors className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Cleaned Output
              </label>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-bold text-text hover:bg-surface transition-all flex items-center gap-1.5 shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Code'}
              </button>
            </div>

            <textarea
              readOnly
              className="w-full flex-1 h-full min-h-[380px] bg-surface border border-border rounded-2xl p-4 text-emerald-600 dark:text-emerald-400 font-mono text-sm outline-none shadow-sm resize-none"
              value={outputCode}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
