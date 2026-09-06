import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function UrlParser() {
  const [url, setUrl] = useState<string>('https://user:pass@www.example.com:8080/path/to/page?query=string#hash');
  const [parsed, setParsed] = useState<any>(null);

  useEffect(() => {
    try {
      const u = new URL(url);
      
      const searchParams: Record<string, string> = {};
      u.searchParams.forEach((val, key) => {
        searchParams[key] = val;
      });

      setParsed({
        href: u.href,
        protocol: u.protocol,
        username: u.username,
        password: u.password,
        host: u.host,
        hostname: u.hostname,
        port: u.port,
        pathname: u.pathname,
        search: u.search,
        searchParams,
        hash: u.hash,
        origin: u.origin,
      });
    } catch (e) {
      setParsed(null);
    }
  }, [url]);

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 z-10">
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-2 tracking-tight">URL Parser</h1>
        <p className="text-muted font-medium">Break down URLs into their component parts.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel w-full max-w-4xl p-6 md:p-8 flex flex-col gap-8"
      >
        <div className="flex flex-col gap-2 relative">
          <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Enter URL</label>
          <input 
            type="text" 
            className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl px-5 py-4 text-text font-mono text-sm outline-none transition-all shadow-inner"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        {parsed ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['protocol', 'host', 'hostname', 'port', 'pathname', 'search', 'hash', 'origin'].map(key => (
              <div key={key} className="p-4 bg-surface/80 border border-border rounded-xl flex flex-col gap-1 shadow-sm">
                <span className="text-xs text-muted uppercase font-bold tracking-wider">{key}</span>
                <span className="text-text font-mono text-sm break-all">{parsed[key] || <span className="text-muted/40">empty</span>}</span>
              </div>
            ))}

            {/* Query Params */}
            <div className="col-span-1 md:col-span-2 p-4 bg-surface/80 border border-border rounded-xl flex flex-col gap-3 shadow-sm">
              <span className="text-xs text-muted uppercase font-bold tracking-wider">Query Parameters</span>
              {Object.keys(parsed.searchParams).length > 0 ? (
                <div className="flex flex-col gap-2">
                  {Object.entries(parsed.searchParams).map(([k, v]: [string, any]) => (
                    <div key={k} className="flex gap-2 text-sm font-mono bg-background/50 p-3 rounded-lg border border-border">
                      <span className="text-secondary font-bold min-w-[120px] break-all">{k}</span>
                      <span className="text-muted">:</span>
                      <span className="text-text break-all">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-muted/40 font-mono text-sm">No query parameters</span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-red-500/30 rounded-xl bg-red-500/10 text-red-600 dark:text-red-300">
            Invalid URL format
          </div>
        )}

      </motion.div>
    </div>
  );
}
