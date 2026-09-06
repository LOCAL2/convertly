import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, RefreshCw } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';

type IdType = 'uuid' | 'hd_serial' | 'volume_id' | 'mac' | 'hwid';

const ID_TYPE_OPTIONS = [
  { value: 'uuid', label: 'UUID / GUID v4 (Standard 128-bit)' },
  { value: 'hd_serial', label: 'Hard Disk Serial Number (WD/Seagate Format)' },
  { value: 'volume_id', label: 'Disk Volume Serial ID (e.g. 4A2F-8B91)' },
  { value: 'mac', label: 'Hardware MAC Address (e.g. 70:85:C2:4E:91:F3)' },
  { value: 'hwid', label: 'Machine HWID / License GUID' },
];

export default function UuidGenerator() {
  const [idType, setIdType] = useState<IdType>('uuid');
  const [count, setCount] = useState<number>(5);
  const [generatedIds, setGeneratedIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Helper functions for random hardware specs simulation
  const randomHex = (len: number) => {
    const chars = '0123456789ABCDEF';
    return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const generateSingleId = (type: IdType): string => {
    switch (type) {
      case 'uuid':
        return crypto.randomUUID();

      case 'hd_serial': {
        const brands = ['WD-WCC', 'SGT-ST', 'SAM-NVME', 'KST-SND'];
        const prefix = brands[Math.floor(Math.random() * brands.length)];
        return `${prefix}${randomHex(8)}`;
      }

      case 'volume_id':
        return `${randomHex(4)}-${randomHex(4)}`;

      case 'mac': {
        const bytes = Array.from({ length: 6 }, () => randomHex(2));
        return bytes.join(':');
      }

      case 'hwid':
        return `{${randomHex(8)}-${randomHex(4)}-${randomHex(4)}-${randomHex(4)}-${randomHex(12)}}`;

      default:
        return crypto.randomUUID();
    }
  };

  const generate = () => {
    let amt = count;
    if (amt < 1) amt = 1;
    if (amt > 500) amt = 500;

    const list = Array.from({ length: amt }, () => generateSingleId(idType));
    setGeneratedIds(list);
  };

  // Initial generation
  useState(() => {
    generate();
  });

  const copyToClipboard = () => {
    if (!generatedIds.length) return;
    navigator.clipboard.writeText(generatedIds.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-3xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">UUID & Hardware ID Generator</h1>
        <p className="text-muted font-medium text-lg">สร้าง UUID v4, Hard Disk Serial Number, Volume ID และ Hardware Unique ID (HWID)</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-3xl p-6 md:p-8 flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">เลือกประเภท ID ที่ต้องการสร้าง</label>
            <CustomSelect
              value={idType}
              onChange={(val) => {
                setIdType(val as IdType);
              }}
              options={ID_TYPE_OPTIONS}
              size="md"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">จำนวนชุดที่ต้องการสร้าง (1 - 500)</label>
            <div className="flex gap-3">
              <input 
                type="number"
                min="1" max="500"
                className="w-full bg-background border border-border focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-text font-bold text-sm outline-none shadow-inner"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              />
              <button 
                onClick={generate}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95 whitespace-nowrap"
              >
                <RefreshCw size={16} />
                สร้างไอดี
              </button>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2 relative mt-2">
          <div className="flex justify-between items-end">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">รายการ ID ที่สร้างเสร็จแล้ว ({generatedIds.length} รายการ)</label>
            {copied && <span className="text-xs font-bold text-emerald-500 mr-1 animate-pulse">Copied!</span>}
          </div>
          <div className="relative">
            <textarea 
              className="w-full min-h-[280px] bg-background border border-border focus:border-emerald-500/50 rounded-2xl p-5 pr-12 text-emerald-600 dark:text-emerald-400 font-mono text-sm resize-none outline-none shadow-inner break-all"
              value={generatedIds.join('\n')}
              readOnly
              spellCheck="false"
            />
            <button 
              onClick={copyToClipboard}
              className="absolute right-4 top-4 p-2 text-muted hover:text-emerald-500 bg-surface border border-border shadow-sm hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all active:scale-95"
              title="Copy All"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
