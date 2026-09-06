import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';

const FONTS_THAI_OPTIONS = [
  'Kanit', 'Prompt', 'Sarabun', 'Mitr', 'Krub', 'Itim', 'Pridi', 'Chakra Petch',
  'Bai Jamjuree', 'Taviraj', 'Pattaya', 'Srisakdi', 'Charm', 'Mali', 'Fahkwang',
  'KoHo', 'Kodchasan', 'Niramit', 'Chonburi', 'Thasadith', 'K2D'
].map(f => ({ value: f, label: f }));

const FONTS_ENGLISH_OPTIONS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Raleway',
  'Poppins', 'Merriweather', 'Playfair Display', 'Nunito', 'PTSans', 'Rubik',
  'Lora', 'Work Sans', 'Fira Sans', 'Quicksand', 'Cinzel', 'Bebas Neue',
  'Abril Fatface', 'Pacifico', 'Dancing Script', 'Caveat', 'Lobster', 'Comfortaa'
].map(f => ({ value: f, label: f }));

const FONT_GROUPS = [
  { label: '🇹🇭 Thai Google Fonts', options: FONTS_THAI_OPTIONS },
  { label: '🌐 English Google Fonts', options: FONTS_ENGLISH_OPTIONS },
];

export default function FontPairPreviewer() {
  const [headerFont, setHeaderFont] = useState<string>('Kanit');
  const [bodyFont, setBodyFont] = useState<string>('Sarabun');
  const [copied, setCopied] = useState<boolean>(false);

  // Dynamic Google Font Loader
  useEffect(() => {
    const linkId = 'google-fonts-dynamic';
    let link = document.getElementById(linkId) as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    const hFont = headerFont.replace(/\s+/g, '+');
    const bFont = bodyFont.replace(/\s+/g, '+');
    link.href = `https://fonts.googleapis.com/css2?family=${hFont}:wght@400;700&family=${bFont}:wght@400;700&display=swap`;
  }, [headerFont, bodyFont]);

  const importCode = `@import url('https://fonts.googleapis.com/css2?family=${headerFont.replace(/\s+/g, '+')}:wght@400;700&family=${bodyFont.replace(/\s+/g, '+')}:wght@400;700&display=swap');`;

  const handleCopy = () => {
    navigator.clipboard.writeText(importCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Font Pair Previewer</h1>
        <p className="text-muted font-medium text-lg">เปรียบเทียบการจับคู่อักษรหัวข้อและเนื้อหาสำหรับงานดีไซน์เว็บภาษาไทยและอังกฤษ</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-4xl p-6 md:p-8 flex flex-col gap-8"
      >
        {/* Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Heading Font ({FONTS_THAI_OPTIONS.length + FONTS_ENGLISH_OPTIONS.length} Fonts)</label>
            <CustomSelect
              value={headerFont}
              onChange={(val) => setHeaderFont(val)}
              groups={FONT_GROUPS}
              size="lg"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Body Font ({FONTS_THAI_OPTIONS.length + FONTS_ENGLISH_OPTIONS.length} Fonts)</label>
            <CustomSelect
              value={bodyFont}
              onChange={(val) => setBodyFont(val)}
              groups={FONT_GROUPS}
              size="lg"
            />
          </div>
        </div>

        {/* Live Typography Preview Card */}
        <div className="p-8 bg-surface border border-border rounded-2xl flex flex-col gap-4 shadow-sm">
          <h2 style={{ fontFamily: headerFont }} className="text-3xl md:text-4xl font-bold text-text">
            สร้างสรรค์ประสบการณ์เว็บแอปสไตล์ใหม่ (Modern Web UI)
          </h2>
          <p style={{ fontFamily: bodyFont }} className="text-muted text-base leading-relaxed">
            Convertly ช่วยให้นักพัฒนาและดีไซเนอร์เข้าถึงเครื่องมือคำนวณและแปลงค่าต่างๆ ได้รวดเร็วที่สุด ด้วยดีไซน์ Glassmorphism ปลอดภัย ไร้รอยต่อ ไม่ต้องพึ่งพาเซิร์ฟเวอร์
          </p>
        </div>

        {/* Google Fonts Import */}
        <div className="flex flex-col gap-3 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted uppercase tracking-widest">Google Fonts Import Code</span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-bold text-text hover:bg-surface transition-all flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy CSS Import'}
            </button>
          </div>
          <input
            type="text"
            readOnly
            className="w-full bg-background border border-border rounded-xl p-3 text-emerald-600 dark:text-emerald-400 font-mono text-xs outline-none shadow-inner"
            value={importCode}
          />
        </div>
      </motion.div>
    </div>
  );
}
