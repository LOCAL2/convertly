import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload, Download, Sparkles } from 'lucide-react';

export default function ImageCompressor() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(0.8);
  const [compressedDataUrl, setCompressedDataUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      compressImage(src, quality, file.type);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (src: string, q: number, mimeType: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, img.width, img.height);
      const outputType = mimeType === 'image/png' ? 'image/webp' : mimeType;
      const dataUrl = canvas.toDataURL(outputType, q);

      setCompressedDataUrl(dataUrl);

      // Estimate byte size from data URL
      const head = `data:${outputType};base64,`;
      const sizeInBytes = Math.round(((dataUrl.length - head.length) * 3) / 4);
      setCompressedSize(sizeInBytes);
    };
    img.src = src;
  };

  const handleDownload = () => {
    if (!compressedDataUrl) return;
    const a = document.createElement('a');
    a.href = compressedDataUrl;
    a.download = `compressed_${Date.now()}.${originalFile?.type === 'image/png' ? 'webp' : 'jpg'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const origSize = originalFile?.size || 0;
  const savedPercent = origSize > 0 ? Math.max(0, Math.round(((origSize - compressedSize) / origSize) * 100)) : 0;

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 px-4 md:px-8 z-10">
      {/* Header */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 uppercase tracking-wider">
            <ImageIcon size={18} />
            <span>Image & Media Tools</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">Client-side Image Compressor</h1>
          <p className="text-muted text-sm font-medium mt-1">
            บีบอัดรูปภาพผ่าน Canvas API ในเบราว์เซอร์โดยตรง ปลอดภัย 100% ไม่ต้องอัปโหลดขึ้นเซิร์ฟเวอร์
          </p>
        </div>

        <label className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all cursor-pointer active:scale-95">
          <Upload size={16} />
          <span>เลือกรูปภาพ</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {imageSrc ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl flex flex-col gap-6">
          {/* Controls Bar */}
          <div className="glass-panel p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <span className="text-xs font-bold text-muted uppercase tracking-wider whitespace-nowrap">
                คุณภาพรูปภาพ (Quality):
              </span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setQuality(val);
                  if (imageSrc && originalFile) compressImage(imageSrc, val, originalFile.type);
                }}
                className="w-full accent-primary bg-background cursor-pointer"
              />
              <span className="text-sm font-bold text-primary font-mono">{Math.round(quality * 100)}%</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <div>
                <span className="text-muted">ขนาดเดิม:</span>{' '}
                <strong className="text-text font-mono">{(origSize / 1024).toFixed(1)} KB</strong>
              </div>
              <div>
                <span className="text-muted">ขนาดบีบอัด:</span>{' '}
                <strong className="text-primary font-mono">{(compressedSize / 1024).toFixed(1)} KB</strong>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 font-bold rounded-full">
                <Sparkles size={12} />
                <span>ลดลง {savedPercent}%</span>
              </div>
            </div>
          </div>

          {/* Image Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-4 flex flex-col items-center justify-center h-80">
              <span className="text-xs font-bold text-muted uppercase mb-3">รูปภาพต้นฉบับ (Original)</span>
              <img src={imageSrc} alt="Original" className="max-h-60 object-contain rounded-xl shadow-md" />
            </div>

            <div className="glass-panel p-4 flex flex-col items-center justify-center h-80 relative">
              <span className="text-xs font-bold text-primary uppercase mb-3">รูปภาพหลังบีบอัด (Compressed)</span>
              {compressedDataUrl && (
                <img src={compressedDataUrl} alt="Compressed" className="max-h-60 object-contain rounded-xl shadow-md" />
              )}
            </div>
          </div>

          {/* Download Button */}
          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95"
            >
              <Download size={18} />
              <span>ดาวน์โหลดรูปภาพบีบอัด</span>
            </button>
          </div>
        </motion.div>
      ) : (
        /* Empty Dropzone */
        <div className="glass-panel w-full max-w-5xl p-16 flex flex-col items-center justify-center text-center border-dashed border-2 border-border/80 rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-lg font-bold text-text mb-2">ลากไฟล์รูปภาพมาวางที่นี่ หรือกดปุ่มด้านบน</h3>
          <p className="text-xs text-muted max-w-sm mb-6">
            รองรับไฟล์รูปภาพประเภท PNG, JPG, WebP บีบอัดรวดเร็วทันใจ ปลอดภัยบนเครื่องของคุณ
          </p>
          <label className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-md cursor-pointer transition-all active:scale-95">
            <Upload size={16} />
            <span>เลือกไฟล์รูปภาพ</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      )}
    </div>
  );
}
