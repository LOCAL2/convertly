import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, Ruler, Binary, Clock, Code, Palette, Type, 
  Image as ImageIcon, Network, DollarSign, Calculator, Menu, X, Lock, Hexagon, Target
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navCategories = [
  { name: 'หน้าหลัก', path: '/', icon: Home },
  { name: 'แปลงหน่วย (Unit Converters)', path: '/unit-converters', icon: Ruler, subItems: [
    { name: 'ความยาว (Length)', path: '/unit-converters/length' },
    { name: 'น้ำหนัก (Weight)', path: '/unit-converters/weight' },
    { name: 'อุณหภูมิ (Temperature)', path: '/unit-converters/temperature' },
    { name: 'Data & Download Speed', path: '/unit-converters/download-calculator' }
  ]},
  { name: 'ตัวเลข (Number Tools)', path: '/number-tools', icon: Binary, subItems: [
    { name: 'ฐานเลข (Decimal ↔ Binary)', path: '/number-tools/decimal-binary' },
    { name: 'เลขโรมัน (Roman Numerals)', path: '/number-tools/roman-numerals' }
  ]},
  { name: 'เวลา (Time Tools)', path: '/time-tools', icon: Clock, subItems: [
    { name: 'Unix Timestamp', path: '/time-tools/unix-timestamp' },
    { name: 'หาผลต่างวัน (Date Difference)', path: '/time-tools/date-difference' },
    { name: 'Timezone Converter', path: '/time-tools/timezone-converter' },
    { name: 'Pomodoro Timer', path: '/time-tools/pomodoro-timer' },
    { name: 'Thai Working Days & Countdown', path: '/time-tools/working-days' }
  ]},
  { name: 'นักพัฒนา (Developer Tools)', path: '/developer-tools', icon: Code, subItems: [
    { name: 'จัดรูปแบบ JSON', path: '/developer-tools/json-formatter' },
    { name: 'JSON ↔ CSV / Excel', path: '/developer-tools/json-to-csv' },
    { name: 'CSS Minifier / Formatter', path: '/developer-tools/css-formatter' },
    { name: 'จัดรูปแบบ SQL', path: '/developer-tools/sql-formatter' },
    { name: 'Git Cheat Sheet', path: '/developer-tools/git-cheatsheet' },
    { name: 'Box Shadow / Neumorphism', path: '/developer-tools/shadow-generator' },
    { name: 'สร้าง UUID', path: '/developer-tools/uuid-generator' },
    { name: 'JSON ➔ TS / Schema', path: '/developer-tools/json-to-types' },
    { name: 'cURL Code Converter', path: '/developer-tools/curl-converter' },
    { name: 'REST API Client Tester', path: '/developer-tools/api-tester' },
    { name: 'YAML ↔ JSON Converter', path: '/developer-tools/yaml-json-toml' },
    { name: 'Code Comment Remover', path: '/developer-tools/comment-remover' }
  ]},
  { name: 'รหัส (Encoders / Decoders)', path: '/encoders-decoders', icon: Lock, subItems: [
    { name: 'Text Base64', path: '/encoders-decoders/text-base64' },
    { name: 'Text Base32', path: '/encoders-decoders/text-base32' },
    { name: 'URL Encode', path: '/encoders-decoders/url-encode' },
    { name: 'HTML Entity', path: '/encoders-decoders/html-entity' },
    { name: 'JWT Decoder', path: '/encoders-decoders/jwt-decoder' },
    { name: 'Hash Generator', path: '/encoders-decoders/hash-generator' },
    { name: 'สุ่มรหัสผ่าน (Password)', path: '/encoders-decoders/password-generator' },
    { name: 'Bcrypt Hash Generator', path: '/encoders-decoders/bcrypt-generator' },
    { name: 'RSA Key Pair Generator', path: '/encoders-decoders/rsa-generator' },
    { name: 'AES-256 Encrypt / Decrypt', path: '/encoders-decoders/aes-encrypt' },
    { name: 'Password Entropy Analyzer', path: '/encoders-decoders/password-analyzer' }
  ]},
  { name: 'สี & ดีไซน์ (Color & UI Tools)', path: '/color-tools', icon: Palette, subItems: [
    { name: 'HEX ↔ RGB', path: '/color-tools/hex-rgb' },
    { name: 'RGB ↔ HSL', path: '/color-tools/rgb-hsl' },
    { name: 'Gradient Generator', path: '/color-tools/gradient-generator' },
    { name: 'Contrast Checker', path: '/color-tools/contrast-checker' },
    { name: 'Glassmorphism Generator', path: '/color-tools/glassmorphism-generator' },
    { name: 'Color Palette Generator', path: '/color-tools/palette-generator' },
    { name: 'Aspect Ratio Calculator', path: '/color-tools/aspect-ratio-calculator' },
    { name: 'Font Pair Previewer', path: '/color-tools/font-pair-previewer' }
  ]},
  { name: 'ข้อความ (Text Tools)', path: '/text-tools', icon: Type, subItems: [
    { name: 'นับคำ (Word Counter)', path: '/text-tools/word-counter' },
    { name: 'เปลี่ยนตัวพิมพ์ (Case Converter)', path: '/text-tools/case-converter' },
    { name: 'เปรียบเทียบข้อความ (Text Diff)', path: '/text-tools/text-diff' },
    { name: 'Lorem Ipsum Generator', path: '/text-tools/lorem-ipsum' },
    { name: 'Markdown Editor & Preview', path: '/text-tools/markdown-editor' }
  ]},
  { name: 'รูปภาพ (Image Tools)', path: '/image-tools', icon: ImageIcon, subItems: [
    { name: 'Base64 Encode', path: '/image-tools/base64-encode' },
    { name: 'SVG Optimizer', path: '/image-tools/svg-optimizer' },
    { name: 'สร้าง QR Code', path: '/image-tools/qr-generator' },
    { name: 'บีบอัดรูปภาพ (Compressor)', path: '/image-tools/image-compressor' },
    { name: 'Favicon Generator', path: '/image-tools/favicon-generator' },
    { name: 'Image Crop & Resizer', path: '/image-tools/image-cropper' },
    { name: 'EXIF Metadata Viewer', path: '/image-tools/exif-viewer' },
    { name: 'SVG Code Editor', path: '/image-tools/svg-editor' },
    { name: 'ย่อขนาดภาพโซเชียล (Social Resizer)', path: '/image-tools/social-resizer' },
    { name: 'แปลงไฟล์ WebP/PNG/JPG', path: '/image-tools/format-converter' },
    { name: 'สร้าง ASCII Art Banner', path: '/image-tools/ascii-art' }
  ]},
  { name: 'เครือข่าย (Network Tools)', path: '/network-tools', icon: Network, subItems: [
    { name: 'แยก URL (URL Parser)', path: '/network-tools/url-parser' },
    { name: 'IP Subnet', path: '/network-tools/ip-subnet' },
    { name: 'User-Agent Parser', path: '/network-tools/user-agent-parser' },
    { name: 'DNS Lookup', path: '/network-tools/dns-lookup' },
    { name: 'SSL Certificate Checker', path: '/network-tools/ssl-checker' },
    { name: 'Subnet Calculator (CIDR)', path: '/network-tools/cidr-calculator' },
    { name: 'HTTP Header & CORS Analyzer', path: '/network-tools/header-analyzer' },
    { name: 'Nginx / Htaccess Generator', path: '/network-tools/nginx-htaccess-generator' }
  ]},
  { name: 'การเงิน (Finance Tools)', path: '/finance-tools', icon: DollarSign, subItems: [
    { name: 'คำนวณส่วนลด', path: '/finance-tools/discount-calculator' },
    { name: 'คำนวณสินเชื่อ (Loan)', path: '/finance-tools/loan-calculator' },
    { name: 'Salary to Hourly', path: '/finance-tools/salary-calculator' },
    { name: 'Split Bill & Tip', path: '/finance-tools/split-bill' },
    { name: 'Compound Interest', path: '/finance-tools/compound-interest' }
  ]},
  { name: 'เครื่องคิดเลข (Calculators)', path: '/calculators', icon: Calculator, subItems: [
    { name: 'เปอร์เซ็นต์ (Percentage)', path: '/calculators/percentage' },
    { name: 'คำนวณ BMI', path: '/calculators/bmi' },
    { name: 'วงล้อสุ่มเลือก (Random Wheel)', path: '/calculators/random-wheel' }
  ]},
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-surface/80 backdrop-blur-xl rounded-xl border border-glass-border text-text shadow-lg hover:bg-surface transition-colors"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-[280px] bg-background/90 dark:bg-background/95 backdrop-blur-2xl border-r border-border shadow-2xl flex flex-col transform transition-transform duration-400 ease-out md:translate-x-0 overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="sticky top-0 z-10 flex items-center p-6 border-b border-white/5 bg-background/90 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-primary/20 blur-xl"></div>
              <Hexagon className="text-primary relative z-10" size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col -gap-1">
              <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                Convertly
              </span>
            </div>
          </div>
        </div>

        {/* Floating Quick Focus Button */}
        {location.pathname !== '/' && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => {
              const activeEl = document.querySelector('.sidebar-active-item');
              if (activeEl) {
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="sticky top-20 z-20 mx-4 my-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 backdrop-blur-md rounded-xl text-primary font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10 group cursor-pointer"
            title="Locate Current Active Menu"
          >
            <Target className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
            <span>Locate Active Menu</span>
          </motion.button>
        )}
        
        <nav className="flex-1 p-4 flex flex-col gap-1 pb-20">
          {navCategories.map((category) => (
            <div key={category.path} className="mb-2">
              {category.path === '/' ? (
                <NavLink 
                  to={category.path} 
                  className={({ isActive }) => cn(
                    "group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer relative overflow-hidden",
                    isActive 
                      ? "text-text bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-inner" 
                      : "text-muted hover:text-text hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                  end
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div layoutId="activeNav" className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full shadow-[0_0_10px_var(--primary)]" />
                      )}
                      <category.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-primary" : "group-hover:text-primary transition-colors"} />
                      <span>{category.name}</span>
                    </>
                  )}
                </NavLink>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 mt-2 text-[11px] font-bold uppercase tracking-widest text-muted/60">
                    <category.icon size={16} strokeWidth={2} />
                    <span>{category.name}</span>
                  </div>
                  
                  <div className="flex flex-col mt-1 space-y-1">
                    {category.subItems?.map(sub => (
                      <NavLink 
                        key={sub.path}
                        to={sub.path} 
                        ref={(node) => {
                          if (node && location.pathname === sub.path) {
                            node.scrollIntoView({ block: 'center', behavior: 'smooth' });
                          }
                        }}
                        className={({ isActive }) => cn(
                          "relative pl-12 pr-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer",
                          isActive 
                            ? "text-primary bg-primary/10 sidebar-active-item" 
                            : "text-muted/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-text"
                        )}
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <motion.div layoutId="activeSubNav" className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                            )}
                            {sub.name}
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>

      </aside>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
    </>
  );
}
