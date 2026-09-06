import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Check, Upload, RefreshCw, FileSpreadsheet, FileCode, Sparkles } from 'lucide-react';

export default function JsonToCsv() {
  const [jsonInput, setJsonInput] = useState<string>('');

  const [delimiter, setDelimiter] = useState<string>(',');
  const [outputCsv, setOutputCsv] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [flatten, setFlatten] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('preview');

  // Convert JSON object/array to CSV text
  const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
    return Object.keys(obj).reduce((acc: Record<string, any>, k: string) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else if (Array.isArray(obj[k])) {
        acc[pre + k] = JSON.stringify(obj[k]);
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const convertToCsv = (inputStr: string, delim: string, isFlatten: boolean) => {
    if (!inputStr.trim()) {
      setOutputCsv('');
      setError('');
      return;
    }

    try {
      const parsed = JSON.parse(inputStr);
      let dataArray: any[] = [];

      if (Array.isArray(parsed)) {
        dataArray = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        dataArray = [parsed];
      } else {
        throw new Error('JSON ต้องเป็น Object หรือ Array of Objects');
      }

      if (dataArray.length === 0) {
        setOutputCsv('');
        setError('');
        return;
      }

      const processedArray = dataArray.map(item => {
        if (typeof item !== 'object' || item === null) {
          return { value: item };
        }
        return isFlatten ? flattenObject(item) : item;
      });

      // Extract headers
      const headersSet = new Set<string>();
      processedArray.forEach(item => {
        Object.keys(item).forEach(key => headersSet.add(key));
      });
      const headers = Array.from(headersSet);

      // Escape helper
      const escapeCell = (val: any) => {
        if (val === null || val === undefined) return '';
        let str = String(val);
        // If string contains delimiter, double quotes, or newlines, wrap in quotes
        if (str.includes(delim) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          str = str.replace(/"/g, '""');
          return `"${str}"`;
        }
        return str;
      };

      const csvRows: string[] = [];
      // Header row
      csvRows.push(headers.map(escapeCell).join(delim));

      // Data rows
      processedArray.forEach(item => {
        const row = headers.map(header => escapeCell(item[header]));
        csvRows.push(row.join(delim));
      });

      setOutputCsv(csvRows.join('\n'));
      setError('');
    } catch (err: any) {
      setError(err.message || 'รูปแบบ JSON ไม่ถูกต้อง');
      setOutputCsv('');
    }
  };

  const handleConvert = () => {
    convertToCsv(jsonInput, delimiter, flatten);
  };

  // Convert on load / initial
  useState(() => {
    convertToCsv(jsonInput, delimiter, flatten);
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setJsonInput(content);
        convertToCsv(content, delimiter, flatten);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!outputCsv) return;
    navigator.clipboard.writeText(outputCsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    if (!outputCsv) return;
    const blob = new Blob(['\uFEFF' + outputCsv], { type: 'text/csv;charset=utf-8;' }); // \uFEFF for BOM (Excel Thai support)
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_export_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Parse CSV for table preview
  const parseCsvToTable = (csvText: string) => {
    if (!csvText) return { headers: [], rows: [] };
    const lines = csvText.split('\n');
    if (lines.length === 0) return { headers: [], rows: [] };

    // Basic splitter taking quotes into account
    const parseLine = (line: string) => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
          inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
          result.push(current.replace(/^"(.*)"$/, '$1').replace(/""/g, '"'));
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.replace(/^"(.*)"$/, '$1').replace(/""/g, '"'));
      return result;
    };

    const headers = parseLine(lines[0]);
    const rows = lines.slice(1).filter(l => l.trim().length > 0).map(parseLine);
    return { headers, rows };
  };

  const { headers, rows } = parseCsvToTable(outputCsv);

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 px-4 md:px-8 z-10">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1 uppercase tracking-wider">
            <FileSpreadsheet size={18} />
            <span>Developer Tools</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">JSON to CSV / Excel</h1>
          <p className="text-muted text-sm font-medium mt-1">
            แปลงข้อมูล JSON เป็นตาราง CSV หรือ Excel ได้ทันที สะดวกสำหรับทำ Data Export
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <label className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-black/5 dark:hover:bg-white/10 border border-border text-text rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-sm">
            <Upload size={16} />
            <span>อัปโหลด JSON</span>
            <input type="file" accept=".json,application/json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleConvert}
            className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all active:scale-95"
          >
            <RefreshCw size={16} />
            <span>แปลงข้อมูล</span>
          </button>
        </div>
      </div>

      {/* Settings Bar */}
      <div className="glass-panel w-full max-w-6xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-muted uppercase tracking-wider">ตัวคั่น (Delimiter):</label>
            <select
              value={delimiter}
              onChange={(e) => {
                setDelimiter(e.target.value);
                convertToCsv(jsonInput, e.target.value, flatten);
              }}
              className="bg-background border border-border text-text text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value=",">Comma ( , ) - Standard CSV</option>
              <option value=";">Semicolon ( ; ) - European Excel</option>
              <option value="&#9;">Tab ( \t ) - TSV</option>
              <option value="|">Pipe ( | )</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-text font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={flatten}
              onChange={(e) => {
                setFlatten(e.target.checked);
                convertToCsv(jsonInput, delimiter, e.target.checked);
              }}
              className="rounded border-border text-primary focus:ring-primary/50 bg-background w-4 h-4"
            />
            <span>คลี่ Nested JSON (Flatten Objects)</span>
          </label>
        </div>

        <div className="text-xs text-muted font-medium">
          {rows.length > 0 && <span>จำนวนข้อมูล: <strong className="text-primary">{rows.length}</strong> แถว | <strong className="text-primary">{headers.length}</strong> คอลัมน์</span>}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="w-full max-w-6xl mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-600 dark:text-red-300 text-sm font-mono flex items-center justify-between">
          <span className="flex items-center gap-2">
            ⚠️ <strong>รูปแบบ JSON ไม่ถูกต้อง:</strong> {error}
          </span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 dark:hover:text-red-100 text-base">✕</button>
        </div>
      )}

      {/* Main Grid: Input & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Left: Input JSON */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel flex flex-col h-[520px] overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-black/5 dark:bg-white/5">
            <div className="flex items-center gap-2 text-text font-bold text-sm">
              <FileCode size={16} className="text-primary" />
              <span>Input JSON Data</span>
            </div>
            <button
              onClick={() => {
                setJsonInput('');
                setOutputCsv('');
                setError('');
              }}
              className="text-xs text-muted hover:text-text px-2 py-1 rounded bg-surface border border-border transition-colors"
            >
              ล้างข้อมูล
            </button>
          </div>

          <div className="flex-1 p-3 relative">
            <textarea
              className="w-full h-full bg-background/50 border-none rounded-xl p-4 text-text font-mono text-sm resize-none outline-none focus:ring-1 focus:ring-primary/50 shadow-inner"
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                convertToCsv(e.target.value, delimiter, flatten);
              }}
              placeholder="วาง JSON Array หรือ Object ของคุณที่นี่..."
              spellCheck="false"
            />
          </div>
        </motion.div>

        {/* Right: CSV Output / Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel flex flex-col h-[520px] overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-black/5 dark:bg-white/5">
            {/* View switcher tabs */}
            <div className="flex items-center gap-1 bg-background/50 p-1 rounded-lg border border-border">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  activeTab === 'preview'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted hover:text-text'
                }`}
              >
                ตาราง Preview
              </button>
              <button
                onClick={() => setActiveTab('raw')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  activeTab === 'raw'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted hover:text-text'
                }`}
              >
                CSV Code
              </button>
            </div>

            {/* Copy / Download buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!outputCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border hover:bg-black/5 dark:hover:bg-white/5 text-text rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>

              <button
                onClick={handleDownloadCsv}
                disabled={!outputCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Download size={14} />
                <span>ดาวน์โหลด CSV / Excel</span>
              </button>
            </div>
          </div>

          <div className="flex-1 p-3 overflow-auto">
            {activeTab === 'preview' ? (
              headers.length > 0 ? (
                <div className="w-full h-full overflow-auto rounded-xl border border-border bg-background/50">
                  <table className="w-full text-left text-sm font-sans border-collapse">
                    <thead className="sticky top-0 bg-surface/90 backdrop-blur-md border-b border-border z-10">
                      <tr>
                        {headers.map((h, i) => (
                          <th key={i} className="px-4 py-2.5 font-bold text-primary text-xs uppercase tracking-wider whitespace-nowrap border-r border-border/50 last:border-r-0">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-mono text-xs">
                      {rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          {headers.map((_, cIdx) => (
                            <td key={cIdx} className="px-4 py-2 text-text/90 whitespace-nowrap border-r border-border/30 last:border-r-0">
                              {row[cIdx] !== undefined ? row[cIdx] : ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted gap-2">
                  <Sparkles size={32} className="opacity-40" />
                  <p className="text-sm font-medium">ยังไม่มีข้อมูลสำหรับแสดงตาราง</p>
                </div>
              )
            ) : (
              <textarea
                readOnly
                className="w-full h-full bg-background/50 border-none rounded-xl p-4 text-text font-mono text-sm resize-none outline-none shadow-inner"
                value={outputCsv}
                placeholder="ผลลัพธ์ CSV จะปรากฏที่นี่..."
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
