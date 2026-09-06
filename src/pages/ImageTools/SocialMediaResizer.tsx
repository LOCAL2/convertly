import { useState, useRef } from 'react';
import { Upload, Download } from 'lucide-react';

const PRESET_RATIOS = [
  { label: 'IG Post (1:1)', ratio: 1 / 1 },
  { label: 'IG Story / Reel (9:16)', ratio: 9 / 16 },
  { label: 'YouTube Thumbnail (16:9)', ratio: 16 / 9 },
  { label: 'Facebook Cover (205:78)', ratio: 205 / 78 },
  { label: 'Twitter Header (3:1)', ratio: 3 / 1 },
];

export default function SocialMediaResizer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedRatio, setSelectedRatio] = useState(PRESET_RATIOS[0]);
  const [resizedDataUrl, setResizedDataUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      processResize(src, selectedRatio.ratio);
    };
    reader.readAsDataURL(file);
  };

  const processResize = (src: string, targetRatio: number) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let sourceWidth = img.width;
      let sourceHeight = img.height;

      let drawWidth = sourceWidth;
      let drawHeight = sourceHeight;
      let offsetX = 0;
      let offsetY = 0;

      const currentRatio = sourceWidth / sourceHeight;

      if (currentRatio > targetRatio) {
        drawWidth = sourceHeight * targetRatio;
        offsetX = (sourceWidth - drawWidth) / 2;
      } else {
        drawHeight = sourceWidth / targetRatio;
        offsetY = (sourceHeight - drawHeight) / 2;
      }

      canvas.width = Math.min(1920, Math.round(drawWidth));
      canvas.height = Math.round(canvas.width / targetRatio);

      ctx.drawImage(
        img,
        offsetX, offsetY, drawWidth, drawHeight,
        0, 0, canvas.width, canvas.height
      );

      setResizedDataUrl(canvas.toDataURL('image/png'));
    };
  };

  const handleRatioSelect = (item: typeof PRESET_RATIOS[0]) => {
    setSelectedRatio(item);
    if (imageSrc) {
      processResize(imageSrc, item.ratio);
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-10 md:py-16 z-10">
      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-text mb-3 tracking-tight">
          ครอบตัดย่อขนาดรูปตามสัดส่วนโซเชียล (Social Media Resizer)
        </h1>
        <p className="text-muted font-semibold text-base md:text-lg">
          ย่อตัดรูปภาพตามอัตราส่วนมาตรฐานโซเชียลมีเดีย (1:1, 9:16, 16:9, FB Cover, IG Story)
        </p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        {/* Left Side Controls */}
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
            <span>เลือกรูปภาพจากเครื่อง</span>
          </button>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-extrabold text-muted uppercase tracking-wider">
              เลือกสัดส่วนโซเชียล (Aspect Ratio)
            </span>
            <div className="flex flex-col gap-2">
              {PRESET_RATIOS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRatioSelect(item)}
                  className={`p-3.5 rounded-xl border text-xs font-extrabold transition-all flex items-center justify-between ${
                    selectedRatio.label === item.label
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-500 shadow-sm'
                      : 'bg-surface/80 border-border text-text hover:border-emerald-500/50'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Preview & Download */}
        <div className="lg:col-span-7 glass-panel p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px]">
          {resizedDataUrl ? (
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="relative max-h-[380px] w-full flex items-center justify-center rounded-2xl overflow-hidden bg-background/50 border border-border p-2">
                <img src={resizedDataUrl} alt="Resized" className="max-h-[360px] object-contain rounded-xl shadow-xl" />
              </div>
              <a
                href={resizedDataUrl}
                download={`convertly-social-resized.png`}
                className="w-full max-w-sm py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-base rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95"
              >
                <Download className="w-5 h-5" />
                <span>ดาวน์โหลดรูปภาพที่ปรับแล้ว</span>
              </a>
            </div>
          ) : (
            <div className="text-center p-8 text-muted/60 font-semibold text-sm">
              กรุณาอัปโหลดรูปภาพทางด้านซ้ายเพื่อพรีวิวสัดส่วน
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
