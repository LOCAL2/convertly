import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Clock, Calendar } from 'lucide-react';

export default function SalaryCalculator() {
  const [salary, setSalary] = useState<string>('');
  const [period, setPeriod] = useState<'annual' | 'monthly'>('monthly');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('40');
  const [daysPerWeek, setDaysPerWeek] = useState<string>('5');
  const weeksPerYear = 52;

  const sal = parseFloat(salary) || 0;
  const hpw = parseFloat(hoursPerWeek) || 1;
  const dpw = parseFloat(daysPerWeek) || 1;
  const wpy = weeksPerYear || 1;

  const annualSalary = period === 'annual' ? sal : sal * 12;
  const monthlySalary = period === 'monthly' ? sal : annualSalary / 12;
  const weeklySalary = annualSalary / wpy;
  const dailySalary = weeklySalary / dpw;
  const hourlyRate = weeklySalary / hpw;

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-3xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Salary to Hourly Calculator</h1>
        <p className="text-muted font-medium text-lg">คำนวณและแปลงเงินเดือนรายเดือน/รายปี เป็นรายชั่วโมง รายวัน และรายสัปดาห์</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-3xl p-8 md:p-10 flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">จำนวนเงินฐานเงินเดือน</label>
            <div className="relative flex">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">$ / ฿</span>
              <input 
                type="number" 
                className="w-full bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-xl pl-16 pr-4 py-3 text-text font-medium text-lg outline-none shadow-inner"
                value={salary}
                placeholder="เช่น 50000"
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">รอบการจ่ายเงิน</label>
            <div className="flex bg-background border border-border p-1 rounded-xl">
              <button
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${period === 'monthly' ? 'bg-emerald-500 text-white shadow-md' : 'text-muted hover:text-text'}`}
                onClick={() => setPeriod('monthly')}
              >
                รายเดือน (Monthly)
              </button>
              <button
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${period === 'annual' ? 'bg-emerald-500 text-white shadow-md' : 'text-muted hover:text-text'}`}
                onClick={() => setPeriod('annual')}
              >
                รายปี (Annual)
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">จำนวนชั่วโมงทำงาน / สัปดาห์</label>
            <input 
              type="number" 
              className="w-full bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-xl px-4 py-3 text-text font-medium text-lg outline-none shadow-inner"
              value={hoursPerWeek}
              placeholder="40"
              onChange={(e) => setHoursPerWeek(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">จำนวนวันทำงาน / สัปดาห์</label>
            <input 
              type="number" 
              className="w-full bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-xl px-4 py-3 text-text font-medium text-lg outline-none shadow-inner"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(e.target.value)}
            />
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4 text-emerald-500" /> ค่าจ้างรายชั่วโมง
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {hourlyRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-emerald-500" /> ค่าจ้างรายวัน
            </div>
            <div className="text-2xl font-bold text-text mt-1">
              {dailySalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-emerald-500" /> ค่าจ้างรายสัปดาห์
            </div>
            <div className="text-2xl font-bold text-text mt-1">
              {weeklySalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider">
              <DollarSign className="w-4 h-4 text-emerald-500" /> รายได้รายเดือน
            </div>
            <div className="text-2xl font-bold text-text mt-1">
              {monthlySalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1 sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wider">
              <DollarSign className="w-4 h-4 text-emerald-500" /> รายได้รวมต่อปี
            </div>
            <div className="text-2xl font-bold text-text mt-1">
              {annualSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
