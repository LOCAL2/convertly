import { useState } from 'react';
import { motion } from 'framer-motion';

export default function IpSubnet() {
  const [ipStr, setIpStr] = useState<string>('192.168.1.1');
  const [cidr, setCidr] = useState<string>('24');
  const [error, setError] = useState<string>('');
  
  const [results, setResults] = useState<{
    network: string;
    broadcast: string;
    mask: string;
    totalHosts: number;
    usableHosts: number;
  } | null>(null);

  const calculateSubnet = () => {
    setError('');
    const ipParts = ipStr.split('.');
    if (ipParts.length !== 4) {
      setError('Invalid ไอพีแอดเดรส (IP Address)');
      setResults(null);
      return;
    }
    const ipNum = ipParts.reduce((acc, part) => {
      const p = parseInt(part, 10);
      if (isNaN(p) || p < 0 || p > 255) throw new Error('Invalid IP byte');
      return (acc << 8) + p;
    }, 0);

    const maskNum = parseInt(cidr, 10);
    if (isNaN(maskNum) || maskNum < 0 || maskNum > 32) {
      setError('Invalid CIDR block (must be 0-32)');
      setResults(null);
      return;
    }

    try {
      const mask = maskNum === 0 ? 0 : -1 << (32 - maskNum);
      const network = ipNum & mask;
      const broadcast = network | ~mask;
      
      const toIp = (num: number) => [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255
      ].join('.');

      const totalHosts = Math.pow(2, 32 - maskNum);
      const usableHosts = totalHosts > 2 ? totalHosts - 2 : 0;

      setResults({
        network: toIp(network),
        broadcast: toIp(broadcast),
        mask: toIp(mask),
        totalHosts,
        usableHosts
      });
    } catch (e) {
      setError('Error calculating subnet');
      setResults(null);
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="w-full max-w-2xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">เครื่องคำนวณ IP Subnet</h1>
        <p className="text-muted font-medium text-lg">คำนวณ เครือข่าย (Network Address), Broadcast และจำนวน Hosts จาก CIDR</p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel w-full max-w-2xl p-8 flex flex-col gap-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-2 flex-grow">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">ไอพีแอดเดรส (IP Address)</label>
            <input 
              type="text"
              className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl p-4 text-text font-mono text-lg outline-none shadow-inner"
              value={ipStr}
              onChange={(e) => setIpStr(e.target.value)}
              placeholder="192.168.1.1"
            />
          </div>
          <div className="flex flex-col gap-2 w-32">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">CIDR</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">/</span>
              <input 
                type="number"
                className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl py-4 pl-8 pr-4 text-text font-mono text-lg outline-none shadow-inner"
                value={cidr}
                onChange={(e) => setCidr(e.target.value)}
                min="0" max="32"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={calculateSubnet}
          className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95"
        >
          Calculate
        </button>

        {error && <div className="text-center font-bold text-red-500">{error}</div>}

        {results && (
          <div className="flex flex-col gap-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-surface border border-border rounded-xl">
                <div className="text-xs font-bold text-muted uppercase tracking-widest mb-1">เครือข่าย (Network Address)</div>
                <div className="text-lg font-mono font-bold text-primary">{results.network}</div>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl">
                <div className="text-xs font-bold text-muted uppercase tracking-widest mb-1">บรอดแคสต์ (Broadcast Address)</div>
                <div className="text-lg font-mono font-bold text-primary">{results.broadcast}</div>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl">
                <div className="text-xs font-bold text-muted uppercase tracking-widest mb-1">ซับเน็ตมาสก์ (Subnet Mask)</div>
                <div className="text-lg font-mono font-bold text-text">{results.mask}</div>
              </div>
              <div className="p-4 bg-surface border border-border rounded-xl">
                <div className="text-xs font-bold text-muted uppercase tracking-widest mb-1">โฮสต์ที่ใช้งานได้</div>
                <div className="text-lg font-mono font-bold text-text">{results.usableHosts.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
