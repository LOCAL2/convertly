import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

type Mode = 'work' | 'shortBreak' | 'longBreak';

const MODE_CONFIG: Record<Mode, { name: string; time: number; color: string }> = {
  work: { name: 'Work Focus', time: 25 * 60, color: 'text-emerald-500' },
  shortBreak: { name: 'Short Break', time: 5 * 60, color: 'text-cyan-500' },
  longBreak: { name: 'Long Break', time: 15 * 60, color: 'text-blue-500' },
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_CONFIG.work.time);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === 'work') {
        setCompletedSessions((prev) => prev + 1);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setTimeLeft(MODE_CONFIG[newMode].time);
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_CONFIG[mode].time);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progress = ((MODE_CONFIG[mode].time - timeLeft) / MODE_CONFIG[mode].time) * 100;

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Pomodoro Timer</h1>
        <p className="text-muted font-medium text-lg">เพิ่มสมาธิในการทำงานด้วยเทคนิคแบ่งเวลา 25/5 นาที</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-xl p-8 md:p-10 flex flex-col items-center gap-8"
      >
        {/* Mode Selector */}
        <div className="flex bg-background border border-border p-1.5 rounded-2xl w-full max-w-md">
          <button
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              mode === 'work' ? 'bg-emerald-500 text-white shadow-md' : 'text-muted hover:text-text'
            }`}
            onClick={() => switchMode('work')}
          >
            <Brain className="w-4 h-4" /> Work
          </button>
          <button
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              mode === 'shortBreak' ? 'bg-cyan-500 text-white shadow-md' : 'text-muted hover:text-text'
            }`}
            onClick={() => switchMode('shortBreak')}
          >
            <Coffee className="w-4 h-4" /> Short Break
          </button>
          <button
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              mode === 'longBreak' ? 'bg-blue-500 text-white shadow-md' : 'text-muted hover:text-text'
            }`}
            onClick={() => switchMode('longBreak')}
          >
            <Coffee className="w-4 h-4" /> Long Break
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative w-64 h-64 flex flex-col items-center justify-center my-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-border stroke-current"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`${MODE_CONFIG[mode].color} stroke-current transition-all duration-300`}
              strokeWidth="6"
              strokeDasharray="276"
              strokeDashoffset={276 - (276 * progress) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-6xl font-bold text-text tracking-wider font-mono">{formattedTime}</span>
            <span className="text-xs font-bold text-muted uppercase tracking-widest mt-2">{MODE_CONFIG[mode].name}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-16 h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          </button>
          <button
            onClick={resetTimer}
            className="w-16 h-16 rounded-2xl bg-background border border-border text-muted hover:text-text font-bold flex items-center justify-center hover:bg-surface transition-all"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Completed Sessions Counter */}
        <div className="text-xs font-bold text-muted uppercase tracking-widest pt-4 border-t border-border w-full text-center">
          Completed Sessions: <span className="text-emerald-500 font-bold text-sm ml-1">{completedSessions}</span> 🍅
        </div>
      </motion.div>
    </div>
  );
}
