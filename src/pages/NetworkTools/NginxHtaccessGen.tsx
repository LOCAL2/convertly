import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

export default function NginxHtaccessGen() {
  const [serverType, setServerType] = useState<'nginx' | 'apache'>('nginx');
  const [forceHttps, setForceHttps] = useState<boolean>(true);
  const [blockIndexes, setBlockIndexes] = useState<boolean>(true);
  const [blockedIps, setBlockedIps] = useState<string>('1.2.3.4');
  const [copied, setCopied] = useState<boolean>(false);

  const generateConfig = () => {
    let result = '';

    if (serverType === 'nginx') {
      result += `# Nginx Configuration Rules\n\n`;
      if (forceHttps) {
        result += `# Force HTTPS\nserver {\n  listen 80;\n  server_name _;\n  return 301 https://$host$request_uri;\n}\n\n`;
      }
      if (blockIndexes) {
        result += `# Disable Directory Indexing\nautoindex off;\n\n`;
      }
      if (blockedIps.trim()) {
        result += `# Block IP Addresses\n`;
        blockedIps.split('\n').forEach(ip => {
          if (ip.trim()) result += `deny ${ip.trim()};\n`;
        });
        result += `\n`;
      }
    } else {
      result += `# Apache .htaccess Rules\n\nRewriteEngine On\n\n`;
      if (forceHttps) {
        result += `# Force HTTPS\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n\n`;
      }
      if (blockIndexes) {
        result += `# Disable Directory Indexing\nOptions -Indexes\n\n`;
      }
      if (blockedIps.trim()) {
        result += `# Block IP Addresses\n<RequireAll>\nRequire all granted\n`;
        blockedIps.split('\n').forEach(ip => {
          if (ip.trim()) result += `Require not ip ${ip.trim()}\n`;
        });
        result += `</RequireAll>\n\n`;
      }
    }

    return result;
  };

  const outputCode = generateConfig();

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Nginx / Htaccess Generator</h1>
        <p className="text-muted font-medium text-lg">Generate rewrite rules, HTTPS redirects, and IP blocking configs.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-4xl p-6 md:p-8 flex flex-col gap-8"
      >
        {/* Toggle Server */}
        <div className="flex bg-background border border-border p-1 rounded-2xl w-full max-w-md mx-auto">
          <button
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${serverType === 'nginx' ? 'bg-emerald-500 text-white shadow-md' : 'text-muted hover:text-text'}`}
            onClick={() => setServerType('nginx')}
          >
            Nginx Config
          </button>
          <button
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${serverType === 'apache' ? 'bg-emerald-500 text-white shadow-md' : 'text-muted hover:text-text'}`}
            onClick={() => setServerType('apache')}
          >
            Apache .htaccess
          </button>
        </div>

        {/* Checkboxes Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="flex items-center gap-3 p-4 bg-surface border border-border rounded-xl cursor-pointer">
            <input 
              type="checkbox" 
              checked={forceHttps} 
              onChange={(e) => setForceHttps(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 rounded"
            />
            <span className="font-bold text-text text-sm">Force HTTPS 301 Redirect</span>
          </label>

          <label className="flex items-center gap-3 p-4 bg-surface border border-border rounded-xl cursor-pointer">
            <input 
              type="checkbox" 
              checked={blockIndexes} 
              onChange={(e) => setBlockIndexes(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 rounded"
            />
            <span className="font-bold text-text text-sm">Disable Directory Indexing</span>
          </label>
        </div>

        {/* IP Block textarea */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Block IP Addresses (One per line)</label>
          <textarea
            className="w-full bg-background border border-border focus:border-emerald-500/50 rounded-xl p-3 text-text font-mono text-sm outline-none shadow-inner resize-none min-h-[80px]"
            value={blockedIps}
            onChange={(e) => setBlockedIps(e.target.value)}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-3 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted uppercase tracking-widest">Generated Config Output</span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-bold text-text hover:bg-surface transition-all flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Config'}
            </button>
          </div>
          <textarea
            readOnly
            className="w-full bg-background border border-border rounded-2xl p-4 text-emerald-600 dark:text-emerald-400 font-mono text-sm outline-none resize-none min-h-[220px] shadow-inner"
            value={outputCode}
          />
        </div>
      </motion.div>
    </div>
  );
}
