import { useState } from 'react';
import { Send, Plus, Trash2, Copy, Check, Clock, ShieldCheck, Code, Globe } from 'lucide-react';

interface KeyValueItem {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export default function ApiTester() {
  const [url, setUrl] = useState<string>('https://jsonplaceholder.typicode.com/posts/1');
  const [method, setMethod] = useState<string>('GET');
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');
  const [bodyMode, setBodyMode] = useState<'json' | 'raw'>('json');
  
  const [queryParams, setQueryParams] = useState<KeyValueItem[]>([
    { id: '1', key: '', value: '', enabled: true }
  ]);
  
  const [headers, setHeaders] = useState<KeyValueItem[]>([
    { id: '1', key: 'Content-Type', value: 'application/json', enabled: true }
  ]);
  
  const [bodyText, setBodyText] = useState<string>('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [statusText, setStatusText] = useState<string>('');
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseSize, setResponseSize] = useState<string | null>(null);
  const [responseBody, setResponseBody] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);

  const addQueryParam = () => {
    setQueryParams([...queryParams, { id: Date.now().toString(), key: '', value: '', enabled: true }]);
  };

  const updateQueryParam = (id: string, field: 'key' | 'value' | 'enabled', val: any) => {
    setQueryParams(queryParams.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const removeQueryParam = (id: string) => {
    setQueryParams(queryParams.filter(item => item.id !== id));
  };

  const addHeader = () => {
    setHeaders([...headers, { id: Date.now().toString(), key: '', value: '', enabled: true }]);
  };

  const updateHeader = (id: string, field: 'key' | 'value' | 'enabled', val: any) => {
    setHeaders(headers.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const removeHeader = (id: string) => {
    setHeaders(headers.filter(item => item.id !== id));
  };

  const buildFinalUrl = () => {
    try {
      const activeParams = queryParams.filter(p => p.enabled && p.key.trim() !== '');
      if (activeParams.length === 0) return url;

      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      activeParams.forEach(p => urlObj.searchParams.append(p.key.trim(), p.value.trim()));
      return urlObj.toString();
    } catch {
      return url;
    }
  };

  const handleSendRequest = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setResponseBody(null);
    setResponseStatus(null);

    const startTime = performance.now();
    const finalUrl = buildFinalUrl();

    const reqHeaders: Record<string, string> = {};
    headers.filter(h => h.enabled && h.key.trim() !== '').forEach(h => {
      reqHeaders[h.key.trim()] = h.value.trim();
    });

    const fetchOptions: RequestInit = {
      method,
      headers: reqHeaders,
    };

    if (['POST', 'PUT', 'PATCH'].includes(method) && bodyText) {
      fetchOptions.body = bodyText;
    }

    try {
      const res = await fetch(finalUrl, fetchOptions);
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(res.status);
      setStatusText(res.statusText || (res.ok ? 'OK' : 'Error'));

      const rawText = await res.text();
      setResponseSize(`${(new Blob([rawText]).size / 1024).toFixed(2)} KB`);

      try {
        const json = JSON.parse(rawText);
        setResponseBody(JSON.stringify(json, null, 2));
      } catch {
        setResponseBody(rawText);
      }
    } catch (err: any) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setErrorMsg(err.message || 'CORS Error หรือไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ปลายทางได้');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (!responseBody) return;
    navigator.clipboard.writeText(responseBody);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-10 md:py-16 z-10">
      <div className="w-full max-w-5xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-text mb-3 tracking-tight flex items-center justify-center gap-3">
          <Globe className="w-10 h-10 text-emerald-500" /> REST API Client & Request Tester
        </h1>
        <p className="text-muted font-semibold text-base md:text-lg">
          ทดสอบยิง HTTP Requests (GET, POST, PUT, DELETE) พร้อมตรวจสอบ Response, Headers และ Response Time ทันที
        </p>
      </div>

      <div className="w-full max-w-5xl flex flex-col gap-6 px-4">
        {/* URL Bar & Method Picker */}
        <div className="glass-panel p-4 md:p-6 flex flex-col sm:flex-row gap-3 items-center">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full sm:w-36 bg-background border border-border focus:border-emerald-500 rounded-xl px-4 py-3 text-text font-black text-base outline-none cursor-pointer shadow-inner"
          >
            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map((m) => (
              <option key={m} value={m} className="bg-surface font-bold text-text">{m}</option>
            ))}
          </select>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/v1/resource"
            className="flex-1 w-full bg-background border border-border focus:border-emerald-500 rounded-xl px-4 py-3 text-text font-medium text-base outline-none shadow-inner"
          />

          <button
            onClick={handleSendRequest}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-extrabold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 shrink-0"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>ส่งคำขอ (Send)</span>
              </>
            )}
          </button>
        </div>

        {/* Request Tabs (Params, Headers, Body) */}
        <div className="glass-panel p-6 flex flex-col gap-4">
          <div className="flex border-b border-border gap-6">
            <button
              onClick={() => setActiveTab('params')}
              className={`pb-3 font-extrabold text-sm border-b-2 transition-all ${
                activeTab === 'params' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-muted hover:text-text'
              }`}
            >
              Params ({queryParams.filter(p => p.enabled && p.key).length})
            </button>
            <button
              onClick={() => setActiveTab('headers')}
              className={`pb-3 font-extrabold text-sm border-b-2 transition-all ${
                activeTab === 'headers' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-muted hover:text-text'
              }`}
            >
              Headers ({headers.filter(h => h.enabled && h.key).length})
            </button>
            <button
              onClick={() => setActiveTab('body')}
              className={`pb-3 font-extrabold text-sm border-b-2 transition-all ${
                activeTab === 'body' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-muted hover:text-text'
              }`}
            >
              Body
            </button>
          </div>

          {/* Params Tab */}
          {activeTab === 'params' && (
            <div className="flex flex-col gap-3">
              {queryParams.map((param) => (
                <div key={param.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={param.enabled}
                    onChange={(e) => updateQueryParam(param.id, 'enabled', e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder="Key"
                    value={param.key}
                    onChange={(e) => updateQueryParam(param.id, 'key', e.target.value)}
                    className="flex-1 bg-background border border-border focus:border-emerald-500 rounded-xl px-3 py-2 text-text text-sm font-mono outline-none shadow-inner"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={param.value}
                    onChange={(e) => updateQueryParam(param.id, 'value', e.target.value)}
                    className="flex-1 bg-background border border-border focus:border-emerald-500 rounded-xl px-3 py-2 text-text text-sm font-mono outline-none shadow-inner"
                  />
                  <button
                    onClick={() => removeQueryParam(param.id)}
                    className="p-2 text-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addQueryParam}
                className="self-start text-xs font-extrabold text-emerald-500 hover:text-emerald-600 flex items-center gap-1 mt-1"
              >
                <Plus className="w-3.5 h-3.5" /> เพิ่ม Parameter
              </button>
            </div>
          )}

          {/* Headers Tab */}
          {activeTab === 'headers' && (
            <div className="flex flex-col gap-3">
              {headers.map((header) => (
                <div key={header.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={header.enabled}
                    onChange={(e) => updateHeader(header.id, 'enabled', e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder="Header Key (e.g. Authorization)"
                    value={header.key}
                    onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                    className="flex-1 bg-background border border-border focus:border-emerald-500 rounded-xl px-3 py-2 text-text text-sm font-mono outline-none shadow-inner"
                  />
                  <input
                    type="text"
                    placeholder="Header Value"
                    value={header.value}
                    onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                    className="flex-1 bg-background border border-border focus:border-emerald-500 rounded-xl px-3 py-2 text-text text-sm font-mono outline-none shadow-inner"
                  />
                  <button
                    onClick={() => removeHeader(header.id)}
                    className="p-2 text-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addHeader}
                className="self-start text-xs font-extrabold text-emerald-500 hover:text-emerald-600 flex items-center gap-1 mt-1"
              >
                <Plus className="w-3.5 h-3.5" /> เพิ่ม Header
              </button>
            </div>
          )}

          {/* Body Tab */}
          {activeTab === 'body' && (
            <div className="flex flex-col gap-3">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-bold text-text cursor-pointer">
                  <input
                    type="radio"
                    name="bodyMode"
                    checked={bodyMode === 'json'}
                    onChange={() => setBodyMode('json')}
                    className="accent-emerald-500"
                  />
                  JSON (application/json)
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-text cursor-pointer">
                  <input
                    type="radio"
                    name="bodyMode"
                    checked={bodyMode === 'raw'}
                    onChange={() => setBodyMode('raw')}
                    className="accent-emerald-500"
                  />
                  Raw Text / XML
                </label>
              </div>
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                rows={6}
                placeholder="ระบุข้อความ Request Body..."
                className="w-full bg-background border border-border focus:border-emerald-500 rounded-xl p-4 font-mono text-sm text-text outline-none shadow-inner"
              />
            </div>
          )}
        </div>

        {/* Response Panel */}
        <div className="glass-panel p-6 flex flex-col gap-4 min-h-[300px]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <span className="text-sm font-black text-text flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-500" /> Response Output
            </span>

            {responseStatus !== null && (
              <div className="flex items-center gap-4 text-xs font-extrabold">
                <span className={`px-3 py-1 rounded-full ${
                  responseStatus >= 200 && responseStatus < 300
                    ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-500 border border-red-500/30'
                }`}>
                  Status: {responseStatus} {statusText}
                </span>
                {responseTime !== null && (
                  <span className="text-muted flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {responseTime} ms
                  </span>
                )}
                {responseSize !== null && (
                  <span className="text-muted flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {responseSize}
                  </span>
                )}
              </div>
            )}
          </div>

          {errorMsg ? (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 font-medium text-sm rounded-xl">
              ⚠️ <strong>เกิดข้อผิดพลาด:</strong> {errorMsg}
            </div>
          ) : responseBody ? (
            <div className="relative">
              <button
                onClick={handleCopyResponse}
                className="absolute right-4 top-4 px-3 py-1.5 bg-surface/90 hover:bg-emerald-500/20 border border-border text-xs font-bold text-text hover:text-emerald-500 rounded-lg transition-all flex items-center gap-1.5"
              >
                {copiedResponse ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedResponse ? 'คัดลอกแล้ว' : 'คัดลอก Response'}</span>
              </button>
              <pre className="w-full max-h-[420px] overflow-auto p-4 bg-background/80 border border-border rounded-xl font-mono text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed shadow-inner">
                {responseBody}
              </pre>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted font-medium text-sm">
              <span>กดปุ่ม "ส่งคำขอ (Send)" ด้านบนเพื่อทดสอบยิง API และรับผลลัพธ์</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
