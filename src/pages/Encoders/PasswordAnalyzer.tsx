import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ShieldAlert, Info } from 'lucide-react';

const COMMON_PATTERNS = [
  'password', 'p@ssw0rd', 'pass', '123456', '12345678', 'qwerty', 'admin', 
  'welcome', 'iloveyou', 'abc123', 'monkey', 'dragon', 'master'
];

export default function PasswordAnalyzer() {
  const [password, setPassword] = useState<string>('');

  const analyzePassword = (pwd: string) => {
    if (!pwd) {
      return {
        length: 0,
        entropy: 0,
        hasLower: false,
        hasUpper: false,
        hasNumber: false,
        hasSpecial: false,
        timeToCrack: 'กรุณาป้อนรหัสผ่าน',
        isCommonPattern: false,
        warningMsg: ''
      };
    }

    let poolSize = 0;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);

    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumber) poolSize += 10;
    if (hasSpecial) poolSize += 32;

    const length = pwd.length;
    let entropy = length > 0 && poolSize > 0 ? Math.round(length * Math.log2(poolSize)) : 0;

    // Check if password matches or contains common dictionary patterns (Leet Speak aware)
    const normalized = pwd.toLowerCase()
      .replace(/@/g, 'a')
      .replace(/\$/g, 's')
      .replace(/0/g, 'o')
      .replace(/1/g, 'i')
      .replace(/3/g, 'e')
      .replace(/!/g, 'i');

    const isCommonPattern = COMMON_PATTERNS.some(pat => normalized.includes(pat));

    let warningMsg = '';
    if (isCommonPattern) {
      entropy = Math.min(entropy, 25); // Severely drop entropy rating for leaked dictionary patterns
      warningMsg = '⚠️ รหัสผ่านนี้ใช้คำคุ้นเคยหรือแพทเทิร์นยอดฮิต (เช่น Password/Leet speak) ซึ่งแฮกเกอร์มีใน Dictionary List สามารถสุ่มเจอได้ในไม่กี่วินาที!';
    }

    // Brute force time estimate at 10 billion guesses/sec
    const combinations = Math.pow(poolSize, length);
    const seconds = combinations / 10000000000;

    let timeToCrack = 'ไม่กี่วินาที (Instant)';
    if (isCommonPattern) {
      timeToCrack = 'น้อยกว่า 1 วินาที (Dictionary Attack)';
    } else if (seconds > 31536000 * 1000) {
      timeToCrack = 'หลายร้อยปี / หลายพันล้านปี';
    } else if (seconds > 31536000) {
      timeToCrack = `ประมาณ ${Math.round(seconds / 31536000)} ปี`;
    } else if (seconds > 86400) {
      timeToCrack = `ประมาณ ${Math.round(seconds / 86400)} วัน`;
    } else if (seconds > 3600) {
      timeToCrack = `ประมาณ ${Math.round(seconds / 3600)} ชั่วโมง`;
    } else if (seconds > 60) {
      timeToCrack = `ประมาณ ${Math.round(seconds / 60)} นาที`;
    }

    return {
      length,
      entropy,
      hasLower,
      hasUpper,
      hasNumber,
      hasSpecial,
      timeToCrack,
      isCommonPattern,
      warningMsg
    };
  };

  const stats = analyzePassword(password);

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-3xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Password Entropy Analyzer</h1>
        <p className="text-muted font-medium text-lg">วิเคราะห์ความแข็งแกร่งของรหัสผ่าน ตรวจจับแพทเทิร์นเสี่ยง และคำนวณระยะเวลาในการสุ่มเดา</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-3xl p-6 md:p-8 flex flex-col gap-8"
      >
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">รหัสผ่านที่ต้องการวิเคราะห์</label>
          <input 
            type="text" 
            placeholder="ลองพิมพ์รหัสผ่านที่นี่..."
            className="w-full bg-background border border-border focus:border-emerald-500/50 rounded-xl px-4 py-3 text-text font-mono font-bold text-lg outline-none shadow-inner"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Dictionary Warning Banner */}
        {stats.isCommonPattern && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 text-red-500 text-xs font-bold leading-relaxed shadow-sm">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{stats.warningMsg}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">คะแนนความปลอดภัย (Bit Entropy)</span>
            <span className={`text-3xl font-bold ${stats.entropy < 40 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {stats.entropy} bits
            </span>
          </div>

          <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">ประมาณการเวลาในการสุ่มเดา (Crack Time)</span>
            <span className={`text-xl font-bold ${stats.isCommonPattern ? 'text-red-500' : 'text-text'}`}>
              {stats.timeToCrack}
            </span>
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
          <div className={`p-3 border rounded-xl flex items-center justify-between text-xs font-bold ${stats.hasLower ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-background border-border text-muted'}`}>
            <span>พิมพ์เล็ก (a-z)</span>
            {stats.hasLower ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </div>

          <div className={`p-3 border rounded-xl flex items-center justify-between text-xs font-bold ${stats.hasUpper ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-background border-border text-muted'}`}>
            <span>พิมพ์ใหญ่ (A-Z)</span>
            {stats.hasUpper ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </div>

          <div className={`p-3 border rounded-xl flex items-center justify-between text-xs font-bold ${stats.hasNumber ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-background border-border text-muted'}`}>
            <span>ตัวเลข (0-9)</span>
            {stats.hasNumber ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </div>

          <div className={`p-3 border rounded-xl flex items-center justify-between text-xs font-bold ${stats.hasSpecial ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-background border-border text-muted'}`}>
            <span>สัญลักษณ์ (!@#$)</span>
            {stats.hasSpecial ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </div>
        </div>

        {/* Security & Privacy Disclaimer */}
        <div className="p-4 bg-surface/50 border border-border/80 rounded-2xl flex items-start gap-3 text-xs text-muted leading-relaxed">
          <Info className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-text block mb-0.5">ข้อตกลงและเงื่อนไขการใช้งาน (Disclaimer & Privacy Guarantee):</span>
            การประมวลผลคำนวณ Bit Entropy ทั้งหมดเกิดขึ้นบนเว็บเบราว์เซอร์ของคุณ (Client-Side Only) โดยไม่มีการบันทึกหรือส่งต่อรหัสผ่านไปยังเซิร์ฟเวอร์ใดๆ ทั้งนี้ **ประมาณการเวลาในการสุ่มเดา (Crack Time)** เป็นเพียงการคำนวณทางสถิติเบื้องต้นเท่านั้น ไม่สามารถรับประกันได้ว่ารหัสผ่านจะปลอดภัย 100% จากการถูกโจมตีด้วยวิธี Brute-Force หรือเทคนิคอื่นๆ ในชีวิตจริง แนะนำให้หลีกเลี่ยงการใช้รหัสผ่านจริงในการทดสอบเพื่อความปลอดภัยสูงสุด
          </div>
        </div>
      </motion.div>
    </div>
  );
}
