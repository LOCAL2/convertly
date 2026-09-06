import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function UnixTimestamp() {
  const [timestamp, setTimestamp] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [localTime, setLocalTime] = useState<string>('');
  const [utcTime, setUtcTime] = useState<string>('');
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLive) {
      interval = setInterval(() => {
        setTimestamp(Math.floor(Date.now() / 1000).toString());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  useEffect(() => {
    const num = parseInt(timestamp, 10);
    if (!isNaN(num)) {
      // Create date from seconds
      const date = new Date(num * 1000);
      setLocalTime(date.toLocaleString());
      setUtcTime(date.toUTCString());
    } else {
      setLocalTime('Invalid timestamp');
      setUtcTime('Invalid timestamp');
    }
  }, [timestamp]);

  const handleTimestampChange = (val: string) => {
    setIsLive(false);
    setTimestamp(val);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-accent/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-2xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Unix Timestamp</h1>
        <p className="text-muted font-medium text-lg">แปลงเวลา Epoch Timestamp เป็นวันที่และเวลาที่อ่านเข้าใจง่าย</p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel w-full max-w-2xl p-8 md:p-10"
      >
        <div className="relative z-10 flex flex-col gap-8">
          
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Timestamp (Seconds)</label>
              <button 
                onClick={() => setIsLive(!isLive)}
                className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors ${
                  isLive ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-surface border-border text-muted hover:text-text'
                }`}
              >
                {isLive ? 'Live Sync: ON' : 'Live Sync: OFF'}
              </button>
            </div>
            
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
              <input 
                type="number" 
                className="w-full bg-background border border-border focus:border-accent/50 focus:ring-1 focus:ring-accent/50 rounded-xl pl-12 pr-5 py-4 text-text font-medium text-xl outline-none transition-all shadow-inner font-mono tracking-wider"
                value={timestamp}
                onChange={(e) => handleTimestampChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            <div className="p-5 bg-surface border border-border rounded-2xl relative overflow-hidden group shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <div className="text-xs font-bold text-muted mb-2 uppercase tracking-widest">Local Time</div>
              <div className="text-xl md:text-2xl font-bold text-text tracking-tight">{localTime}</div>
            </div>

            <div className="p-5 bg-surface border border-border rounded-2xl relative overflow-hidden group shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <div className="text-xs font-bold text-muted mb-2 uppercase tracking-widest">UTC Time</div>
              <div className="text-xl md:text-2xl font-bold text-text tracking-tight">{utcTime}</div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
