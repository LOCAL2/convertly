import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Cpu, Globe, RefreshCw, Copy, Check } from 'lucide-react';

interface ParsedUA {
  browser: string;
  os: string;
  engine: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet' | 'Bot' | 'Unknown';
}

function parseUserAgentString(ua: string): ParsedUA {
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let engine = 'Unknown Engine';
  let deviceType: ParsedUA['deviceType'] = 'Desktop';

  // Engine
  if (ua.includes('AppleWebKit')) engine = 'WebKit';
  else if (ua.includes('Gecko/')) engine = 'Gecko';
  else if (ua.includes('Trident/')) engine = 'Trident';
  else if (ua.includes('Blink')) engine = 'Blink';

  // Browser
  if (ua.includes('Edg/')) browser = 'Microsoft Edge';
  else if (ua.includes('Chrome/')) browser = 'Google Chrome';
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Apple Safari';
  else if (ua.includes('Firefox/')) browser = 'Mozilla Firefox';
  else if (ua.includes('OPR/') || ua.includes('Opera/')) browser = 'Opera';

  // OS
  if (ua.includes('Windows NT 10.0')) os = 'Windows 10 / 11';
  else if (ua.includes('Windows NT 6.3')) os = 'Windows 8.1';
  else if (ua.includes('Windows NT 6.1')) os = 'Windows 7';
  else if (ua.includes('Mac OS X')) {
    const match = ua.match(/Mac OS X ([0-9_]+)/);
    os = match ? `macOS ${match[1].replace(/_/g, '.')}` : 'macOS';
  } else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  // Device type
  if (ua.includes('Mobile') || ua.includes('iPhone') || (ua.includes('Android') && !ua.includes('Tablet'))) {
    deviceType = 'Mobile';
  } else if (ua.includes('iPad') || (ua.includes('Android') && ua.includes('Tablet'))) {
    deviceType = 'Tablet';
  } else if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) {
    deviceType = 'Bot';
  }

  return { browser, os, engine, deviceType };
}

export default function UserAgentParser() {
  const [uaInput, setUaInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUaInput(navigator.userAgent);
    }
  }, []);

  const parsed = parseUserAgentString(uaInput);

  const handleCopy = () => {
    navigator.clipboard.writeText(uaInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-3xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">User-Agent Parser</h1>
        <p className="text-muted font-medium text-lg">Analyze and extract browser, operating system, and device details.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-3xl p-8 md:p-10 flex flex-col gap-8"
      >
        {/* User Agent Input */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">User-Agent String</label>
            <div className="flex gap-3">
              <button
                onClick={() => setUaInput(navigator.userAgent)}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Use My UA
              </button>
              <button
                onClick={handleCopy}
                className="text-xs text-muted hover:text-text font-semibold flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <textarea
            className="w-full bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-xl p-4 text-text font-mono text-sm outline-none shadow-inner resize-y min-h-[100px]"
            value={uaInput}
            onChange={(e) => setUaInput(e.target.value)}
            placeholder="Paste User-Agent string here..."
          />
        </div>

        {/* Breakdown Result Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-surface border border-border rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-muted uppercase tracking-wider">Browser</div>
              <div className="text-xl font-bold text-text mt-0.5">{parsed.browser}</div>
            </div>
          </div>

          <div className="p-5 bg-surface border border-border rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-muted uppercase tracking-wider">Operating System</div>
              <div className="text-xl font-bold text-text mt-0.5">{parsed.os}</div>
            </div>
          </div>

          <div className="p-5 bg-surface border border-border rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-muted uppercase tracking-wider">Device Type</div>
              <div className="text-xl font-bold text-text mt-0.5">{parsed.deviceType}</div>
            </div>
          </div>

          <div className="p-5 bg-surface border border-border rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-muted uppercase tracking-wider">Rendering Engine</div>
              <div className="text-xl font-bold text-text mt-0.5">{parsed.engine}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
