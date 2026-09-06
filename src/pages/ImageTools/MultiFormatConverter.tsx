import { useState, useRef } from 'react';
import { Upload, Download, FileImage } from 'lucide-react';

const FORMATS = ['png', 'jpeg', 'webp'];

export default function MultiFormatConverter() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('converted-image');
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>('webp');
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.split('.')[0] || 'converted-image');
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      convertImage(src, targetFormat, 0.9);
    };
    reader.readAsDataURL(file);
  };

  const convertImage = (src: string, fmt: 'png' | 'jpeg' | 'webp', q: number = 0.9) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (fmt === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const mimeType = fmt === 'jpeg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png';
      setConvertedUrl(canvas.toDataURL(mimeType, q));
    };
  };

  const handleFormatChange = (fmt: 'png' | 'jpeg' | 'webp') => {
    setTargetFormat(fmt);
    if (imageSrc) {
      convertImage(imageSrc, fmt, 0.9);
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-10 md:py-16 z-10">
      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-text mb-3 tracking-tight">
          แปลงนามสกุลรูปภาพ (WebP ↔ PNG ↔ JPG)
        </h1>
        <p className="text-muted font-semibold text-base md:text-lg">
          แปลงนามสกุลไฟล์รูปภาพความเร็วสูงบนเบราว์เซอร์ 100% โดยไม่ต้องอัปโหลดขึ้นเซิร์ฟเวอร์
        </p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        {/* Left Side Settings */}
        <div className="lg:col-span-5 glass-panel p-6 md:p-8 flex flex-col gap-6">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95"
          >
            <Upload className="w-5 h-5" />
            <span>เลือกไฟล์รูปภาพที่ต้องการแปลง</span>
          </button>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-extrabold text-muted uppercase tracking-wider flex items-center gap-2">
              <FileImage className="w-4 h-4" /> เลือกไฟล์ปลายทาง (Target Format)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {FORMATS.map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => handleFormatChange(fmt as any)}
                  className={`py-3 rounded-xl border text-xs font-extrabold uppercase transition-all ${
                    targetFormat === fmt
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-500 shadow-sm'
                      : 'bg-surface/80 border-border text-text hover:border-emerald-500/50'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Result */}
        <div className="lg:col-span-7 glass-panel p-6 md:p-8 flex flex-col items-center justify-center min-h-[380px]">
          {convertedUrl ? (
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="relative max-h-[360px] w-full flex items-center justify-center rounded-2xl overflow-hidden bg-background/50 border border-border p-2">
                <img src={convertedUrl} alt="Converted" className="max-h-[340px] object-contain rounded-xl shadow-xl" />
              </div>
              <a
                href={convertedUrl}
                download={`${fileName}.${targetFormat}`}
                className="w-full max-w-sm py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-base rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95"
              >
                <Download className="w-5 h-5" />
                <span>ดาวน์โหลดไฟล์ .{targetFormat.toUpperCase()}</span>
              </a>
            </div>
          ) : (
            <div className="text-center p-8 text-muted/60 font-semibold text-sm">
              กรุณาเลือกไฟล์รูปภาพที่ต้องการแปลง
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
