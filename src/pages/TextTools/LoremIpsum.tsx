import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Copy, Check, RefreshCw } from 'lucide-react';

export default function LoremIpsum() {
  const [count, setCount] = useState<number>(3);
  const [unit, setUnit] = useState<'paragraphs' | 'words' | 'sentences'>('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
    'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
    'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
    'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
    'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const generateLorem = () => {
    let result = '';

    if (unit === 'words') {
      const words: string[] = [];
      if (startWithLorem) {
        words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
      }
      while (words.length < count) {
        const randomWord = loremWords[Math.floor(Math.random() * loremWords.length)];
        words.push(randomWord);
      }
      result = words.slice(0, count).join(' ');
      result = result.charAt(0).toUpperCase() + result.slice(1) + '.';
    } else if (unit === 'sentences') {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        let sentenceLen = Math.floor(Math.random() * 8) + 6;
        let words: string[] = [];
        if (i === 0 && startWithLorem) {
          words = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];
        } else {
          for (let w = 0; w < sentenceLen; w++) {
            words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
          }
        }
        let sentenceStr = words.join(' ');
        sentenceStr = sentenceStr.charAt(0).toUpperCase() + sentenceStr.slice(1) + '.';
        sentences.push(sentenceStr);
      }
      result = sentences.join(' ');
    } else {
      // Paragraphs
      const paragraphs: string[] = [];
      for (let p = 0; p < count; p++) {
        const sentenceCount = Math.floor(Math.random() * 4) + 4;
        const sentences: string[] = [];
        for (let s = 0; s < sentenceCount; s++) {
          let sentenceLen = Math.floor(Math.random() * 8) + 6;
          let words: string[] = [];
          if (p === 0 && s === 0 && startWithLorem) {
            words = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];
          } else {
            for (let w = 0; w < sentenceLen; w++) {
              words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
            }
          }
          let sentenceStr = words.join(' ');
          sentenceStr = sentenceStr.charAt(0).toUpperCase() + sentenceStr.slice(1) + '.';
          sentences.push(sentenceStr);
        }
        paragraphs.push(sentences.join(' '));
      }
      result = paragraphs.join('\n\n');
    }

    setOutput(result);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run initial generator
  useState(() => {
    generateLorem();
  });

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 px-4 md:px-8 z-10">
      {/* Header */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 uppercase tracking-wider">
            <FileText size={18} />
            <span>Text Tools</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">Lorem Ipsum Generator</h1>
          <p className="text-muted text-sm font-medium mt-1">
            สร้างข้อความจำลอง (Dummy Text) สำหรับงานดีไซน์ เลือกจำนวนคำ ประโยค หรือพารากราฟได้ตามต้องการ
          </p>
        </div>

        <button
          onClick={generateLorem}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all active:scale-95"
        >
          <RefreshCw size={16} />
          <span>สร้างข้อความใหม่</span>
        </button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl flex flex-col gap-6">
        {/* Controls Card */}
        <div className="glass-panel p-6 flex flex-col gap-5">
          <h2 className="text-base font-bold text-text">ตัวเลือกการสร้างข้อความ</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Count Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted uppercase">จำนวน (Amount)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => {
                  setCount(Math.max(1, Number(e.target.value)));
                  generateLorem();
                }}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl font-bold text-sm text-text outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            {/* Unit Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted uppercase">หน่วย (Unit)</label>
              <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border">
                <button
                  onClick={() => {
                    setUnit('paragraphs');
                    generateLorem();
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    unit === 'paragraphs' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-text'
                  }`}
                >
                  Paragraphs
                </button>
                <button
                  onClick={() => {
                    setUnit('sentences');
                    generateLorem();
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    unit === 'sentences' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-text'
                  }`}
                >
                  Sentences
                </button>
                <button
                  onClick={() => {
                    setUnit('words');
                    generateLorem();
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    unit === 'words' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-text'
                  }`}
                >
                  Words
                </button>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-text font-medium cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => {
                setStartWithLorem(e.target.checked);
                generateLorem();
              }}
              className="rounded border-border text-primary focus:ring-primary/50 bg-background w-4 h-4"
            />
            <span>เริ่มต้นด้วย &quot;Lorem ipsum dolor sit amet...&quot;</span>
          </label>
        </div>

        {/* Output Box */}
        <div className="glass-panel p-6 flex flex-col h-[400px] relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">ผลลัพธ์ (Generated Text)</span>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
            </button>
          </div>

          <textarea
            readOnly
            value={output}
            className="w-full h-full bg-background/50 border-none rounded-xl p-4 text-text font-sans text-sm leading-relaxed resize-none outline-none shadow-inner"
          />
        </div>
      </motion.div>
    </div>
  );
}
