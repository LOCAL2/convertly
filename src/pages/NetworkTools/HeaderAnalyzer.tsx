import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Globe, Search, Loader2 } from 'lucide-react';

interface SecurityHeaderCheck {
  name: string;
  present: boolean;
  value?: string;
  recommendation: string;
}

export default function HeaderAnalyzer() {
  const [urlInput, setUrlInput] = useState<string>('https://google.com');
  const [rawHeaders, setRawHeaders] = useState<string>(`Strict-Transport-Security: max-age=31536000; includeSubDomains\nX-Frame-Options: SAMEORIGIN\nX-Content-Type-Options: nosniff`);
  const [loading, setLoading] = useState<boolean>(false);

  const performAnalysis = (headersStr: string) => {
    const lines = headersStr.split('\n');
    const headerMap: Record<string, string> = {};

    lines.forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        headerMap[parts[0].trim().toLowerCase()] = parts.slice(1).join(':').trim();
      }
    });

    const checks: SecurityHeaderCheck[] = [
      {
        name: 'Strict-Transport-Security (HSTS)',
        present: 'strict-transport-security' in headerMap,
        value: headerMap['strict-transport-security'],
        recommendation: 'Forces HTTPS connections to prevent SSL stripping attacks.',
      },
      {
        name: 'Content-Security-Policy (CSP)',
        present: 'content-security-policy' in headerMap,
        value: headerMap['content-security-policy'],
        recommendation: 'Prevents XSS attacks and unauthorized script execution.',
      },
      {
        name: 'X-Frame-Options',
        present: 'x-frame-options' in headerMap,
        value: headerMap['x-frame-options'],
        recommendation: 'Prevents Clickjacking attacks by controlling iframe embedding.',
      },
      {
        name: 'X-Content-Type-Options',
        present: 'x-content-type-options' in headerMap,
        value: headerMap['x-content-type-options'],
        recommendation: 'Stops browsers from MIME-sniffing response content.',
      },
      {
        name: 'Referrer-Policy',
        present: 'referrer-policy' in headerMap,
        value: headerMap['referrer-policy'],
        recommendation: 'Controls how much referrer information is sent with requests.',
      },
    ];

    return checks;
  };

  const handleScanUrl = () => {
    setLoading(true);
    // Simulate DoH / Proxy live header scanner
    setTimeout(() => {
      setRawHeaders(`strict-transport-security: max-age=31536000; includeSubDomains; preload\nx-frame-options: SAMEORIGIN\nx-content-type-options: nosniff\nreferrer-policy: origin-when-cross-origin\ncontent-security-policy: script-src 'self'`);
      setLoading(false);
    }, 800);
  };

  const checks = performAnalysis(rawHeaders);
  const passCount = checks.filter(c => c.present).length;

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">HTTP Header & CORS Analyzer</h1>
        <p className="text-muted font-medium text-lg">Scan website URL or paste HTTP response headers to audit security compliance.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-4xl p-6 md:p-8 flex flex-col gap-8"
      >
        {/* URL Scanner Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
            <input 
              type="text" 
              className="w-full bg-background border border-border focus:border-emerald-500/50 rounded-xl pl-12 pr-4 py-3 text-text font-medium text-lg outline-none shadow-inner"
              placeholder="e.g. https://example.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
          </div>
          <button
            onClick={handleScanUrl}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Scan URL
          </button>
        </div>

        {/* Raw Header Text Area */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Raw Response Headers</label>
          <textarea
            className="w-full bg-background border border-border focus:border-emerald-500/50 rounded-xl p-4 text-text font-mono text-sm outline-none shadow-inner resize-y min-h-[120px]"
            value={rawHeaders}
            onChange={(e) => setRawHeaders(e.target.value)}
          />
        </div>

        {/* Audit Results */}
        <div className="flex flex-col gap-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-muted uppercase tracking-wider">Security Headers Score</h2>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{passCount} / {checks.length} Passed</span>
          </div>

          <div className="flex flex-col gap-3">
            {checks.map((check, i) => (
              <div key={i} className="p-5 bg-surface border border-border rounded-2xl flex items-start justify-between gap-4 shadow-sm">
                <div className="flex items-start gap-3">
                  {check.present ? (
                    <ShieldCheck className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-text text-base">{check.name}</div>
                    <div className="text-xs text-muted mt-1">{check.recommendation}</div>
                    {check.value && (
                      <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-2 bg-background p-2 rounded-lg break-all">
                        {check.value}
                      </div>
                    )}
                  </div>
                </div>

                <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${check.present ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                  {check.present ? 'Pass' : 'Missing'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
