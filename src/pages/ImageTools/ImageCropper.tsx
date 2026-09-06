import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download } from 'lucide-react';

export default function ImageCropper() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImageSrc(event.target?.result as string);
          setWidth(img.width);
          setHeight(img.height);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const link = document.createElement('a');
        link.download = 'resized-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
    img.src = imageSrc;
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Image Crop & Resizer</h1>
        <p className="text-muted font-medium text-lg">ตัดส่วนและปรับขนาดรูปภาพได้ทันทีบนเบราว์เซอร์อย่างปลอดภัย ไม่ต้องอัปโหลดเข้าเซิร์ฟเวอร์</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-4xl p-6 md:p-8 flex flex-col gap-8 items-center"
      >
        {/* Upload Zone */}
        {!imageSrc ? (
          <label className="w-full h-64 border-2 border-dashed border-border hover:border-emerald-500/50 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer bg-surface/50 transition-all">
            <Upload className="w-10 h-10 text-emerald-500" />
            <span className="text-sm font-bold text-text">Click or Drag & Drop Image Here</span>
            <span className="text-xs text-muted">Supports PNG, JPG, WEBP, SVG</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        ) : (
          <div className="w-full flex flex-col gap-6">
            {/* Dimensions Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Target Width (px)</label>
                <input 
                  type="number" 
                  className="w-full bg-background border border-border focus:border-emerald-500/50 rounded-xl px-4 py-3 text-text font-bold text-lg outline-none shadow-inner"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Target Height (px)</label>
                <input 
                  type="number" 
                  className="w-full bg-background border border-border focus:border-emerald-500/50 rounded-xl px-4 py-3 text-text font-bold text-lg outline-none shadow-inner"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Image Preview */}
            <div className="w-full flex flex-col items-center justify-center p-4 bg-surface border border-border rounded-2xl">
              <img 
                src={imageSrc} 
                alt="Preview" 
                style={{ width: `${width}px`, height: `${height}px`, maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                className="rounded-xl shadow-md border border-border"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end">
              <label className="px-5 py-2.5 bg-background border border-border rounded-xl font-bold text-sm text-text cursor-pointer hover:bg-surface transition-all flex items-center gap-2">
                <Upload className="w-4 h-4" /> Change Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <button
                onClick={handleDownload}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Resized Image
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
