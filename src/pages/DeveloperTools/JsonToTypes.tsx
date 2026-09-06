import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

const SAMPLE_JSON = `{
  "id": 101,
  "name": "Convertly App",
  "is_active": true,
  "tags": ["utility", "react", "typescript"],
  "owner": {
    "username": "woradet",
    "email": "user@example.com"
  }
}`;

export default function JsonToTypes() {
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_JSON);
  const [targetType, setTargetType] = useState<'typescript' | 'zod' | 'go'>('typescript');
  const [copied, setCopied] = useState<boolean>(false);

  const generateOutput = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (typeof parsed !== 'object' || parsed === null) return '// Output: Please enter a valid JSON object';

      if (targetType === 'typescript') {
        return generateTypeScript(parsed, 'RootObject');
      } else if (targetType === 'zod') {
        return generateZodSchema(parsed, 'RootSchema');
      } else if (targetType === 'go') {
        return generateGoStruct(parsed, 'RootStruct');
      }
    } catch (e: any) {
      return `// Invalid JSON: ${e.message}`;
    }
    return '';
  };

  const generateTypeScript = (obj: any, name: string): string => {
    let result = `export interface ${name} {\n`;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      const typeStr = typeof val === 'object' && val !== null
        ? Array.isArray(val) ? `${typeof val[0] || 'any'}[]` : 'Record<string, any>'
        : typeof val;
      result += `  ${key}: ${typeStr};\n`;
    }
    result += `}`;
    return result;
  };

  const generateZodSchema = (obj: any, name: string): string => {
    let result = `import { z } from 'zod';\n\nexport const ${name} = z.object({\n`;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      let zodType = 'z.any()';
      if (typeof val === 'string') zodType = 'z.string()';
      else if (typeof val === 'number') zodType = 'z.number()';
      else if (typeof val === 'boolean') zodType = 'z.boolean()';
      else if (Array.isArray(val)) zodType = 'z.array(z.any())';
      else if (typeof val === 'object') zodType = 'z.object({})';
      result += `  ${key}: ${zodType},\n`;
    }
    result += `});`;
    return result;
  };

  const generateGoStruct = (obj: any, name: string): string => {
    let result = `type ${name} struct {\n`;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      const fieldName = key.charAt(0).toUpperCase() + key.slice(1).replace(/_([a-z])/g, (_, g) => g.toUpperCase());
      let goType = 'interface{}';
      if (typeof val === 'string') goType = 'string';
      else if (typeof val === 'number') goType = Number.isInteger(val) ? 'int' : 'float64';
      else if (typeof val === 'boolean') goType = 'bool';
      else if (Array.isArray(val)) goType = '[]interface{}';
      result += `\t${fieldName} ${goType} \`json:"${key}"\`\n`;
    }
    result += `}`;
    return result;
  };

  const outputCode = generateOutput();

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-5xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">JSON to TypeScript / Schema</h1>
        <p className="text-muted font-medium text-lg">Generate TypeScript interfaces, Zod schemas, or Go structs from JSON.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-5xl p-6 md:p-8 flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[420px]">
          {/* Input JSON */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Input JSON</label>
            <textarea
              className="w-full h-full min-h-[380px] bg-background border border-border focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-2xl p-4 text-text font-mono text-sm outline-none shadow-inner resize-none"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste JSON here..."
            />
          </div>

          {/* Target Output */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex bg-background border border-border p-1 rounded-xl">
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${targetType === 'typescript' ? 'bg-emerald-500 text-white shadow-sm' : 'text-muted hover:text-text'}`}
                  onClick={() => setTargetType('typescript')}
                >
                  TypeScript
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${targetType === 'zod' ? 'bg-emerald-500 text-white shadow-sm' : 'text-muted hover:text-text'}`}
                  onClick={() => setTargetType('zod')}
                >
                  Zod Schema
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${targetType === 'go' ? 'bg-emerald-500 text-white shadow-sm' : 'text-muted hover:text-text'}`}
                  onClick={() => setTargetType('go')}
                >
                  Go Struct
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-bold text-text hover:bg-surface transition-all flex items-center gap-1.5 shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
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
