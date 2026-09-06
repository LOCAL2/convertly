import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Terminal } from 'lucide-react';

const SAMPLE_CURL = `curl -X POST "https://api.example.com/v1/users" \\
  -H "Authorization: Bearer token123" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "John Doe", "email": "john@example.com"}'`;

export default function CurlConverter() {
  const [curlInput, setCurlInput] = useState<string>(SAMPLE_CURL);
  const [targetLang, setTargetLang] = useState<'fetch' | 'axios' | 'python' | 'go'>('fetch');
  const [copied, setCopied] = useState<boolean>(false);

  const parseCurl = (curl: string) => {
    const urlMatch = curl.match(/["']?(https?:\/\/[^\s"']+)["']?/);
    const methodMatch = curl.match(/-X\s+([A-Z]+)/i);

    const url = urlMatch ? urlMatch[1] : 'https://api.example.com';
    const method = methodMatch ? methodMatch[1].toUpperCase() : (curl.includes('-d ') || curl.includes('--data') ? 'POST' : 'GET');

    const headers: Record<string, string> = {};
    const headerRegex = /-H\s+["']([^"']+)["']/g;
    let match;
    while ((match = headerRegex.exec(curl)) !== null) {
      const parts = match[1].split(':');
      if (parts.length >= 2) {
        headers[parts[0].trim()] = parts.slice(1).join(':').trim();
      }
    }

    const dataMatch = curl.match(/(-d|--data|--data-raw)\s+['"]([^'"]+)['"]/);
    const body = dataMatch ? dataMatch[2] : null;

    return { url, method, headers, body };
  };

  const convertCode = () => {
    const { url, method, headers, body } = parseCurl(curlInput);

    if (targetLang === 'fetch') {
      return `fetch("${url}", {\n  method: "${method}",\n  headers: ${JSON.stringify(headers, null, 4)},\n${body ? `  body: JSON.stringify(${body})\n` : ''}})\n  .then(res => res.json())\n  .then(data => console.log(data));`;
    } else if (targetLang === 'axios') {
      return `import axios from 'axios';\n\naxios({\n  method: '${method.toLowerCase()}',\n  url: '${url}',\n  headers: ${JSON.stringify(headers, null, 4)},\n${body ? `  data: ${body}\n` : ''}})\n  .then(response => console.log(response.data));`;
    } else if (targetLang === 'python') {
      return `import requests\n\nurl = "${url}"\nheaders = ${JSON.stringify(headers, null, 4).replace(/true/g, 'True').replace(/false/g, 'False')}\n${body ? `data = ${body}\n\nresponse = requests.${method.toLowerCase()}(url, headers=headers, json=data)` : `\nresponse = requests.${method.toLowerCase()}(url, headers=headers)`}\nprint(response.json())`;
    } else if (targetLang === 'go') {
      return `package main\n\nimport (\n\t"fmt"\n\t"net/http"\n\t"io"\n)\n\nfunc main() {\n\treq, _ := http.NewRequest("${method}", "${url}", nil)\n\tclient := &http.Client{}\n\tresp, _ := client.Do(req)\n\tdefer resp.Body.Close()\n\tbody, _ := io.ReadAll(resp.Body)\n\tfmt.Println(string(body))\n}`;
    }
    return '';
  };

  const outputCode = convertCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-5xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">cURL Code Converter</h1>
        <p className="text-muted font-medium text-lg">Convert cURL commands into Fetch, Axios, Python Requests, or Go.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-5xl p-6 md:p-8 flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[420px]">
          {/* Input cURL */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-500" /> Input cURL Command
            </label>
            <textarea
              className="w-full h-full min-h-[380px] bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-2xl p-4 text-text font-mono text-sm outline-none shadow-inner resize-none"
              value={curlInput}
              onChange={(e) => setCurlInput(e.target.value)}
              placeholder="Paste curl command here..."
            />
          </div>

          {/* Target Language Output */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex bg-background border border-border p-1 rounded-xl">
                {(['fetch', 'axios', 'python', 'go'] as const).map((lang) => (
                  <button
                    key={lang}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${targetLang === lang ? 'bg-emerald-500 text-white shadow-sm' : 'text-muted hover:text-text'}`}
                    onClick={() => setTargetLang(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-bold text-text hover:bg-surface transition-all flex items-center gap-1.5 shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Code'}
              </button>
            </div>

            <textarea
              readOnly
              className="w-full h-full min-h-[380px] bg-surface border border-border rounded-2xl p-4 text-emerald-600 dark:text-emerald-400 font-mono text-sm outline-none shadow-sm resize-none"
              value={outputCode}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
