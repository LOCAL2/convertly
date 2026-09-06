import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Link as LinkIcon, Loader2, FileText } from 'lucide-react';

export default function WordCounter() {
  const [text, setText] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charCount = text.length;
  
  const getWordCount = (str: string) => {
    if (!str.trim()) return 0;
    try {
      const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
      return Array.from(segmenter.segment(str)).filter(s => s.isWordLike).length;
    } catch (e) {
      return str.trim().split(/\s+/).length;
    }
  };
  
  const wordCount = getWordCount(text);
  const lineCount = text === '' ? 0 : text.split('\n').length;
  const charNoSpaces = text.replace(/\s/g, '').length;

  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setText(e.target?.result as string || '');
      setError('');
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const fetchUrl = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    setError('');
    
    // Clean target URL
    const targetUrl = url.trim();

    try {
      // Try direct fetch first if CORS allows or standard text file
      try {
        const directRes = await fetch(targetUrl);
        if (directRes.ok) {
          const textData = await directRes.text();
          setText(textData);
          setIsLoading(false);
          return;
        }
      } catch {
        // Ignore direct fetch error, proceed to CORS proxies
      }

      // Try proxy 1: corsproxy.io
      try {
        const proxy1Res = await fetch(`https://corsproxy.io/?${encodeURIComponent(targetUrl)}`);
        if (proxy1Res.ok) {
          const textData = await proxy1Res.text();
          setText(textData);
          setIsLoading(false);
          return;
        }
      } catch {
        // Ignore proxy1 error
      }

      // Try proxy 2: allorigins JSON API (more reliable than /raw)
      const proxy2Res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
      if (proxy2Res.ok) {
        const jsonData = await proxy2Res.json();
        if (jsonData.contents) {
          setText(jsonData.contents);
          setIsLoading(false);
          return;
        }
      }

      throw new Error('Could not fetch content from this URL');
    } catch (err: any) {
      setError('ไม่สามารถดึงข้อมูลจาก URL นี้ได้ กรุณาตรวจสอบว่า URL เปิดเป็นสาธารณะ (Public URL)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 z-10">
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-2 tracking-tight">เครื่องมือนับคำ</h1>
        <p className="text-muted font-medium">นับคำ, ตัวอักษร และบรรทัดแบบเรียลไทม์</p>
      </div>

      {/* Stats Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="glass-panel p-4 text-center rounded-xl">
          <div className="text-xs text-muted font-bold uppercase tracking-widest mb-1">คำ</div>
          <div className="text-3xl font-bold text-primary">{wordCount}</div>
        </div>
        <div className="glass-panel p-4 text-center rounded-xl">
          <div className="text-xs text-muted font-bold uppercase tracking-widest mb-1">ตัวอักษร</div>
          <div className="text-3xl font-bold text-secondary">{charCount}</div>
        </div>
        <div className="glass-panel p-4 text-center rounded-xl">
          <div className="text-xs text-muted font-bold uppercase tracking-widest mb-1">ตัวอักษร (ไม่รวมเว้นวรรค)</div>
          <div className="text-3xl font-bold text-accent">{charNoSpaces}</div>
        </div>
        <div className="glass-panel p-4 text-center rounded-xl">
          <div className="text-xs text-muted font-bold uppercase tracking-widest mb-1">บรรทัด</div>
          <div className="text-3xl font-bold text-text">{lineCount}</div>
        </div>
      </motion.div>

      {/* Import Controls */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-4xl flex flex-col md:flex-row gap-4 mb-6"
      >
        {/* URL Fetch */}
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="url"
              className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl pl-10 pr-4 py-3 text-text font-medium outline-none shadow-inner"
              placeholder="https://example.com/file.txt"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchUrl}
            disabled={isLoading || !url.trim()}
            className="px-6 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-white rounded-xl font-bold flex items-center justify-center transition-all shadow-lg active:scale-95 whitespace-nowrap min-w-[100px]"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Fetch URL'}
          </button>
        </div>

        {/* File Upload */}
        <div className="md:w-auto w-full">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            accept=".txt,.md,.json,.csv,.xml,.html,.js,.ts,.jsx,.tsx"
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full md:w-auto px-6 py-3 bg-surface border border-border hover:bg-black/5 dark:hover:bg-white/5 text-text rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Upload size={18} className="text-muted" />
            Upload File
          </button>
        </div>
      </motion.div>
      
      {error && <div className="w-full max-w-4xl mb-4 text-center text-sm font-bold text-red-500">{error}</div>}

      {/* Text Area with Drag & Drop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`glass-panel w-full max-w-4xl flex-1 flex flex-col p-1 relative min-h-[40vh] transition-all border-2 ${
          isDragging ? 'border-primary border-dashed bg-primary/5' : 'border-transparent'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl pointer-events-none">
            <FileText size={64} className="text-primary mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-text">วางไฟล์ของคุณที่นี่</h2>
          </div>
        )}
        
        <textarea 
          className="w-full h-full min-h-[300px] bg-background/50 border-none rounded-xl p-5 text-text font-sans text-base resize-none outline-none focus:ring-1 focus:ring-primary/50 shadow-inner leading-relaxed"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="พิมพ์ข้อความ, วางข้อความ หรือลากไฟล์มาวางที่นี่..."
        />
        {text && (
          <button 
            onClick={() => setText('')}
            className="absolute top-4 right-6 z-10 text-xs bg-surface border border-border hover:bg-black/5 dark:hover:bg-white/5 text-muted px-3 py-1.5 rounded-md transition-colors font-medium shadow-sm"
          >
            Clear Text
          </button>
        )}
      </motion.div>
    </div>
  );
}
