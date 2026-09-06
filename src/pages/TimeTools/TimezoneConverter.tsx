import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, Trash2, Globe } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';

interface CountryTimezone {
  id: string;
  flag: string;
  country: string;
  countryEn: string;
  city: string;
  zone: string;
  continent?: string;
}

const ALL_COUNTRIES: Omit<CountryTimezone, 'id'>[] = [
  // Asia & Pacific
  { flag: '🇹🇭', country: 'ไทย (Thailand)', countryEn: 'Thailand', city: 'กรุงเทพฯ / นนทบุรี', zone: 'Asia/Bangkok', continent: 'เอเชีย & แปซิฟิก' },
  { flag: '🇯🇵', country: 'ญี่ปุ่น (Japan)', countryEn: 'Japan', city: 'โตเกียว (JST)', zone: 'Asia/Tokyo', continent: 'เอเชีย & แปซิฟิก' },
  { flag: '🇰🇷', country: 'เกาหลีใต้ (South Korea)', countryEn: 'South Korea', city: 'โซล (KST)', zone: 'Asia/Seoul', continent: 'เอเชีย & แปซิฟิก' },
  { flag: '🇸🇬', country: 'สิงคโปร์ (Singapore)', countryEn: 'Singapore', city: 'สิงคโปร์ (SGT)', zone: 'Asia/Singapore', continent: 'เอเชีย & แปซิฟิก' },
  { flag: '🇨🇳', country: 'จีน (China)', countryEn: 'China', city: 'ปักกิ่ง / เซี่ยงไฮ้ (CST)', zone: 'Asia/Shanghai', continent: 'เอเชีย & แปซิฟิก' },
  { flag: '🇭🇰', country: 'ฮ่องกง (Hong Kong)', countryEn: 'Hong Kong', city: 'ฮ่องกง (HKT)', zone: 'Asia/Hong_Kong', continent: 'เอเชีย & แปซิฟิก' },
  { flag: '🇹🇼', country: 'ไต้หวัน (Taiwan)', countryEn: 'Taiwan', city: 'ไทเป (NST)', zone: 'Asia/Taipei', continent: 'เอเชีย & แปซิฟิก' },
  { flag: '🇻🇳', country: 'เวียดนาม (Vietnam)', countryEn: 'Vietnam', city: 'ฮานอย / โฮจิมินห์ (ICT)', zone: 'Asia/Ho_Chi_Minh', continent: 'เอเชีย & แปซิฟิก' },
  { flag: '🇲🇾', country: 'มาเลเซีย (Malaysia)', countryEn: 'Malaysia', city: 'กัวลาลัมเปอร์ (MYT)', zone: 'Asia/Kuala_Lumpur', continent: 'เอเชีย & แปซิฟิก' },
  { flag: '🇮🇩', country: 'อินโดนีเซีย (Indonesia)', countryEn: 'Indonesia', city: 'จาการ์ตา (WIB)', zone: 'Asia/Jakarta', continent: 'เอเชีย & แปซิฟิก' },
  { flag: '🇵🇭', country: 'ฟิลิปปินส์ (Philippines)', countryEn: 'Philippines', city: 'มะนิลา (PST)', zone: 'Asia/Manila', continent: 'เอเชีย & แปซิฟิก' },
  { flag: '🇮🇳', country: 'อินเดีย (India)', countryEn: 'India', city: 'นิวเดลี / มุมไบ (IST)', zone: 'Asia/Kolkata', continent: 'เอเชีย & แปซิฟิก' },
  { flag: '🇵🇰', country: 'ปากีสถาน (Pakistan)', countryEn: 'Pakistan', city: 'การาจี (PKT)', zone: 'Asia/Karachi', continent: 'เอเชีย & แปซิฟิก' },
  { flag: '🇦🇺', country: 'ออสเตรเลีย (Australia - ซิดนีย์)', countryEn: 'Australia Sydney', city: 'ซิดนีย์ (AEST)', zone: 'Australia/Sydney', continent: 'เอเชีย & แปซิฟิก' },
  { flag: '🇦🇺', country: 'ออสเตรเลีย (Australia - เพิร์ธ)', countryEn: 'Australia Perth', city: 'เพิร์ธ (AWST)', zone: 'Australia/Perth', continent: 'เอเชีย & แปซิฟิก' },
  { flag: '🇳🇿', country: 'นิวซีแลนด์ (New Zealand)', countryEn: 'New Zealand', city: 'ออกแลนด์ (NZST)', zone: 'Pacific/Auckland', continent: 'เอเชีย & แปซิฟิก' },

  // Europe
  { flag: '🇬🇧', country: 'สหราชอาณาจักร (UK)', countryEn: 'United Kingdom', city: 'ลอนดอน (GMT/BST)', zone: 'Europe/London', continent: 'ยุโรป' },
  { flag: '🇩🇪', country: 'เยอรมนี (Germany)', countryEn: 'Germany', city: 'เบอร์ลิน / แฟรงก์เฟิร์ต (CET)', zone: 'Europe/Berlin', continent: 'ยุโรป' },
  { flag: '🇫🇷', country: 'ฝรั่งเศส (France)', countryEn: 'France', city: 'ปารีส (CET)', zone: 'Europe/Paris', continent: 'ยุโรป' },
  { flag: '🇮🇹', country: 'อิตาลี (Italy)', countryEn: 'Italy', city: 'โรม / มิลาน (CET)', zone: 'Europe/Rome', continent: 'ยุโรป' },
  { flag: '🇪🇸', country: 'สเปน (Spain)', countryEn: 'Spain', city: 'มาดริด (CET)', zone: 'Europe/Madrid', continent: 'ยุโรป' },
  { flag: '🇳🇱', country: 'เนเธอร์แลนด์ (Netherlands)', countryEn: 'Netherlands', city: 'อัมสเตอร์ดัม (CET)', zone: 'Europe/Amsterdam', continent: 'ยุโรป' },
  { flag: '🇨🇭', country: 'สวิตเซอร์แลนด์ (Switzerland)', countryEn: 'Switzerland', city: 'ซูริก / เจนีวา (CET)', zone: 'Europe/Zurich', continent: 'ยุโรป' },
  { flag: '🇸🇪', country: 'สวีเดน (Sweden)', countryEn: 'Sweden', city: 'สตอกโฮล์ม (CET)', zone: 'Europe/Stockholm', continent: 'ยุโรป' },
  { flag: '🇳🇴', country: 'นอร์เวย์ (Norway)', countryEn: 'Norway', city: 'ออสโล (CET)', zone: 'Europe/Oslo', continent: 'ยุโรป' },
  { flag: '🇷🇺', country: 'รัสเซีย (Russia - มอสโก)', countryEn: 'Russia Moscow', city: 'มอสโก (MSK)', zone: 'Europe/Moscow', continent: 'ยุโรป' },
  { flag: '🇹🇷', country: 'ตุรกี (Turkey)', countryEn: 'Turkey', city: 'อิสตันบูล (TRT)', zone: 'Europe/Istanbul', continent: 'ยุโรป' },

  // Americas
  { flag: '🇺🇸', country: 'สหรัฐอเมริกา (USA - นิวยอร์ก)', countryEn: 'United States NYC', city: 'นิวยอร์ก (EST/EDT)', zone: 'America/New_York', continent: 'อเมริกา' },
  { flag: '🇺🇸', country: 'สหรัฐอเมริกา (USA - ลอสแอนเจลิส)', countryEn: 'United States LA', city: 'ลอสแอนเจลิส (PST/PDT)', zone: 'America/Los_Angeles', continent: 'อเมริกา' },
  { flag: '🇺🇸', country: 'สหรัฐอเมริกา (USA - ชิคาโก)', countryEn: 'United States Chicago', city: 'ชิคาโก (CST/CDT)', zone: 'America/Chicago', continent: 'อเมริกา' },
  { flag: '🇨🇦', country: 'แคนาดา (Canada - โทรอนโต)', countryEn: 'Canada Toronto', city: 'โทรอนโต (EST)', zone: 'America/Toronto', continent: 'อเมริกา' },
  { flag: '🇨🇦', country: 'แคนาดา (Canada - แวนคูเวอร์)', countryEn: 'Canada Vancouver', city: 'แวนคูเวอร์ (PST)', zone: 'America/Vancouver', continent: 'อเมริกา' },
  { flag: '🇲🇽', country: 'เม็กซิโก (Mexico)', countryEn: 'Mexico', city: 'เม็กซิโกซิตี (CST)', zone: 'America/Mexico_City', continent: 'อเมริกา' },
  { flag: '🇧🇷', country: 'บราซิล (Brazil)', countryEn: 'Brazil', city: 'เซาเปาโล / บราซีเลีย (BRT)', zone: 'America/Sao_Paulo', continent: 'อเมริกา' },
  { flag: '🇦🇷', country: 'อาร์เจนตินา (Argentina)', countryEn: 'Argentina', city: 'บัวโนสไอเรส (ART)', zone: 'America/Argentina/Buenos_Aires', continent: 'อเมริกา' },

  // Middle East & Africa
  { flag: '🇦🇪', country: 'สหรัฐอาหรับเอมิเรตส์ (UAE)', countryEn: 'UAE', city: 'ดูไบ / อาบูดาบี (GST)', zone: 'Asia/Dubai', continent: 'ตะวันออกกลาง & แอฟริกา' },
  { flag: '🇸🇦', country: 'ซาอุดีอาระเบีย (Saudi Arabia)', countryEn: 'Saudi Arabia', city: 'ริยาด (AST)', zone: 'Asia/Riyadh', continent: 'ตะวันออกกลาง & แอฟริกา' },
  { flag: '🇶🇦', country: 'กาตาร์ (Qatar)', countryEn: 'Qatar', city: 'โดฮา (AST)', zone: 'Asia/Qatar', continent: 'ตะวันออกกลาง & แอฟริกา' },
  { flag: '🇮🇱', country: 'อิสราเอล (Israel)', countryEn: 'Israel', city: 'เทลอาวีฟ (IST)', zone: 'Asia/Tel_Aviv', continent: 'ตะวันออกกลาง & แอฟริกา' },
  { flag: '🇪🇬', country: 'อียิปต์ (Egypt)', countryEn: 'Egypt', city: 'ไคโร (EEST)', zone: 'Africa/Cairo', continent: 'ตะวันออกกลาง & แอฟริกา' },
  { flag: '🇿🇦', country: 'แอฟริกาใต้ (South Africa)', countryEn: 'South Africa', city: 'โยฮันเนสเบิร์ก (SAST)', zone: 'Africa/Johannesburg', continent: 'ตะวันออกกลาง & แอฟริกา' },

  // UTC Standard
  { flag: '🌐', country: 'เวลาสากลเชิงพิกัด (UTC)', countryEn: 'UTC', city: 'UTC / GMT', zone: 'UTC', continent: 'มาตรฐานสากล' },
];

export default function TimezoneConverter() {
  const [nowDate, setNowDate] = useState<Date>(new Date());
  const [isManual, setIsManual] = useState<boolean>(false);
  const [manualDateStr, setManualDateStr] = useState<string>('');

  // Live real-time clock ticking every second
  useEffect(() => {
    if (isManual) return;
    const update = () => setNowDate(new Date());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isManual]);

  const [activeList, setActiveList] = useState<CountryTimezone[]>([
    { id: '1', ...ALL_COUNTRIES[0] }, // Thailand
    { id: '2', ...ALL_COUNTRIES[1] }, // Japan
    { id: '3', ...ALL_COUNTRIES[16] }, // UK
    { id: '4', ...ALL_COUNTRIES[27] }, // USA NYC
  ]);

  const [selectedToAdd, setSelectedToAdd] = useState<string>('');

  // Current base Date object being evaluated
  const currentBaseDate = isManual && manualDateStr ? new Date(manualDateStr) : nowDate;

  const getTimeInZone = (timeZone: string) => {
    try {
      return new Intl.DateTimeFormat('th-TH', {
        timeZone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(currentBaseDate);
    } catch (e) {
      return 'รูปแบบเวลาไม่ถูกต้อง';
    }
  };

  // Convert Date object to datetime-local string format
  const formatForInput = (d: Date) => {
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  const handleAddCountry = () => {
    if (!selectedToAdd) return;
    const target = ALL_COUNTRIES.find(c => c.zone === selectedToAdd && !activeList.some(a => a.zone === selectedToAdd));
    if (target) {
      setActiveList([...activeList, { id: Date.now().toString(), ...target }]);
      setSelectedToAdd('');
    }
  };

  const removeCountry = (id: string) => {
    setActiveList(activeList.filter((c) => c.id !== id));
  };

  const groups = [
    'เอเชีย & แปซิฟิก',
    'ยุโรป',
    'อเมริกา',
    'ตะวันออกกลาง & แอฟริกา',
    'มาตรฐานสากล'
  ].map(continent => ({
    label: continent,
    options: ALL_COUNTRIES
      .filter(c => c.continent === continent)
      .map(c => ({
        value: c.zone,
        label: `${c.flag} ${c.country} (${c.city})`,
        disabled: activeList.some(a => a.zone === c.zone)
      }))
  }));

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-3xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Timezone Converter</h1>
        <p className="text-muted font-medium text-lg">เปรียบเทียบและแปลงเวลาตามเขตเวลาครอบคลุมทั่วโลกกว่า 40+ ประเทศ</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-3xl p-6 md:p-8 flex flex-col gap-8"
      >
        {/* Base Input */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" /> เลือกวันและเวลาต้นทาง
            </label>
            {isManual && (
              <button
                onClick={() => setIsManual(false)}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                สลับกลับเป็นเวลาจริง Real-time
              </button>
            )}
          </div>
          <div className="relative w-full flex items-center">
            <input 
              type="datetime-local" 
              className="w-full bg-background border border-border focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl px-4 py-3.5 text-text font-bold text-lg outline-none shadow-inner cursor-pointer"
              value={isManual ? manualDateStr : formatForInput(nowDate)}
              onChange={(e) => {
                setManualDateStr(e.target.value);
                setIsManual(true);
              }}
            />
          </div>
        </div>

        {/* Add Country Selector */}
        <div className="flex flex-col sm:flex-row gap-3 items-center p-4 bg-surface border border-border rounded-2xl">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-muted uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-500" /> เพิ่มประเทศเปรียบเทียบ (ทั่วโลก)
            </label>
            <CustomSelect
              value={selectedToAdd}
              onChange={(val) => setSelectedToAdd(val)}
              placeholder="-- ค้นหาหรือเลือกประเทศ --"
              groups={groups}
              size="md"
            />
          </div>
          <button
            onClick={handleAddCountry}
            disabled={!selectedToAdd}
            className="w-full sm:w-auto mt-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> เพิ่มประเทศ
          </button>
        </div>

        {/* Timezones List */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-muted uppercase tracking-wider">เวลาเปรียบเทียบแต่ละประเทศ</h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {activeList.map((item) => (
              <div 
                key={item.id}
                className="p-4 md:p-5 bg-surface border border-border rounded-2xl flex items-center justify-between shadow-sm hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl md:text-4xl select-none leading-none">
                    {item.flag}
                  </div>
                  <div>
                    <div className="font-bold text-text text-base md:text-lg flex items-center gap-2">
                      {item.country}
                    </div>
                    <div className="text-xs font-medium text-muted">{item.city} ({item.zone})</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-5">
                  <div className="text-right">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 text-base md:text-xl font-mono">
                      {getTimeInZone(item.zone)}
                    </div>
                  </div>
                  {activeList.length > 1 && (
                    <button 
                      onClick={() => removeCountry(item.id)}
                      className="text-muted hover:text-red-500 p-2 rounded-lg transition-colors"
                      title="ลบประเทศนี้"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
