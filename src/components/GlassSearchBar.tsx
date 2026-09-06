import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchItem {
  name: string;
  category: string;
  path: string;
  keywords?: string[];
}

const SEARCH_ITEMS: SearchItem[] = [
  // Unit Converters
  { name: 'แปลงหน่วยความยาว (Length)', category: 'แปลงหน่วย', path: '/unit-converters/length', keywords: ['cm', 'meter', 'km', 'inch', 'feet'] },
  { name: 'แปลงหน่วยน้ำหนัก (Weight)', category: 'แปลงหน่วย', path: '/unit-converters/weight', keywords: ['kg', 'pound', 'gram', 'ton'] },
  { name: 'แปลงอุณหภูมิ (Temperature)', category: 'แปลงหน่วย', path: '/unit-converters/temperature', keywords: ['celsius', 'fahrenheit', 'kelvin'] },
  { name: 'Data & Download Speed', category: 'แปลงหน่วย', path: '/unit-converters/download-calculator', keywords: ['mbps', 'bandwidth', 'speed', 'eta'] },

  // Number Tools
  { name: 'แปลงฐานเลข (Decimal ↔ Binary)', category: 'ตัวเลข', path: '/number-tools/decimal-binary', keywords: ['hex', 'octal', 'binary', 'base10'] },
  { name: 'เลขโรมัน (Roman Numerals)', category: 'ตัวเลข', path: '/number-tools/roman-numerals', keywords: ['roman', 'numbers'] },

  // Time Tools
  { name: 'Unix Timestamp', category: 'เวลา', path: '/time-tools/unix-timestamp', keywords: ['epoch', 'time', 'date'] },
  { name: 'หาผลต่างวัน (Date Difference)', category: 'เวลา', path: '/time-tools/date-difference', keywords: ['days', 'years', 'between'] },
  { name: 'Timezone Converter', category: 'เวลา', path: '/time-tools/timezone-converter', keywords: ['flag', 'country', 'gmt', 'utc', 'clock'] },
  { name: 'Pomodoro Timer', category: 'เวลา', path: '/time-tools/pomodoro-timer', keywords: ['focus', 'timer', 'work', 'break'] },
  { name: 'Thai Working Days', category: 'เวลา', path: '/time-tools/working-days', keywords: ['holidays', 'thai', 'calendar', 'workdays'] },

  // Developer Tools
  { name: 'จัดรูปแบบ JSON (Formatter)', category: 'นักพัฒนา', path: '/developer-tools/json-formatter', keywords: ['prettify', 'minify', 'json'] },
  { name: 'JSON ↔ CSV / Excel', category: 'นักพัฒนา', path: '/developer-tools/json-to-csv', keywords: ['export', 'csv', 'spreadsheet'] },
  { name: 'CSS Minifier / Formatter', category: 'นักพัฒนา', path: '/developer-tools/css-formatter', keywords: ['css', 'clean', 'format'] },
  { name: 'จัดรูปแบบ SQL', category: 'นักพัฒนา', path: '/developer-tools/sql-formatter', keywords: ['query', 'database', 'sql'] },
  { name: 'Git Cheat Sheet', category: 'นักพัฒนา', path: '/developer-tools/git-cheatsheet', keywords: ['commit', 'branch', 'push'] },
  { name: 'Box Shadow / Neumorphism', category: 'นักพัฒนา', path: '/developer-tools/shadow-generator', keywords: ['css', 'shadow', 'blur'] },
  { name: 'สร้าง UUID v4', category: 'นักพัฒนา', path: '/developer-tools/uuid-generator', keywords: ['guid', 'unique', 'id'] },
  { name: 'JSON ➔ TS / Zod Schema', category: 'นักพัฒนา', path: '/developer-tools/json-to-types', keywords: ['typescript', 'interface', 'struct'] },
  { name: 'cURL Code Converter', category: 'นักพัฒนา', path: '/developer-tools/curl-converter', keywords: ['fetch', 'axios', 'python', 'api'] },
  { name: 'REST API Client Tester', category: 'นักพัฒนา', path: '/developer-tools/api-tester', keywords: ['postman', 'http', 'request', 'response', 'get', 'post', 'api', 'client'] },
  { name: 'YAML ↔ JSON Converter', category: 'นักพัฒนา', path: '/developer-tools/yaml-json-toml', keywords: ['config', 'yaml', 'toml'] },
  { name: 'Code Comment Remover', category: 'นักพัฒนา', path: '/developer-tools/comment-remover', keywords: ['strip', 'comments', 'clean', 'js', 'py'] },

  // Encoders / Decoders
  { name: 'Text Base64 Encode/Decode', category: 'รหัส', path: '/encoders-decoders/text-base64', keywords: ['b64', 'encode', 'string'] },
  { name: 'Text Base32 Encode/Decode', category: 'รหัส', path: '/encoders-decoders/text-base32', keywords: ['b32', 'base32', 'rfc4648', 'encode', 'string'] },
  { name: 'URL Encode / Decode', category: 'รหัส', path: '/encoders-decoders/url-encode', keywords: ['uri', 'percent'] },
  { name: 'HTML Entity Encoder', category: 'รหัส', path: '/encoders-decoders/html-entity', keywords: ['escape', 'xml'] },
  { name: 'JWT Decoder', category: 'รหัส', path: '/encoders-decoders/jwt-decoder', keywords: ['bearer', 'token', 'auth'] },
  { name: 'Hash Generator (MD5/SHA)', category: 'รหัส', path: '/encoders-decoders/hash-generator', keywords: ['sha256', 'md5', 'crypto'] },
  { name: 'สุ่มรหัสผ่าน (Password)', category: 'รหัส', path: '/encoders-decoders/password-generator', keywords: ['random', 'security', 'key'] },
  { name: 'Bcrypt Hash Generator', category: 'รหัส', path: '/encoders-decoders/bcrypt-generator', keywords: ['salt', 'hash', 'auth'] },
  { name: 'RSA Key Pair Generator', category: 'รหัส', path: '/encoders-decoders/rsa-generator', keywords: ['public', 'private', 'ssh'] },
  { name: 'AES-256 Encrypt / Decrypt', category: 'รหัส', path: '/encoders-decoders/aes-encrypt', keywords: ['secret', 'cipher', 'crypto'] },
  { name: 'Password Entropy Analyzer', category: 'รหัส', path: '/encoders-decoders/password-analyzer', keywords: ['crack', 'strength', 'security'] },

  // Color & UI Tools
  { name: 'HEX ↔ RGB', category: 'สี & ดีไซน์', path: '/color-tools/hex-rgb', keywords: ['color', 'code'] },
  { name: 'RGB ↔ HSL', category: 'สี & ดีไซน์', path: '/color-tools/rgb-hsl', keywords: ['color', 'hue'] },
  { name: 'Gradient Generator', category: 'สี & ดีไซน์', path: '/color-tools/gradient-generator', keywords: ['background', 'linear', 'radial'] },
  { name: 'Contrast Checker', category: 'สี & ดีไซน์', path: '/color-tools/contrast-checker', keywords: ['wcag', 'accessibility', 'ratio'] },
  { name: 'Glassmorphism Generator', category: 'สี & ดีไซน์', path: '/color-tools/glassmorphism-generator', keywords: ['backdrop', 'blur', 'glass'] },
  { name: 'Color Palette Generator', category: 'สี & ดีไซน์', path: '/color-tools/palette-generator', keywords: ['scheme', 'colors', 'swatch'] },
  { name: 'Aspect Ratio Calculator', category: 'สี & ดีไซน์', path: '/color-tools/aspect-ratio-calculator', keywords: ['16:9', '4:3', 'pixels', 'resolution'] },
  { name: 'Font Pair Previewer', category: 'สี & ดีไซน์', path: '/color-tools/font-pair-previewer', keywords: ['typography', 'google fonts', 'thai fonts'] },

  // Text Tools
  { name: 'นับคำ (Word Counter)', category: 'ข้อความ', path: '/text-tools/word-counter', keywords: ['words', 'characters', 'lines'] },
  { name: 'เปลี่ยนตัวพิมพ์ (Case Converter)', category: 'ข้อความ', path: '/text-tools/case-converter', keywords: ['uppercase', 'lowercase', 'camelcase', 'slug'] },
  { name: 'เปรียบเทียบข้อความ (Text Diff)', category: 'ข้อความ', path: '/text-tools/text-diff', keywords: ['compare', 'merge', 'changes'] },
  { name: 'Lorem Ipsum Generator', category: 'ข้อความ', path: '/text-tools/lorem-ipsum', keywords: ['placeholder', 'dummy', 'text'] },
  { name: 'Markdown Editor & Preview', category: 'ข้อความ', path: '/text-tools/markdown-editor', keywords: ['md', 'live preview', 'html'] },

  // Image Tools
  { name: 'Image Base64 Encode', category: 'รูปภาพ', path: '/image-tools/base64-encode', keywords: ['datauri', 'img'] },
  { name: 'SVG Optimizer', category: 'รูปภาพ', path: '/image-tools/svg-optimizer', keywords: ['svgo', 'minified', 'vector'] },
  { name: 'สร้าง QR Code', category: 'รูปภาพ', path: '/image-tools/qr-generator', keywords: ['barcode', 'link', 'scan'] },
  { name: 'บีบอัดรูปภาพ (Compressor)', category: 'รูปภาพ', path: '/image-tools/image-compressor', keywords: ['reduce', 'size', 'png', 'jpg'] },
  { name: 'Favicon Generator', category: 'รูปภาพ', path: '/image-tools/favicon-generator', keywords: ['ico', 'icon', 'website'] },
  { name: 'Image Crop & Resizer', category: 'รูปภาพ', path: '/image-tools/image-cropper', keywords: ['resize', 'dimension', 'crop'] },
  { name: 'EXIF Metadata Viewer', category: 'รูปภาพ', path: '/image-tools/exif-viewer', keywords: ['camera', 'iso', 'details', 'metadata'] },
  { name: 'SVG Code Editor', category: 'รูปภาพ', path: '/image-tools/svg-editor', keywords: ['vector', 'xml', 'draw'] },
  { name: 'ย่อรูปสัดส่วนโซเชียล (Social Resizer)', category: 'รูปภาพ', path: '/image-tools/social-resizer', keywords: ['instagram', 'facebook', 'cover', 'story', 'ratio', 'aspect'] },
  { name: 'แปลงไฟล์รูปภาพ (WebP/PNG/JPG)', category: 'รูปภาพ', path: '/image-tools/format-converter', keywords: ['webp', 'png', 'jpg', 'convert', 'format'] },
  { name: 'สร้าง ASCII Art Banner', category: 'รูปภาพ', path: '/image-tools/ascii-art', keywords: ['ascii', 'banner', 'terminal', 'text art', 'readme'] },

  // Network Tools
  { name: 'แยก URL (URL Parser)', category: 'เครือข่าย', path: '/network-tools/url-parser', keywords: ['hostname', 'query', 'params'] },
  { name: 'IP Subnet', category: 'เครือข่าย', path: '/network-tools/ip-subnet', keywords: ['cidr', 'mask', 'broadcast'] },
  { name: 'User-Agent Parser', category: 'เครือข่าย', path: '/network-tools/user-agent-parser', keywords: ['browser', 'os', 'device'] },
  { name: 'DNS Lookup', category: 'เครือข่าย', path: '/network-tools/dns-lookup', keywords: ['a', 'mx', 'txt', 'ns'] },
  { name: 'SSL Certificate Checker', category: 'เครือข่าย', path: '/network-tools/ssl-checker', keywords: ['tls', 'cert', 'expire', 'https'] },
  { name: 'Subnet Calculator (CIDR)', category: 'เครือข่าย', path: '/network-tools/cidr-calculator', keywords: ['network', 'hosts', 'mask'] },
  { name: 'HTTP Header Analyzer', category: 'เครือข่าย', path: '/network-tools/header-analyzer', keywords: ['cors', 'csp', 'security', 'headers'] },
  { name: 'Nginx / Htaccess Generator', category: 'เครือข่าย', path: '/network-tools/nginx-htaccess-generator', keywords: ['rewrite', 'redirect', 'apache'] },

  // Finance Tools
  { name: 'คำนวณส่วนลด (Discount)', category: 'การเงิน', path: '/finance-tools/discount-calculator', keywords: ['sale', 'vat', 'tax', 'off'] },
  { name: 'คำนวณสินเชื่อ (Loan)', category: 'การเงิน', path: '/finance-tools/loan-calculator', keywords: ['mortgage', 'interest', 'monthly'] },
  { name: 'Salary to Hourly', category: 'การเงิน', path: '/finance-tools/salary-calculator', keywords: ['wage', 'pay', 'work hours'] },
  { name: 'Split Bill & Tip Calculator', category: 'การเงิน', path: '/finance-tools/split-bill', keywords: ['friends', 'tip', 'dinner'] },
  { name: 'Compound Interest', category: 'การเงิน', path: '/finance-tools/compound-interest', keywords: ['invest', 'savings', 'growth'] },

  // Calculators
  { name: 'คำนวณเปอร์เซ็นต์', category: 'เครื่องคิดเลข', path: '/calculators/percentage', keywords: ['ratio', 'percent', 'diff'] },
  { name: 'คำนวณ BMI', category: 'เครื่องคิดเลข', path: '/calculators/bmi', keywords: ['health', 'weight', 'height', 'body'] },
  { name: 'วงล้อสุ่มเลือก (Random Wheel)', category: 'เครื่องคิดเลข', path: '/calculators/random-wheel', keywords: ['random', 'wheel', 'decision', 'food', 'spin', 'สุ่ม', 'วงล้อ', 'อาหาร'] }
];

export default function GlassSearchBar() {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions
  const filtered = query.trim() === '' ? [] : SEARCH_ITEMS.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(q)))
    );
  }).slice(0, 6);

  // Keyboard Navigation & Shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: SearchItem) => {
    setQuery('');
    setIsOpen(false);
    navigate(item.path);
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    }
  };

  return (
    <div ref={containerRef} className="fixed top-3.5 left-0 md:left-[calc(50%+9rem)] md:-translate-x-1/2 z-40 w-full pl-16 md:pl-4 pr-4 md:pr-4 max-w-md pointer-events-auto">
      {/* Floating Glassmorphism Input Bar */}
      <div 
        className={`relative flex items-center bg-surface/80 dark:bg-background/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-xl transition-all duration-300 ${
          isOpen ? 'ring-2 ring-emerald-500/50 shadow-emerald-500/10' : 'hover:border-emerald-500/40'
        }`}
      >
        <div className="pl-4 text-emerald-500 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          data-lpignore="true"
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDownInput}
          placeholder="ค้นหาเครื่องมือ..."
          className="w-full !bg-transparent !border-none !ring-0 rounded-full py-2.5 pl-3 pr-4 text-sm font-semibold text-text placeholder-muted/60 outline-none"
        />
      </div>

      {/* Auto-suggest Glass Dropdown */}
      <AnimatePresence>
        {isOpen && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-4 right-4 mt-1 bg-surface/90 dark:bg-background/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden divide-y divide-border/20 z-50"
          >
            {filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.path}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-all ${
                    isSelected ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold pl-5' : 'hover:bg-black/5 dark:hover:bg-white/5 text-text/90 font-medium'
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2 text-sm">
                      <span>{item.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-muted/70 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    {isSelected && (
                      <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
                        เลือก <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 text-emerald-500' : 'opacity-40'}`} />
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
