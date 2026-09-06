import { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download, Copy, Check } from 'lucide-react';

export default function QrGenerator() {
  const [text, setText] = useState<string>('');
  const [size, setSize] = useState<number>(240);
  const [fgColor, setFgColor] = useState<string>('#8b5cf6');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [copied, setCopied] = useState<boolean>(false);

  // Using public QR API URL for pure SVG/PNG rendering
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    text
  )}&color=${fgColor.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}&margin=10`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrApiUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcode_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download QR code error:', err);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(qrApiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 px-4 md:px-8 z-10">
      {/* Header */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 uppercase tracking-wider">
            <QrCode size={18} />
            <span>Image & Media Tools</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">QR Code Generator</h1>
          <p className="text-muted text-sm font-medium mt-1">
            สร้าง QR Code จาก URL, ข้อความ หรือเบอร์โทร ปรับเปลี่ยนสีและดาวน์โหลดรูปภาพไปใช้งานได้ทันที
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-5xl">
        {/* Left Inputs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-6 flex flex-col gap-6">
          <div className="glass-panel p-6 flex flex-col gap-5">
            <h2 className="text-base font-bold text-text">ตั้งค่าข้อมูล QR Code</h2>

            {/* Input Data */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted uppercase">ข้อความ หรือ URL</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="ระบุข้อความ หรือ https://..."
                className="w-full h-28 bg-background border border-border rounded-xl p-3 text-sm text-text font-mono resize-none outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            {/* Colors Picker */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted uppercase">สีตัว QR (Foreground)</label>
                <div className="flex items-center gap-2 bg-background border border-border p-2 rounded-xl">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                  />
                  <span className="text-xs font-mono text-text">{fgColor}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted uppercase">สีพื้นหลัง (Background)</label>
                <div className="flex items-center gap-2 bg-background border border-border p-2 rounded-xl">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                  />
                  <span className="text-xs font-mono text-text">{bgColor}</span>
                </div>
              </div>
            </div>

            {/* Size Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted">ขนาดรูปภาพ (Size):</span>
                <span className="text-primary font-mono">{size}x{size} px</span>
              </div>
              <input
                type="range"
                min="120"
                max="500"
                step="20"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-primary bg-background cursor-pointer"
              />
            </div>
          </div>
        </motion.div>

        {/* Right Live Preview Box */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-6 flex flex-col gap-6">
          <div className="glass-panel p-8 flex flex-col items-center justify-center gap-6 text-center h-full">
            <div className="p-4 rounded-3xl bg-white shadow-2xl border border-white/20">
              <img src={qrApiUrl} alt="Generated QR Code" className="w-56 h-56 object-contain" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleDownload}
                disabled={!text}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Download size={16} />
                <span>ดาวน์โหลด PNG</span>
              </button>

              <button
                onClick={handleCopyUrl}
                disabled={!text}
                className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border hover:bg-black/5 dark:hover:bg-white/10 text-text rounded-xl text-sm font-medium transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                <span>{copied ? 'คัดลอกลิงก์แล้ว' : 'คัดลอก Image URL'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
