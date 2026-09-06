import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CidrCalculator() {
  const [ip, setIp] = useState<string>('192.168.1.1');
  const [cidr, setCidr] = useState<number>(24);

  const calculateSubnet = () => {
    try {
      const parts = ip.split('.').map(Number);
      if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
        return null;
      }

      const maskNum = (0xFFFFFFFF << (32 - cidr)) >>> 0;
      const netMask = [
        (maskNum >>> 24) & 255,
        (maskNum >>> 16) & 255,
        (maskNum >>> 8) & 255,
        maskNum & 255,
      ].join('.');

      const ipNum = ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
      const netNum = (ipNum & maskNum) >>> 0;
      const bcastNum = (netNum | (~maskNum >>> 0)) >>> 0;

      const numToIp = (n: number) => [
        (n >>> 24) & 255,
        (n >>> 16) & 255,
        (n >>> 8) & 255,
        n & 255,
      ].join('.');

      const totalHosts = Math.pow(2, 32 - cidr);
      const usableHosts = totalHosts > 2 ? totalHosts - 2 : 0;

      return {
        netMask,
        networkAddress: numToIp(netNum),
        broadcastAddress: numToIp(bcastNum),
        firstUsable: usableHosts > 0 ? numToIp(netNum + 1) : 'N/A',
        lastUsable: usableHosts > 0 ? numToIp(bcastNum - 1) : 'N/A',
        totalHosts,
        usableHosts,
      };
    } catch (e) {
      return null;
    }
  };

  const result = calculateSubnet();

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">Subnet Calculator (CIDR)</h1>
        <p className="text-muted font-medium text-lg">Calculate IP Subnet mask, Network & Broadcast Addresses, and Usable Hosts.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-4xl p-6 md:p-8 flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="sm:col-span-2 flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">IP Address</label>
            <input 
              type="text" 
              className="w-full bg-background border border-border focus:border-emerald-500/50 rounded-xl px-4 py-3 text-text font-mono font-bold text-lg outline-none shadow-inner"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="e.g. 192.168.1.1"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">CIDR Subnet (/{cidr})</label>
            <select
              value={cidr}
              onChange={(e) => setCidr(Number(e.target.value))}
              className="bg-background border border-border focus:border-emerald-500/50 rounded-xl px-4 py-3 text-text font-mono font-bold text-lg outline-none shadow-inner cursor-pointer"
            >
              {Array.from({ length: 32 }, (_, i) => i + 1).map((mask) => (
                <option key={mask} value={mask}>/{mask}</option>
              ))}
            </select>
          </div>
        </div>

        {result && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Subnet Mask</span>
              <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{result.netMask}</span>
            </div>

            <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Network Address</span>
              <span className="text-xl font-bold font-mono text-text">{result.networkAddress}</span>
            </div>

            <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Broadcast Address</span>
              <span className="text-xl font-bold font-mono text-text">{result.broadcastAddress}</span>
            </div>

            <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">First Usable Host</span>
              <span className="text-lg font-bold font-mono text-text">{result.firstUsable}</span>
            </div>

            <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Last Usable Host</span>
              <span className="text-lg font-bold font-mono text-text">{result.lastUsable}</span>
            </div>

            <div className="p-5 bg-surface border border-border rounded-2xl flex flex-col gap-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Usable Hosts</span>
              <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {result.usableHosts.toLocaleString()} ({result.totalHosts.toLocaleString()} total)
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
