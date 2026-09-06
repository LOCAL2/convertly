import { useState } from 'react';
import { motion } from 'framer-motion';
import { DownloadCloud } from 'lucide-react';

export default function DownloadCalculator() {
  const [fileSize, setFileSize] = useState<string>('50');
  const [sizeUnit, setSizeUnit] = useState<'MB' | 'GB' | 'TB'>('GB');
  const [speed, setSpeed] = useState<string>('100');
  const [speedUnit, setSpeedUnit] = useState<'Mbps' | 'Gbps' | 'MB/s'>('Mbps');

  const calculateDownloadTime = () => {
    const size = parseFloat(fileSize) || 0;
    const spd = parseFloat(speed) || 0;
    if (size <= 0 || spd <= 0) return '0s';

    // Convert file size to Megabits (Mb)
    let sizeInMb = size * 8;
    if (sizeUnit === 'MB') sizeInMb = size * 8;
    else if (sizeUnit === 'GB') sizeInMb = size * 1024 * 8;
    else if (sizeUnit === 'TB') sizeInMb = size * 1024 * 1024 * 8;

    // Convert speed to Mbps
    let speedInMbps = spd;
    if (speedUnit === 'Gbps') speedInMbps = spd * 1000;
    else if (speedUnit === 'MB/s') speedInMbps = spd * 8;

    const totalSeconds = sizeInMb / speedInMbps;

    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.round(totalSeconds % 60);

    const parts = [];
    if (hrs > 0) parts.push(`${hrs} hr`);
    if (mins > 0) parts.push(`${mins} min`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} sec`);

    return parts.join(' ');
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-3xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Data & Download Speed Calculator</h1>
        <p className="text-muted font-medium text-lg">ประเมินระยะเวลาในการดาวน์โหลดไฟล์ตามความเร็วอินเทอร์เน็ตของคุณ</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-3xl p-6 md:p-8 flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* File Size */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">ขนาดไฟล์ (File Size)</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                className="flex-1 bg-background border border-border focus:border-emerald-500/50 rounded-xl px-4 py-3 text-text font-bold text-lg outline-none shadow-inner"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
              />
              <select
                value={sizeUnit}
                onChange={(e) => setSizeUnit(e.target.value as any)}
                className="bg-background border border-border rounded-xl px-3 py-3 font-bold text-text outline-none cursor-pointer"
              >
                <option value="MB">MB</option>
                <option value="GB">GB</option>
                <option value="TB">TB</option>
              </select>
            </div>
          </div>

          {/* Download Speed */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">ความเร็วอินเทอร์เน็ต (Speed)</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                className="flex-1 bg-background border border-border focus:border-emerald-500/50 rounded-xl px-4 py-3 text-text font-bold text-lg outline-none shadow-inner"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
              />
              <select
                value={speedUnit}
                onChange={(e) => setSpeedUnit(e.target.value as any)}
                className="bg-background border border-border rounded-xl px-3 py-3 font-bold text-text outline-none cursor-pointer"
              >
                <option value="Mbps">Mbps</option>
                <option value="Gbps">Gbps</option>
                <option value="MB/s">MB/s</option>
              </select>
            </div>
          </div>
        </div>

        {/* Output Time Estimate Card */}
        <div className="p-8 bg-surface border border-border rounded-2xl flex flex-col items-center justify-center gap-2 text-center shadow-sm">
          <DownloadCloud className="w-8 h-8 text-emerald-500 mb-1" />
          <span className="text-xs font-bold text-muted uppercase tracking-widest">Estimated Download Time</span>
          <span className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            {calculateDownloadTime()}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
