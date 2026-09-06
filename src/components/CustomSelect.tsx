import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string | React.ReactNode;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options?: SelectOption[];
  groups?: SelectGroup[];
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CustomSelect({
  value,
  onChange,
  options,
  groups,
  placeholder = 'เลือกตัวเลือก...',
  className = '',
  size = 'md',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten options for easy label lookup
  const allOptions: SelectOption[] = [
    ...(options || []),
    ...(groups ? groups.flatMap((g) => g.options) : []),
  ];

  const selectedOption = allOptions.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-4 py-3 text-base rounded-2xl',
  };

  return (
    <div ref={containerRef} className={`relative inline-block w-full text-left select-none ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 bg-surface/90 dark:bg-background/90 backdrop-blur-md border border-border hover:border-emerald-500/50 dark:hover:border-emerald-500/50 text-text font-bold shadow-sm transition-all duration-200 outline-none ${
          sizeClasses[size]
        } ${isOpen ? 'ring-2 ring-emerald-500/50 border-emerald-500/50 shadow-emerald-500/10' : ''}`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span>{selectedOption.icon}</span>}
              <span className="truncate">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-muted/70 font-medium">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`}
        />
      </button>

      {/* Glassmorphism Options Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto bg-surface/95 dark:bg-background/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 divide-y divide-border/20 custom-scrollbar"
          >
            {options && options.length > 0 && (
              <div className="py-1">
                {options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <div
                      key={opt.value}
                      onClick={() => {
                        if (!opt.disabled) {
                          onChange(opt.value);
                          setIsOpen(false);
                        }
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all ${
                        opt.disabled
                          ? 'opacity-40 cursor-not-allowed'
                          : isSelected
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold'
                          : 'hover:bg-black/5 dark:hover:bg-white/5 text-text/90'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        {opt.icon && <span>{opt.icon}</span>}
                        <span>{opt.label}</span>
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            )}

            {groups &&
              groups.map((group, idx) => (
                <div key={idx} className="py-1.5 first:pt-0 last:pb-0">
                  <div className="px-3 py-1 text-[10px] font-bold text-muted/70 uppercase tracking-wider select-none">
                    {group.label}
                  </div>
                  {group.options.map((opt) => {
                    const isSelected = opt.value === value;
                    return (
                      <div
                        key={opt.value}
                        onClick={() => {
                          if (!opt.disabled) {
                            onChange(opt.value);
                            setIsOpen(false);
                          }
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all ${
                          opt.disabled
                            ? 'opacity-40 cursor-not-allowed'
                            : isSelected
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold'
                            : 'hover:bg-black/5 dark:hover:bg-white/5 text-text/90'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          {opt.icon && <span>{opt.icon}</span>}
                          <span>{opt.label}</span>
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
