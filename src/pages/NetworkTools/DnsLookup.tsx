import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, AlertCircle, Loader2 } from 'lucide-react';

interface DnsRecord {
  type: string;
  name: string;
  data: string;
  ttl: number;
}

export default function DnsLookup() {
  const [domain, setDomain] = useState<string>('google.com');
  const [recordType, setRecordType] = useState<string>('A');
  const [loading, setLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<DnsRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDns = async () => {
    let cleanDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!cleanDomain) return;

    setLoading(true);
    setError(null);
    setRecords(null);

    try {
      // Using Cloudflare Public DNS-over-HTTPS (DoH) API
      const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleanDomain)}&type=${recordType}`, {
        headers: {
          accept: 'application/dns-json',
        },
      });

      if (!res.ok) throw new Error('DNS query request failed.');
      const data = await res.json();

      if (data.Status !== 0) {
        setError(`DNS Lookup failed with RCODE: ${data.Status}`);
      } else if (!data.Answer || data.Answer.length === 0) {
        setRecords([]);
      } else {
        const typeMap: Record<number, string> = {
          1: 'A',
          28: 'AAAA',
          15: 'MX',
          5: 'CNAME',
          16: 'TXT',
          2: 'NS',
        };
        const parsed: DnsRecord[] = data.Answer.map((ans: any) => ({
          type: typeMap[ans.type] || recordType,
          name: ans.name,
          data: ans.data,
          ttl: ans.TTL,
        }));
        setRecords(parsed);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching DNS records.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-3xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">DNS Lookup</h1>
        <p className="text-muted font-medium text-lg">Perform real-time DNS record queries over Cloudflare HTTPS API.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-3xl p-8 md:p-10 flex flex-col gap-8"
      >
        {/* Search Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
            <input 
              type="text" 
              className="w-full bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-xl pl-12 pr-4 py-3 text-text font-medium text-lg outline-none shadow-inner"
              placeholder="e.g. example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchDns()}
            />
          </div>

          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            className="bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-xl px-4 py-3 text-text font-bold text-base outline-none shadow-inner cursor-pointer"
          >
            {['A', 'AAAA', 'MX', 'CNAME', 'TXT', 'NS'].map((t) => (
              <option key={t} value={t}>{t} Record</option>
            ))}
          </select>

          <button
            onClick={fetchDns}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Lookup
          </button>
        </div>

        {/* Results Section */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {records && (
          <div className="flex flex-col gap-3">
            <div className="text-xs font-bold text-muted uppercase tracking-wider">
              Query Results for <span className="text-emerald-500 font-mono">{domain}</span> ({records.length} records found)
            </div>

            {records.length === 0 ? (
              <div className="p-8 text-center text-muted font-medium bg-surface border border-border rounded-xl">
                No {recordType} records found for this domain.
              </div>
            ) : (
              <div className="overflow-x-auto border border-border rounded-2xl bg-surface shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-background border-b border-border text-muted text-xs uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-4">Type</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Data / Value</th>
                      <th className="p-4">TTL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {records.map((r, i) => (
                      <tr key={i} className="hover:bg-background/50 transition-colors">
                        <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">{r.type}</td>
                        <td className="p-4 font-mono text-muted">{r.name}</td>
                        <td className="p-4 font-mono text-text break-all">{r.data}</td>
                        <td className="p-4 text-muted">{r.ttl}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
