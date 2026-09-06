import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload, Download } from 'lucide-react';

interface FaviconItem {
  size: number;
  label: string;
  filename: string;
  dataUrl: string;
}

export default function FaviconGenerator() {
  const [, setImageSrc] = useState<string | null>(null);
  const [favicons, setFavicons] = useState<FaviconItem[]>([]);
  const [, setLoading] = useState<boolean>(false);

  const sizes = [
    { size: 16, label: 'Browser Tab Standard (16x16)', filename: 'favicon-16x16.png' },
    { size: 32, label: 'Browser Tab Retina (32x32)', filename: 'favicon-32x32.png' },
    { size: 48, label: 'Desktop Icon (48x48)', filename: 'favicon-48x48.png' },
    { size: 180, label: 'Apple Touch Icon (180x180)', filename: 'apple-touch-icon.png' },
    { size: 192, label: 'Android Chrome (192x192)', filename: 'android-chrome-192x192.png' },
    { size: 512, label: 'Android Splash (512x512)', filename: 'android-chrome-512x512.png' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      generateFavicons(src);
    };
    reader.readAsDataURL(file);
  };

  const generateFavicons = (src: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const generated: FaviconItem[] = [];

      sizes.forEach((s) => {
        const canvas = document.createElement('canvas');
        canvas.width = s.size;
        canvas.height = s.size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, s.size, s.size);
          const dataUrl = canvas.toDataURL('image/png');
          generated.push({
            size: s.size,
            label: s.label,
            filename: s.filename,
            dataUrl,
          });
        }
      });

      setFavicons(generated);
      setLoading(false);
    };
    img.src = src;
  };

  const handleDownloadSingle = (item: FaviconItem) => {
    const a = document.createElement('a');
    a.href = item.dataUrl;
    a.download = item.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 px-4 md:px-8 z-10">
      {/* Header */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 uppercase tracking-wider">
            <ImageIcon size={18} />
            <span>Image & Media Tools</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">Favicon Generator</h1>
          <p className="text-muted text-sm font-medium mt-1">
            อัปโหลดรูปภาพ 1 รูป เพื่อสร้างชุดไฟล์ Favicon สำหรับทุกอุปกรณ์ (Web, iOS, Android)
          </p>
        </div>

        <label className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all cursor-pointer active:scale-95">
          <Upload size={16} />
          <span>อัปโหลดรูปภาพ</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {favicons.length > 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl flex flex-col gap-6">
          <div className="glass-panel p-6">
            <h2 className="text-base font-bold text-text mb-4">ชุดไฟล์ Favicon ที่สร้างสำเร็จ</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {favicons.map((item) => (
                <div
                  key={item.filename}
                  className="p-4 rounded-2xl bg-surface border border-border flex flex-col items-center justify-between text-center gap-3 group hover:border-primary/40 transition-all"
                >
                  <div className="w-16 h-16 rounded-xl bg-black/20 border border-white/10 flex items-center justify-center p-2 shadow-inner">
                    <img src={item.dataUrl} alt={item.label} className="max-w-full max-h-full object-contain" />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-text truncate">{item.label}</div>
                    <div className="text-[11px] font-mono text-muted">{item.filename}</div>
                  </div>

                  <button
                    onClick={() => handleDownloadSingle(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 hover:bg-primary text-primary hover:text-white rounded-xl text-xs font-bold transition-all w-full justify-center"
                  >
                    <Download size={14} />
                    <span>ดาวน์โหลด</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="glass-panel w-full max-w-5xl p-16 flex flex-col items-center justify-center text-center border-dashed border-2 border-border/80 rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-lg font-bold text-text mb-2">อัปโหลดรูปภาพเพื่อสร้าง Favicon</h3>
          <p className="text-xs text-muted max-w-sm mb-6">
            ระบบจะย่อขนาดรูปภาพให้อยู่ในขนาดมาตรฐานสำหรับเบราว์เซอร์, iOS Apple Touch Icon และ Android Web App
          </p>
          <label className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-md cursor-pointer transition-all active:scale-95">
            <Upload size={16} />
            <span>เลือกรูปภาพ</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      )}
    </div>
  );
}
