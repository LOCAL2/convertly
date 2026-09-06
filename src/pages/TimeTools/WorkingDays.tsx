import { useState } from 'react';
import { motion } from 'framer-motion';

// ฐานข้อมูลวันหยุดนักขัตฤกษ์และวันหยุดชดเชยของไทย 2024-2026
const THAI_HOLIDAYS: Record<string, string> = {
  // 2024
  '2024-01-01': 'วันขึ้นปีใหม่',
  '2024-02-26': 'วันชดเชยวันมาฆบูชา',
  '2024-04-08': 'วันชดเชยวันจักรี',
  '2024-04-13': 'วันสงกรานต์',
  '2024-04-14': 'วันสงกรานต์',
  '2024-04-15': 'วันสงกรานต์',
  '2024-04-16': 'วันชดเชยวันสงกรานต์',
  '2024-05-01': 'วันแรงงานแห่งชาติ',
  '2024-05-06': 'วันชดเชยวันฉัตรมงคล',
  '2024-05-22': 'วันวิสาขบูชา',
  '2024-06-03': 'วันเฉลิมพระชนมพรรษา สมเด็จพระนางเจ้าฯ พระบรมราชินี',
  '2024-07-22': 'วันชดเชยวันอาสาฬหบูชา',
  '2024-07-28': 'วันเฉลิมพระชนมพรรษา พระบาทสมเด็จพระเจ้าอยู่หัว',
  '2024-07-29': 'วันชดเชยวันเฉลิมพระชนมพรรษา ร.10',
  '2024-08-12': 'วันแม่แห่งชาติ',
  '2024-10-13': 'วันคล้ายวันสวรรคต ร.9',
  '2024-10-14': 'วันชดเชยวันคล้ายวันสวรรคต ร.9',
  '2024-10-23': 'วันปิยมหาราช',
  '2024-12-05': 'วันพ่อแห่งชาติ',
  '2024-12-10': 'วันรัฐธรรมนูญ',
  '2024-12-31': 'วันสิ้นปี',

  // 2025
  '2025-01-01': 'วันขึ้นปีใหม่',
  '2025-02-12': 'วันมาฆบูชา',
  '2025-04-06': 'วันจักรี',
  '2025-04-07': 'วันชดเชยวันจักรี',
  '2025-04-13': 'วันสงกรานต์',
  '2025-04-14': 'วันสงกรานต์',
  '2025-04-15': 'วันสงกรานต์',
  '2025-05-01': 'วันแรงงานแห่งชาติ',
  '2025-05-04': 'วันฉัตรมงคล',
  '2025-05-05': 'วันชดเชยวันฉัตรมงคล',
  '2025-05-11': 'วันวิสาขบูชา',
  '2025-05-12': 'วันชดเชยวันวิสาขบูชา',
  '2025-06-03': 'วันเฉลิมพระชนมพรรษา สมเด็จพระนางเจ้าฯ พระบรมราชินี',
  '2025-07-10': 'วันอาสาฬหบูชา',
  '2025-07-28': 'วันเฉลิมพระชนมพรรษา พระบาทสมเด็จพระเจ้าอยู่หัว',
  '2025-08-12': 'วันแม่แห่งชาติ',
  '2025-10-13': 'วันนวมินทรมหาราช',
  '2025-10-23': 'วันปิยมหาราช',
  '2025-12-05': 'วันพ่อแห่งชาติ',
  '2025-12-10': 'วันรัฐธรรมนูญ',
  '2025-12-31': 'วันสิ้นปี',

  // 2026
  '2026-01-01': 'วันขึ้นปีใหม่',
  '2026-03-03': 'วันมาฆบูชา',
  '2026-04-06': 'วันจักรี',
  '2026-04-13': 'วันสงกรานต์',
  '2026-04-14': 'วันสงกรานต์',
  '2026-04-15': 'วันสงกรานต์',
  '2026-05-01': 'วันแรงงานแห่งชาติ',
  '2026-05-04': 'วันฉัตรมงคล',
  '2026-05-31': 'วันวิสาขบูชา',
  '2026-06-01': 'วันชดเชยวันวิสาขบูชา',
  '2026-06-03': 'วันเฉลิมพระชนมพรรษา สมเด็จพระนางเจ้าฯ พระบรมราชินี',
  '2026-07-29': 'วันอาสาฬหบูชา',
  '2026-07-28': 'วันเฉลิมพระชนมพรรษา พระบาทสมเด็จพระเจ้าอยู่หัว',
  '2026-08-12': 'วันแม่แห่งชาติ',
  '2026-10-13': 'วันนวมินทรมหาราช',
  '2026-10-23': 'วันปิยมหาราช',
  '2026-12-05': 'วันพ่อแห่งชาติ',
  '2026-12-07': 'วันชดเชยวันพ่อแห่งชาติ',
  '2026-12-10': 'วันรัฐธรรมนูญ',
  '2026-12-31': 'วันสิ้นปี',
};

export default function WorkingDays() {
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // Default 14 days ahead
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  const calculateWorkingDays = () => {
    if (!startDate || !endDate) return { workingDays: 0, weekendDays: 0, holidayDays: 0, totalDays: 0, holidaysList: [] };
    
    const [sYear, sMonth, sDay] = startDate.split('-').map(Number);
    const [eYear, eMonth, eDay] = endDate.split('-').map(Number);

    const start = new Date(sYear, sMonth - 1, sDay);
    const end = new Date(eYear, eMonth - 1, eDay);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return { workingDays: 0, weekendDays: 0, holidayDays: 0, totalDays: 0, holidaysList: [] };
    }

    let workingDays = 0;
    let weekendDays = 0;
    let holidayDays = 0;
    let totalDays = 0;
    const holidaysList: { date: string; name: string }[] = [];

    const curr = new Date(start);
    while (curr <= end) {
      totalDays++;
      const dayOfWeek = curr.getDay();
      
      const y = curr.getFullYear();
      const m = String(curr.getMonth() + 1).padStart(2, '0');
      const d = String(curr.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendDays++;
        if (THAI_HOLIDAYS[dateStr]) {
          holidaysList.push({ date: dateStr, name: `${THAI_HOLIDAYS[dateStr]} (ตรงกับวันเสาร์-อาทิตย์)` });
        }
      } else if (THAI_HOLIDAYS[dateStr]) {
        holidayDays++;
        holidaysList.push({ date: dateStr, name: THAI_HOLIDAYS[dateStr] });
      } else {
        workingDays++;
      }
      curr.setDate(curr.getDate() + 1);
    }

    return { workingDays, weekendDays, holidayDays, totalDays, holidaysList };
  };

  const result = calculateWorkingDays();

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-3xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Thai Working Days Calculator</h1>
        <p className="text-muted font-medium text-lg">คำนวณจำนวนวันทำงานสุทธิ หักวันเสาร์-อาทิตย์ และวันหยุดนักขัตฤกษ์ของไทย</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-3xl p-6 md:p-8 flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">วันเริ่มต้น (Start Date)</label>
            <input 
              type="date" 
              className="w-full bg-background border border-border focus:border-emerald-500/50 rounded-xl px-4 py-3 text-text font-bold text-lg outline-none shadow-inner"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">วันสิ้นสุด (End Date)</label>
            <input 
              type="date" 
              className="w-full bg-background border border-border focus:border-emerald-500/50 rounded-xl px-4 py-3 text-text font-bold text-lg outline-none shadow-inner"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1 col-span-2 sm:col-span-1">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">วันทำงานสุทธิ</span>
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{result.workingDays} วัน</span>
          </div>

          <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">เสาร์ - อาทิตย์</span>
            <span className="text-2xl font-bold text-text mt-1">{result.weekendDays} วัน</span>
          </div>

          <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">วันหยุดนักขัตฤกษ์</span>
            <span className="text-2xl font-bold text-text mt-1">{result.holidayDays} วัน</span>
          </div>

          <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">รวมทั้งหมด</span>
            <span className="text-2xl font-bold text-text mt-1">{result.totalDays} วัน</span>
          </div>
        </div>

        {/* Holidays matched in range */}
        {result.holidaysList.length > 0 && (
          <div className="flex flex-col gap-3 pt-4 border-t border-border/60">
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider">รายชื่อวันหยุดนักขัตฤกษ์ในช่วงเวลานี้</h3>
            <div className="flex flex-col gap-2">
              {result.holidaysList.map((h, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold">
                  <span className="text-text">{h.name}</span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">{h.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
