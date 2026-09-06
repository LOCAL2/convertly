import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DiscountCalc() {
  const [price, setPrice] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');
  const [tax, setTax] = useState<string>('');

  const p = parseFloat(price) || 0;
  const d = parseFloat(discount) || 0;
  const t = parseFloat(tax) || 0;

  const discountAmount = p * (d / 100);
  const priceAfterDiscount = p - discountAmount;
  const taxAmount = priceAfterDiscount * (t / 100);
  const finalPrice = priceAfterDiscount + taxAmount;

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-2xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Discount Calculator</h1>
        <p className="text-muted font-medium text-lg">คำนวณราคาสุทธิหลังหักส่วนลดและภาษีมูลค่าเพิ่มได้อย่างแม่นยำ</p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel w-full max-w-2xl p-8 md:p-10 flex flex-col gap-8"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">ราคาตั้งต้น (ราคาปกติ)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">$ / ฿</span>
              <input 
                type="number" 
                className="w-full bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-xl pl-12 pr-4 py-3 text-text font-medium text-lg outline-none shadow-inner"
                value={price}
                placeholder="เช่น 100"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">ส่วนลด (%)</label>
            <div className="relative">
              <input 
                type="number" 
                className="w-full bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-xl pl-4 pr-8 py-3 text-text font-medium text-lg outline-none shadow-inner"
                value={discount}
                placeholder="เช่น 20"
                onChange={(e) => setDiscount(e.target.value)}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted font-bold">%</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">ภาษีมูลค่าเพิ่ม (%)</label>
            <div className="relative">
              <input 
                type="number" 
                className="w-full bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-xl pl-4 pr-8 py-3 text-text font-medium text-lg outline-none shadow-inner"
                value={tax}
                placeholder="เช่น 7"
                onChange={(e) => setTax(e.target.value)}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted font-bold">%</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-8 bg-surface border border-border rounded-2xl flex flex-col gap-4 shadow-sm">
          <div className="flex justify-between items-center text-muted font-medium pb-4 border-b border-border">
            <span>ราคาปกติ</span>
            <span>฿{p.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-medium pb-4 border-b border-border">
            <span>จำนวนส่วนลด</span>
            <span>-฿{discountAmount.toFixed(2)}</span>
          </div>
          {t > 0 && (
            <div className="flex justify-between items-center text-red-500 dark:text-red-400 font-medium pb-4 border-b border-border">
              <span>จำนวนภาษี</span>
              <span>+฿{taxAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2">
            <span className="text-xl font-bold text-text">ราคาสุทธิ</span>
            <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              ฿{finalPrice.toFixed(2)}
            </span>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
