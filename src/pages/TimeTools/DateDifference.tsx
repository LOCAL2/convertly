import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function DateDifference() {
  const [date1, setDate1] = useState<string>('');
  const [date2, setDate2] = useState<string>('');
  
  const [diff, setDiff] = useState<{
    days: number,
    hours: number,
    minutes: number,
    totalDays: string,
    totalHours: string
  } | null>(null);

  useEffect(() => {
    // Set default dates (today and tomorrow)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format to YYYY-MM-DDTHH:mm
    const format = (d: Date) => {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setDate1(format(today));
    setDate2(format(tomorrow));
  }, []);

  useEffect(() => {
    if (!date1 || !date2) {
      setDiff(null);
      return;
    }

    const d1 = new Date(date1).getTime();
    const d2 = new Date(date2).getTime();
    
    if (isNaN(d1) || isNaN(d2)) {
      setDiff(null);
      return;
    }

    let diffMs = Math.abs(d2 - d1);

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    diffMs -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    diffMs -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diffMs / (1000 * 60));

    const totalDays = (Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)).toFixed(2);
    const totalHours = (Math.abs(d2 - d1) / (1000 * 60 * 60)).toFixed(2);

    setDiff({ days, hours, minutes, totalDays, totalHours });
  }, [date1, date2]);

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="w-full max-w-2xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Date Difference</h1>
        <p className="text-muted font-medium text-lg">คำนวณระยะห่างของจำนวนวัน เดือน ปี ระหว่างวันที่สองวันได้อย่างแม่นยำ</p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel w-full max-w-2xl p-8 flex flex-col gap-8"
      >
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">วันที่และเวลาเริ่มต้น</label>
            <input 
              type="datetime-local"
              className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl p-4 text-text font-medium outline-none shadow-inner"
              value={date1}
              onChange={(e) => setDate1(e.target.value)}
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">วันที่และเวลาสิ้นสุด</label>
            <input 
              type="datetime-local"
              className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl p-4 text-text font-medium outline-none shadow-inner"
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
            />
          </div>
        </div>

        {diff && (
          <div className="mt-4 p-6 bg-surface border border-border rounded-xl flex flex-col gap-6">
            <div className="text-center">
              <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">ผลต่างที่แน่นอน</span>
              <div className="text-2xl font-bold text-text flex items-center justify-center gap-2 flex-wrap">
                {diff.days > 0 && <span>{diff.days} <span className="text-muted font-medium text-base">days</span></span>}
                {diff.hours > 0 && <span>{diff.hours} <span className="text-muted font-medium text-base">hours</span></span>}
                {diff.minutes > 0 && <span>{diff.minutes} <span className="text-muted font-medium text-base">minutes</span></span>}
                {diff.days === 0 && diff.hours === 0 && diff.minutes === 0 && <span>0 minutes</span>}
              </div>
            </div>
            
            <div className="h-px w-full bg-border"></div>
            
            <div className="flex justify-around text-center">
              <div>
                <span className="text-xs font-bold text-muted uppercase tracking-widest block">รวม (วัน)</span>
                <span className="text-xl font-bold text-text">{diff.totalDays}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-muted uppercase tracking-widest block">รวม (ชั่วโมง)</span>
                <span className="text-xl font-bold text-text">{diff.totalHours}</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
