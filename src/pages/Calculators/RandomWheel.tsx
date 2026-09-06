import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Trash2, Trophy, Copy, Check, Shuffle, Utensils, Dice5, HelpCircle, Layers } from 'lucide-react';

interface WheelOption {
  id: string;
  text: string;
  color: string;
}

const PRESET_PALETTES = [
  '#10B981', '#06B6D4', '#3B82F6', '#6366F1', 
  '#8B5CF6', '#EC4899', '#F43F5E', '#F59E0B', '#84CC16', '#14B8A6'
];

const PRESETS = {
  FOOD: ['กะเพราไข่ดาว', 'ก๋วยเตี๋ยวเรือ', 'ส้มตำไก่ย่าง', 'สุกี้น้ำ/แห้ง', 'ข้าวมันไก่', 'ข้าวขาหมู', 'ชาบู / หมูกระทะ', 'พาสต้า / สปาเก็ตตี้'],
  NUMBERS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  YES_NO: ['ใช่ (Yes)', 'ไม่ใช่ (No)', 'ลองหมุนอีกรอบ'],
  TEAMS: ['ทีม A', 'ทีม B', 'ทีม C', 'ทีม D']
};

export default function RandomWheel() {
  const [options, setOptions] = useState<WheelOption[]>([]);
  
  const [newText, setNewText] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentRotationRef = useRef(0);

  // High-Precision Canvas Rendering with retina sharpness
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 18;

    ctx.clearRect(0, 0, width, height);

    if (options.length === 0) {
      ctx.fillStyle = '#9CA3AF';
      ctx.font = 'bold 16px Prompt, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('โปรดเพิ่มตัวเลือกอย่างน้อย 2 รายการ', centerX, centerY);
      return;
    }

    const arc = (2 * Math.PI) / options.length;

    options.forEach((opt, i) => {
      const angle = i * arc;
      ctx.beginPath();
      ctx.fillStyle = opt.color;
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arc);
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      // Divider Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Slice Text Formatting
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px Prompt, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 5;
      
      const maxTextLen = 14;
      const displayText = opt.text.length > maxTextLen ? opt.text.substring(0, maxTextLen) + '...' : opt.text;
      ctx.fillText(displayText, radius - 24, 5);
      ctx.restore();
    });

    // Sleek Metallic Outer Border Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Center Gold/Emerald Stopper Pin
    ctx.beginPath();
    ctx.arc(centerX, centerY, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Inner Pin Core Glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#10B981';
    ctx.fill();
  };

  useEffect(() => {
    drawWheel();
  }, [options]);

  const [winnerObj, setWinnerObj] = useState<WheelOption | null>(null);

  const handleSpin = () => {
    if (isSpinning || options.length < 2) return;

    setIsSpinning(true);
    setWinner(null);
    setWinnerObj(null);
    setShowWinnerModal(false);

    // Pick winning index randomly first
    const winningIndex = Math.floor(Math.random() * options.length);
    const sliceAngle = 360 / options.length;
    
    // Target angle to position winning slice center exactly at TOP needle (270deg / 90deg offset)
    const sliceCenterAngle = winningIndex * sliceAngle + sliceAngle / 2;
    const targetDegreeAtTop = (270 - sliceCenterAngle + 360) % 360;

    const extraTurns = 6 + Math.floor(Math.random() * 4); // 6 to 9 full spins
    const currentRot = currentRotationRef.current;
    const currentBaseRot = currentRot - (currentRot % 360);
    let targetRotation = currentBaseRot + extraTurns * 360 + targetDegreeAtTop;
    
    if (targetRotation <= currentRot) {
      targetRotation += 360;
    }

    currentRotationRef.current = targetRotation;
    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const winOpt = options[winningIndex] || options[0];
      setWinner(winOpt.text);
      setWinnerObj(winOpt);
      setShowWinnerModal(true);
    }, 4500);
  };

  const resetWheelRotation = () => {
    currentRotationRef.current = 0;
    setRotation(0);
  };

  const handleRemoveWinner = () => {
    if (winnerObj) {
      setOptions(prev => prev.filter(o => o.id !== winnerObj.id));
      resetWheelRotation();
      setShowWinnerModal(false);
    }
  };

  const handleAddOption = () => {
    if (!newText.trim()) return;
    const newOpt: WheelOption = {
      id: Date.now().toString(),
      text: newText.trim(),
      color: PRESET_PALETTES[options.length % PRESET_PALETTES.length]
    };
    setOptions([...options, newOpt]);
    setNewText('');
    resetWheelRotation();
  };

  const handleRemoveOption = (id: string) => {
    setOptions(options.filter(o => o.id !== id));
    resetWheelRotation();
  };

  const applyPreset = (presetList: string[]) => {
    setOptions(
      presetList.map((text, idx) => ({
        id: `${idx}-${Date.now()}`,
        text,
        color: PRESET_PALETTES[idx % PRESET_PALETTES.length]
      }))
    );
    resetWheelRotation();
    setWinner(null);
  };

  const handleShuffle = () => {
    const shuffled = [...options].sort(() => Math.random() - 0.5);
    setOptions(shuffled);
    resetWheelRotation();
  };

  const handleCopyWinner = () => {
    if (winner) {
      navigator.clipboard.writeText(winner);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-10 md:py-16 z-10">
      {/* Header Title without Sparkles icon */}
      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-text mb-3 tracking-tight">
          วงล้อสุ่มเลือก (Random Decision Wheel)
        </h1>
        <p className="text-muted font-semibold text-base md:text-lg">
          สุ่มเลือกอาหาร กิจกรรม หรือตัวเลือกต่างๆ ด้วยระบบฟิสิกส์การหมุนที่เที่ยงตรงและลื่นไหล
        </p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        {/* Left Side: Interactive Wheel Canvas Showcase */}
        <div className="lg:col-span-7 glass-panel p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl backdrop-blur-3xl">
          {/* Top Pointer Needle Arrow (Professional Sleek Design) */}
          <div className="absolute top-8 z-30 flex flex-col items-center pointer-events-none drop-shadow-2xl">
            <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[36px] border-t-red-500 filter drop-shadow-xl" />
          </div>

          {/* Wheel Canvas Container */}
          <div className="relative w-[340px] h-[340px] md:w-[440px] md:h-[440px] flex items-center justify-center my-6">
            <div 
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4.5s cubic-bezier(0.15, 0.99, 0.24, 0.99)' : 'none'
              }}
              className="w-full h-full"
            >
              <canvas
                ref={canvasRef}
                width={440}
                height={440}
                className="w-full h-full rounded-full shadow-2xl"
              />
            </div>
          </div>

          {/* Action Spin Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning || options.length < 2}
            className="w-full max-w-sm py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-black text-lg md:text-xl rounded-2xl transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3 active:scale-95 mt-2"
          >
            <Play className={`w-6 h-6 fill-current ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'กำลังหมุนวงล้อ...' : 'หมุนวงล้อสุ่มเลือก!'}</span>
          </button>
        </div>

        {/* Right Side: Professional Options & Presets Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Presets Card */}
          <div className="glass-panel p-6 flex flex-col gap-3">
            <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4" /> เมนูพรีเซ็ตยอดนิยม (Presets)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={isSpinning}
                onClick={() => applyPreset(PRESETS.FOOD)}
                className="px-3.5 py-2.5 bg-surface/80 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/50 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-xs font-bold text-text hover:text-emerald-500 transition-all flex items-center gap-2"
              >
                <Utensils className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>เมนูอาหาร</span>
              </button>
              <button
                disabled={isSpinning}
                onClick={() => applyPreset(PRESETS.YES_NO)}
                className="px-3.5 py-2.5 bg-surface/80 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/50 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-xs font-bold text-text hover:text-emerald-500 transition-all flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>ใช่ / ไม่ใช่</span>
              </button>
              <button
                disabled={isSpinning}
                onClick={() => applyPreset(PRESETS.NUMBERS)}
                className="px-3.5 py-2.5 bg-surface/80 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/50 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-xs font-bold text-text hover:text-emerald-500 transition-all flex items-center gap-2"
              >
                <Dice5 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>ตัวเลข 1-10</span>
              </button>
              <button
                disabled={isSpinning}
                onClick={() => applyPreset(PRESETS.TEAMS)}
                className="px-3.5 py-2.5 bg-surface/80 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/50 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-xs font-bold text-text hover:text-emerald-500 transition-all flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>จัดทีม A,B,C</span>
              </button>
            </div>
          </div>

          {/* Managing Options Card */}
          <div className="glass-panel p-6 flex flex-col gap-5 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-muted uppercase tracking-widest">
                รายการตัวเลือก ({options.length})
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={isSpinning}
                  onClick={handleShuffle}
                  title="สลับลำดับตัวเลือก"
                  className="p-2 bg-surface/80 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/50 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-xs font-bold text-text hover:text-emerald-500 transition-all flex items-center gap-1.5"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>สลับตำแหน่ง</span>
                </button>
                <button
                  disabled={isSpinning}
                  onClick={() => setOptions([])}
                  className="p-2 bg-surface/80 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-xs font-bold text-muted hover:text-red-500 transition-all"
                  title="ล้างทั้งหมด"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Input Add */}
            <div className="flex gap-2">
              <input
                type="text"
                disabled={isSpinning}
                placeholder="เพิ่มตัวเลือก เช่น กะเพราไข่ดาว..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isSpinning && handleAddOption()}
                className="flex-1 bg-background/50 border border-border/80 focus:border-emerald-500/50 disabled:opacity-40 rounded-xl px-4 py-2.5 text-text font-bold text-sm outline-none shadow-inner"
              />
              <button
                disabled={isSpinning || !newText.trim()}
                onClick={handleAddOption}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:pointer-events-none text-white font-extrabold rounded-xl text-sm transition-all flex items-center justify-center shrink-0 active:scale-95 shadow-md"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {options.length === 0 ? (
                <div className="text-center py-8 text-muted/60 font-semibold text-sm">
                  ยังไม่มีตัวเลือก กดเลือกพรีเซ็ตด้านบนหรือพิมพ์เพิ่มได้เลยครับ
                </div>
              ) : (
                options.map((opt) => (
                  <div
                    key={opt.id}
                    className="p-3 bg-surface/80 border border-border/80 rounded-xl flex items-center justify-between group hover:border-emerald-500/40 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0 shadow-sm"
                        style={{ backgroundColor: opt.color }}
                      />
                      <span className="text-sm font-bold text-text">{opt.text}</span>
                    </div>
                    <button
                      disabled={isSpinning}
                      onClick={() => handleRemoveOption(opt.id)}
                      className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/10 disabled:opacity-40 disabled:pointer-events-none rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      <AnimatePresence>
        {showWinnerModal && winner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="glass-panel p-8 max-w-md w-full text-center flex flex-col items-center gap-5 border border-emerald-500/50 shadow-2xl relative"
            >
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shadow-lg backdrop-blur-xl">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest">
                  ผลลัพธ์การสุ่มได้แก่!
                </span>
                <h2 className="text-3xl font-black text-text tracking-tight mt-1.5 break-all">
                  {winner}
                </h2>
              </div>

              <div className="flex flex-col gap-2.5 w-full mt-2">
                <button
                  onClick={handleRemoveWinner}
                  className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 hover:text-red-400 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>ตัดตัวเลือกนี้ออกจากวงล้อ</span>
                </button>
                <div className="flex items-center gap-2.5 w-full">
                  <button
                    onClick={handleCopyWinner}
                    className="flex-1 py-3 bg-surface border border-border hover:border-emerald-500/50 rounded-xl text-xs font-extrabold text-text hover:text-emerald-500 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                  </button>
                  <button
                    onClick={() => setShowWinnerModal(false)}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg active:scale-95"
                  >
                    เก็บไว้ตามเดิม
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
