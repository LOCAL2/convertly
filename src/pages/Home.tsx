import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, CheckCircle2, ChevronRight, Bot, User, Send, ExternalLink, 
  Code2, Clock, KeyRound, Percent, FileJson, Terminal, Copy, Check, AlertCircle,
  Globe, Play, Zap, ShieldCheck, Dices, Image, Calculator, Palette, Hash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { safeBase64Encode, safeBase64Decode, safeBase32Encode, safeBase32Decode, calcPercentValueOf } from '../utils/converters';
import { formatJson, generatePassword } from '../utils/toolsHelpers';

interface InlineWidget {
  type: 'base64' | 'password' | 'percentage' | 'json' | 'radix' | 'temperature' | 'date_diff' | 'case_converter' | 'api_tester';
}

interface InteractiveChoice {
  label: string;
  sublabel?: string;
  actionType: 'inline' | 'navigate' | 'next_question';
  widgetType?: InlineWidget['type'];
  targetPath?: string;
  nextStepId?: string;
}

interface StepNode {
  question: string;
  choices: InteractiveChoice[];
}

const INTENT_TREE: Record<string, StepNode> = {
  root_json: {
    question: 'พบคำขอเกี่ยวกับ JSON คุณต้องการทำงานบนหน้านี้ หรือเปิดไปที่หน้าเครื่องมือเต็มรูปแบบครับ?',
    choices: [
      { label: 'จัดรูปแบบ & ตรวจสอบไวยากรณ์ (JSON Formatter)', actionType: 'inline', widgetType: 'json' },
      { label: 'แปลง JSON เป็น CSV / Excel (JSON to CSV)', actionType: 'navigate', targetPath: '/developer-tools/json-to-csv' },
      { label: 'แปลง JSON เป็น TypeScript / Go Struct', actionType: 'navigate', targetPath: '/developer-tools/json-to-types' },
      { label: 'เปิดหน้า JSON Formatter เต็มรูปแบบ', actionType: 'navigate', targetPath: '/developer-tools/json-formatter' },
    ]
  },

  root_code: {
    question: 'ตรวจพบซอร์สโค้ด เลือกเครื่องมือการทำงานที่ต้องการ:',
    choices: [
      { label: 'ลบคอมเมนต์ออกจากซอร์สโค้ด (Clean Comments)', actionType: 'navigate', targetPath: '/developer-tools/comment-remover' },
      { label: 'สร้างคำสั่ง Git Cheat Sheet', actionType: 'navigate', targetPath: '/developer-tools/git-cheatsheet' },
      { label: 'แปลงคำสั่ง cURL เป็น Fetch / Axios Code', actionType: 'navigate', targetPath: '/developer-tools/curl-converter' },
      { label: 'จัดรูปแบบโค้ด (SQL / CSS Formatter)', actionType: 'next_question', nextStepId: 'code_formatter' },
    ]
  },

  code_formatter: {
    question: 'ระบุประเภทโค้ดที่คุณต้องการจัดรูปแบบ (Format Code):',
    choices: [
      { label: 'จัดรูปแบบ SQL Query (SQL Formatter)', actionType: 'navigate', targetPath: '/developer-tools/sql-formatter' },
      { label: 'จัดรูปแบบ CSS Stylesheet (CSS Formatter)', actionType: 'navigate', targetPath: '/developer-tools/css-formatter' },
    ]
  },

  root_password: {
    question: 'ตรวจพบความต้องการเกี่ยวกับรหัสผ่าน เลือกรายการที่ต้องการ:',
    choices: [
      { label: 'สุ่มสร้างรหัสผ่านปลอดภัยสูง (Password Generator)', actionType: 'inline', widgetType: 'password' },
      { label: 'วิเคราะห์ความแข็งแกร่ง (Password Entropy Analyzer)', actionType: 'navigate', targetPath: '/encoders-decoders/password-analyzer' },
      { label: 'เข้ารหัส / ถอดรหัสไฟล์ (AES 256 Encryption)', actionType: 'navigate', targetPath: '/encoders-decoders/aes-encrypt' },
      { label: 'เปิดหน้า Password Generator เต็มรูปแบบ', actionType: 'navigate', targetPath: '/encoders-decoders/password-generator' },
    ]
  },

  root_base64: {
    question: 'ตรวจพบงานประเภท Base64 เลือกการทำงาน:',
    choices: [
      { label: 'Encode / Decode Base64 (ทำบนหน้านี้ทันที)', actionType: 'inline', widgetType: 'base64' },
      { label: 'เปิดหน้า Text Base64 เต็มรูปแบบ', actionType: 'navigate', targetPath: '/encoders-decoders/text-base64' },
    ]
  },

  root_percentage: {
    question: 'ตรวจพบการคำนวณเปอร์เซ็นต์ เลือกโหมดที่ต้องการ:',
    choices: [
      { label: 'คำนวณเปอร์เซ็นต์ (ทำบนหน้านี้ทันที)', actionType: 'inline', widgetType: 'percentage' },
      { label: 'เปิดหน้า Percentage Calculator เต็มรูปแบบ', actionType: 'navigate', targetPath: '/calculators/percentage' },
    ]
  },

  root_time: {
    question: 'หมวดหมู่การคำนวณวันและเวลา เลือกเครื่องมือที่ต้องการ:',
    choices: [
      { label: 'เปรียบเทียบเวลาต่างประเทศ Real-time (Timezone Converter)', actionType: 'navigate', targetPath: '/time-tools/timezone-converter' },
      { label: 'คำนวณวันทำงานของไทย (Thai Working Days Calculator)', actionType: 'navigate', targetPath: '/time-tools/working-days' },
      { label: 'แปลง Unix Timestamp ↔ Date', actionType: 'navigate', targetPath: '/time-tools/unix-timestamp' },
    ]
  },

  root_general: {
    question: 'ระบบเลือกเครื่องมือที่ตรงกับคำขอของคุณมากที่สุด:',
    choices: [
      { label: 'แปลงข้อความ Base64 (ทำบนหน้านี้ทันที)', actionType: 'inline', widgetType: 'base64' },
      { label: 'สุ่มสร้างรหัสผ่านปลอดภัย (ทำบนหน้านี้ทันที)', actionType: 'inline', widgetType: 'password' },
      { label: 'คำนวณเปอร์เซ็นต์ (ทำบนหน้านี้ทันที)', actionType: 'inline', widgetType: 'percentage' },
      { label: 'สร้างรหัส UUID v4 / Hardware Serial', actionType: 'navigate', targetPath: '/developer-tools/uuid-generator' },
    ]
  }
};

const ALL_SUGGESTION_CHIPS = [
  { label: 'ทดสอบ API Endpoint', icon: Globe, query: 'ทดสอบ api' },
  { label: 'แปลง Base64', icon: Terminal, query: 'base64' },
  { label: 'สุ่มสร้างรหัสผ่าน', icon: KeyRound, query: 'รหัสผ่าน' },
  { label: 'จัดรูปแบบ JSON', icon: FileJson, query: 'json' },
  { label: 'คำนวณเปอร์เซ็นต์', icon: Percent, query: 'เปอร์เซ็นต์' },
  { label: 'คำนวณวันทำงานไทย', icon: Clock, query: 'วันทำงาน' },
  { label: 'วงล้อสุ่มเลือกอาหาร', icon: Dices, query: 'วงล้อสุ่ม' },
  { label: 'แปลงสี HEX ↔ RGB', icon: Palette, query: 'แปลงสี hex' },
  { label: 'สร้าง QR Code', icon: Image, query: 'สร้าง qr code' },
  { label: 'คำนวณดัชนีมวลกาย BMI', icon: Calculator, query: 'bmi' },
  { label: 'เปรียบเทียบเวลาต่างประเทศ', icon: Clock, query: 'เทียบเวลา' },
  { label: 'สร้างรหัส UUID v4', icon: Hash, query: 'uuid' },
  { label: 'คำนวณ Hash SHA256', icon: ShieldCheck, query: 'hash sha256' },
  { label: 'แปลงหน่วยอุณหภูมิ', icon: Terminal, query: '50C เท่ากับกี่ F' },
  { label: 'แปลงเลขฐาน Binary/Hex', icon: Code2, query: '1010 ฐาน 2' },
];

export default function Home() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [randomChips, setRandomChips] = useState<typeof ALL_SUGGESTION_CHIPS>([]);

  useEffect(() => {
    // Randomize 5 chips on every refresh / mount
    const shuffled = [...ALL_SUGGESTION_CHIPS].sort(() => 0.5 - Math.random());
    setRandomChips(shuffled.slice(0, 5));
  }, []);
  const [chatHistory, setChatHistory] = useState<Array<{
    id: string;
    type: 'user' | 'system';
    text: string;
    choices?: InteractiveChoice[];
    inlineWidget?: InlineWidget['type'];
  }>>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleCopy = (textToCopy: string, key: string) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const [b64Input, setB64Input] = useState('');
  const [b64Output, setB64Output] = useState('');
  const [b64Mode, setB64Mode] = useState<'encode' | 'decode'>('encode');
  const [b64Type, setB64Type] = useState<'base64' | 'base32'>('base64');

  const [passLen, setPassLen] = useState(16);
  const [passResult, setPassResult] = useState('');

  const [pctP, setPctP] = useState('20');
  const [pctTotal, setPctTotal] = useState('500');

  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');

  // Radix Converter State
  const [radixVal, setRadixVal] = useState('32');
  const [radixBase, setRadixBase] = useState<number>(10);
  const [radixResults, setRadixResults] = useState<{ bin: string; dec: string; hex: string; oct: string }>({
    bin: '100000',
    dec: '32',
    hex: '20',
    oct: '40'
  });

  const handleRadixConvert = (val: string, base: number) => {
    setRadixVal(val);
    setRadixBase(base);
    if (!val.trim()) {
      setRadixResults({ bin: '', dec: '', hex: '', oct: '' });
      return;
    }
    try {
      const num = parseInt(val.trim(), base);
      if (isNaN(num)) {
        setRadixResults({ bin: 'Invalid', dec: 'Invalid', hex: 'Invalid', oct: 'Invalid' });
        return;
      }
      setRadixResults({
        bin: num.toString(2).toUpperCase(),
        dec: num.toString(10),
        hex: num.toString(16).toUpperCase(),
        oct: num.toString(8)
      });
    } catch {
      setRadixResults({ bin: 'Invalid', dec: 'Invalid', hex: 'Invalid', oct: 'Invalid' });
    }
  };

  // Temp Converter Inline State
  const [tempVal, setTempVal] = useState('50');
  const [tempUnit, setTempUnit] = useState<'C' | 'F' | 'K'>('C');
  const [tempResults, setTempResults] = useState<{ c: string; f: string; k: string }>({ c: '50.00', f: '122.00', k: '323.15' });

  const handleTempConvert = (valStr: string, unit: 'C' | 'F' | 'K') => {
    setTempVal(valStr);
    setTempUnit(unit);
    const num = parseFloat(valStr);
    if (isNaN(num)) {
      setTempResults({ c: '-', f: '-', k: '-' });
      return;
    }
    let c = 0, f = 0, k = 0;
    if (unit === 'C') {
      c = num;
      f = (num * 9) / 5 + 32;
      k = num + 273.15;
    } else if (unit === 'F') {
      c = ((num - 32) * 5) / 9;
      f = num;
      k = c + 273.15;
    } else {
      c = num - 273.15;
      f = (c * 9) / 5 + 32;
      k = num;
    }
    setTempResults({
      c: c.toFixed(2),
      f: f.toFixed(2),
      k: k.toFixed(2)
    });
  };
  const [homeTestUrl, setHomeTestUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [homeTestMethod, setHomeTestMethod] = useState('GET');
  const [homeTestBody, setHomeTestBody] = useState('');
  const [homeIsTesting, setHomeIsTesting] = useState(false);
  const [homeApiAnalysis, setHomeApiAnalysis] = useState<string | null>(null);
  const [homeApiResult, setHomeApiResult] = useState<{ status: string; duration: number; size: string; data: string } | null>(null);

  const analyzePayloadDataHome = (rawData: any): string => {
    if (!rawData) return 'ไม่มีชุดข้อมูลตอบกลับจากเซิร์ฟเวอร์';
    if (typeof rawData !== 'object') return `ข้อมูลการตอบกลับเป็นประเภทข้อความทั่วไป (${typeof rawData}): "${String(rawData).slice(0, 100)}..."`;

    // Smart Recursive Unwrap for Wrapper Objects (e.g. { success: true, data: { data: [...], total: 35 } })
    let targetPayload = rawData;
    let wrapperInfo = '';
    
    if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
      if ('data' in rawData && rawData.data) {
        wrapperInfo = ` (ห่อหุ้มด้วย Response Wrapper Standard)`;
        targetPayload = rawData.data;
        if (targetPayload && typeof targetPayload === 'object' && !Array.isArray(targetPayload) && 'data' in targetPayload && Array.isArray(targetPayload.data)) {
          targetPayload = targetPayload.data;
        }
      } else if ('items' in rawData && Array.isArray(rawData.items)) {
        wrapperInfo = ` (ห่อหุ้มด้วย Response Wrapper)`;
        targetPayload = rawData.items;
      } else if ('results' in rawData && Array.isArray(rawData.results)) {
        wrapperInfo = ` (ห่อหุ้มด้วย Response Wrapper)`;
        targetPayload = rawData.results;
      }
    }

    const isArray = Array.isArray(targetPayload);
    const firstItem = isArray ? (targetPayload[0] || {}) : targetPayload;
    const keys = Object.keys(firstItem || {});
    let analysis = '';

    if (isArray) {
      analysis += `โครงสร้างข้อมูลหลักเป็นรายการสืบค้น (Array List) รวมทั้งหมด ${targetPayload.length} รายการ${wrapperInfo}\n`;
    } else {
      analysis += `โครงสร้างข้อมูลหลักเป็น Object รายเดี่ยว ประกอบด้วยฟิลด์ข้อมูล ${keys.length} ฟิลด์${wrapperInfo}\n`;
    }

    // Deep Content Domain Recognition
    if (keys.includes('studentId') || keys.includes('student') || keys.includes('gender') || (keys.includes('name') && (String(firstItem.name).includes('นาย') || String(firstItem.name).includes('นาง')))) {
      analysis += `รายละเอียดคอนเทนต์: เป็นข้อมูลระเบียนนักเรียน/นักศึกษา (Student Registry Data) ประกอบด้วย รหัสนักศึกษา (studentId), ชื่อ-นามสกุล (name), เพศ (gender) และวันที่บันทึก (createdAt)`;
    } else if (keys.includes('userId') || keys.includes('title') || keys.includes('body')) {
      analysis += `รายละเอียดคอนเทนต์: เป็นข้อมูลบทความ/โพสต์ (Post Content) ประกอบด้วย รหัสผู้เขียน (userId), รหัสโพสต์ (id), หัวข้อ (title) และเนื้อหาหลัก (body)`;
    } else if (keys.includes('name') || keys.includes('email') || keys.includes('username')) {
      analysis += `รายละเอียดคอนเทนต์: เป็นข้อมูลโปรไฟล์ผู้ใช้งาน (User Profile) ประกอบด้วย ชื่อ, อีเมล และบัญชีผู้ใช้`;
    } else if (keys.includes('price') || keys.includes('product') || keys.includes('sku')) {
      analysis += `รายละเอียดคอนเทนต์: เป็นข้อมูลสินค้าและราคา (E-Commerce Product Data)`;
    } else {
      analysis += `ฟิลด์ข้อมูลที่ตรวจพบ: [${keys.slice(0, 8).join(', ')}${keys.length > 8 ? '...' : ''}]`;
    }

    return analysis;
  };

  const runHomeApiTestAndAnalyze = async (overrideUrl?: string, overrideMethod?: string, overrideBody?: string) => {
    const urlToRun = overrideUrl || homeTestUrl;
    const methodToRun = overrideMethod || homeTestMethod;
    const bodyToRun = overrideBody ?? homeTestBody;

    if (!urlToRun.trim()) return;
    setHomeIsTesting(true);
    setHomeApiAnalysis(null);
    setHomeApiResult(null);

    const startTime = performance.now();
    try {
      const options: RequestInit = { method: methodToRun };
      if (['POST', 'PUT', 'PATCH'].includes(methodToRun) && bodyToRun.trim()) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = bodyToRun;
      }

      const res = await fetch(urlToRun, options);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      const rawText = await res.text();
      let parsedJson: any = null;
      try { parsedJson = JSON.parse(rawText); } catch {}

      const isSuccess = res.ok;
      const statusStr = `${res.status} ${res.statusText || (isSuccess ? 'OK' : 'Error')}`;
      const payloadSize = (new Blob([rawText]).size / 1024).toFixed(2);
      const speedRating = duration < 300 ? 'รวดเร็วมาก' : duration < 1000 ? 'ปานกลาง' : 'ตอบสนองช้า';

      let aiAnalysis = `**วิเคราะห์ผลการทดสอบ API (HTTP ${methodToRun})**\n\n`;
      aiAnalysis += `• **สถานะการตอบรับ**: \`${statusStr}\` (${isSuccess ? 'สำเร็จ' : 'ผิดพลาด'})\n`;
      aiAnalysis += `• **ระยะเวลาประมวลผล**: \`${duration} ms\` (${speedRating})\n`;
      aiAnalysis += `• **ขนาด Response**: \`${payloadSize} KB\`\n\n`;
      
      aiAnalysis += `**วิเคราะห์โครงสร้างและเนื้อหาข้อมูล (Data Analysis)**:\n`;
      aiAnalysis += `• ${analyzePayloadDataHome(parsedJson || rawText)}\n\n`;

      aiAnalysis += `**ข้อสรุปและคำแนะนำเชิงลึก**:\n`;
      if (isSuccess) {
        aiAnalysis += `- Endpoint ตอบสนองสมบูรณ์ ข้อมูลอยู่ในรูปแบบ ${parsedJson ? 'JSON Valid Structure' : 'Text Content'}\n`;
        aiAnalysis += `- HTTP Status ${res.status} ยืนยันว่า request ได้รับการประมวลผลเรียบร้อยอย่างถูกต้อง`;
      } else {
        aiAnalysis += `- เกิดข้อผิดพลาด ${res.status}: กรุณาตรวจสอบ URL, Authentication Headers หรือโครงสร้าง Request Body\n`;
        aiAnalysis += `- หากขึ้น CORS Error ควรตรวจสอบการตั้งค่า Access-Control-Allow-Origin ที่เซิร์ฟเวอร์ปลายทาง`;
      }

      setHomeApiAnalysis(aiAnalysis);
      setHomeApiResult({
        status: statusStr,
        duration,
        size: payloadSize,
        data: parsedJson ? JSON.stringify(parsedJson, null, 2) : rawText.slice(0, 400)
      });
    } catch (err: any) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      const errorAnalysis = `**เกิดข้อผิดพลาดในการเชื่อมต่อ (Connection Error)**\n\n` +
        `• **ข้อความแจ้งเตือน**: \`${err.message || 'CORS Blocked หรือ Network Disconnected'}\`\n` +
        `• **ระยะเวลา**: \`${duration} ms\`\n\n` +
        `**วิเคราะห์และวิธีแก้ไข**:\n` +
        `1. เซิร์ฟเวอร์ปลายทางอาจบล็อกคำขอข้ามโดเมน (CORS Policy)\n` +
        `2. โดเมน URL ที่ระบุอาจไม่ถูกต้อง หรือเซิร์ฟเวอร์ออฟไลน์อยู่`;

      setHomeApiAnalysis(errorAnalysis);
    } finally {
      setHomeIsTesting(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, b64Output, passResult, jsonOutput]);

  const analyzeUserIntent = (text: string): { step: StepNode; directWidget?: InlineWidget['type']; directReply?: string; stepOverrideChoices?: InteractiveChoice[] } => {
    const raw = text.trim();
    const q = raw.toLowerCase();

    // Algorithm 0: API Testing & Endpoint URL Auto-Detect (e.g. "ทดสอบ api https://jsonplaceholder.typicode.com/posts/1", "ทดสอบ api")
    const urlMatch = raw.match(/(https?:\/\/[^\s]+)/gi);
    if (q.includes('api') || q.includes('ทดสอบ') || urlMatch) {
      const targetUrl = urlMatch ? urlMatch[0] : homeTestUrl;
      if (urlMatch) {
        setHomeTestUrl(targetUrl);
        // Auto-run test if full URL provided in prompt
        setTimeout(() => {
          runHomeApiTestAndAnalyze(targetUrl, 'GET', '');
        }, 100);
      }
      return {
        step: INTENT_TREE.root_code,
        directWidget: 'api_tester',
        directReply: urlMatch 
          ? `ฉันทำการยิง Request ไปยัง \`${targetUrl}\` พร้อมสังเคราะห์บทวิเคราะห์ข้อมูลเชิงลึกให้คุณด้านล่างแล้วครับ:`
          : `ฉันเตรียมกล่องฟอร์มสำหรับยิง Request และวิเคราะห์ **API Endpoint** ให้บนหน้านี้แล้วครับ:`
      };
    }

    // Algorithm 1: Direct JSON Payload Auto-Detect
    if ((raw.startsWith('{') && raw.endsWith('}')) || (raw.startsWith('[') && raw.endsWith(']'))) {
      handleFormatJsonInline(raw);
      return {
        step: INTENT_TREE.root_json,
        directWidget: 'json',
        directReply: `ตรวจพบโครงสร้าง JSON! ฉันทำการจัดรูปแบบและตรวจสอบไวยากรณ์ให้เรียบร้อยแล้วครับ:`
      };
    }

    // Algorithm 2: Direct Percentage Math Parser (e.g. "20% ของ 500", "50% 1000")
    const pctMatch = q.match(/(\d+(?:\.\d+)?)\s*%\s*(?:ของ|of)?\s*(\d+(?:\.\d+)?)/) || q.match(/(?:หา|คิด)?\s*(\d+(?:\.\d+)?)\s*%\s*(\d+(?:\.\d+)?)/);
    if (pctMatch) {
      const pVal = pctMatch[1];
      const tVal = pctMatch[2];
      setPctP(pVal);
      setPctTotal(tVal);
      const res = calcPercentValueOf(parseFloat(pVal), parseFloat(tVal));
      return {
        step: INTENT_TREE.root_percentage,
        directWidget: 'percentage',
        directReply: `ฉันคำนวณ ${pVal}% ของ ${tVal} = ${res?.toLocaleString('th-TH') ?? '-'} ให้เรียบร้อยแล้วครับ:`
      };
    }

    // Algorithm 3: Base Number System Parser (e.g. "1010 ในฐาน 2 ในฐาน 10", "32 ในฐาน 2", "255 ในฐาน 16", "10101 ฐาน 2", "binary")
    const doubleBaseMatch = q.match(/(\w+)\s*(?:ใน)?ฐาน\s*(\d+)\s*(?:ใน|เป็น|ไป)?ฐาน\s*(\d+)/);
    const singleBaseMatch = q.match(/(\w+)\s*(?:ใน)?ฐาน\s*(\d+)/) || q.match(/ฐาน\s*(\d+)\s*(\w+)/);

    if (doubleBaseMatch || singleBaseMatch || /ฐาน\s*\d+|binary|bin|hex|octal|ฐานสอง|ฐานสิบ/.test(q)) {
      let inputVal = '1010';
      let inputBase = 2;

      if (doubleBaseMatch) {
        // e.g. "1010 ในฐาน 2 ในฐาน 10" -> inputVal = "1010", inputBase = 2
        inputVal = doubleBaseMatch[1];
        const parsedBase = parseInt(doubleBaseMatch[2], 10);
        if (parsedBase >= 2 && parsedBase <= 36) inputBase = parsedBase;
      } else if (singleBaseMatch) {
        inputVal = singleBaseMatch[1];
        const specifiedBase = parseInt(singleBaseMatch[2], 10);
        
        // Check if inputVal is valid in the specified base (e.g., "1010" is valid in base 2)
        const isValidInSpecified = inputVal.split('').every(ch => {
          const digit = parseInt(ch, 36);
          return !isNaN(digit) && digit < specifiedBase;
        });

        // If specified base is small (like 2) and number has digits >= base (like 32 in base 2), 
        // specifiedBase is the TARGET base (so input is Decimal 10)
        // Otherwise, specifiedBase is the SOURCE base
        if (!isValidInSpecified) {
          inputBase = 10;
        } else {
          inputBase = specifiedBase;
        }
      }

      handleRadixConvert(inputVal, inputBase);
      return {
        step: INTENT_TREE.root_general,
        directWidget: 'radix',
        directReply: `ฉันแปลงเลข ${inputVal} (จากฐาน ${inputBase}) เป็น ฐาน 2, ฐาน 10, ฐาน 16 และ ฐาน 8 ให้เรียบร้อยแล้วครับ:`
      };
    }

    // Algorithm 4: Base64 / Base32 Text Encoding Intent (matches "base64", "base32", "b32", "b64", "base 64", "base 32", "nase64")
    if (/(?:base|nase)\s*(?:32|64)|b32|b64|base64|base32/.test(q)) {
      const isBase32 = q.includes('32') || q.includes('b32');
      const type = isBase32 ? 'base32' : 'base64';
      const mode = q.startsWith('decode') || q.includes('ถอด') ? 'decode' : 'encode';
      const parts = raw.split(/\s+/);
      const payload = parts.filter(p => !/base|nase|b32|b64|32|64|encode|decode|แปลง|ถอด|เข้า/i.test(p)).join(' ');
      setB64Mode(mode);
      setB64Type(type);
      if (payload) handleB64Convert(payload, mode, type);
      return {
        step: INTENT_TREE.root_base64,
        directWidget: 'base64',
        directReply: `ฉันเตรียมเครื่องมือสำหรับ ${type.toUpperCase()} (${mode.toUpperCase()}) บนหน้านี้เรียบร้อยแล้วครับ:`
      };
    }

    // Algorithm 4: UUID / GUID Intent with Direct Navigation Choice (e.g. "สร้าง uuid 15 อัน", "uuid", "guid")
    if (/uuid|guid|serial|ซีเรียล/.test(q)) {
      return {
        step: INTENT_TREE.root_general,
        directReply: `ตรวจพบคำขอสร้าง UUID / GUID! สามารถคลิกเปิดเครื่องมือสร้าง UUID v4 / Hardware Serial ได้ทันทีครับ:`,
        stepOverrideChoices: [
          { label: 'เปิดเครื่องมือสร้าง UUID v4 / Hardware Serial', actionType: 'navigate', targetPath: '/developer-tools/uuid-generator' },
          { label: 'สุ่มสร้างรหัสผ่านปลอดภัย (Password Generator)', actionType: 'inline', widgetType: 'password' },
        ]
      };
    }

    // Algorithm 5: Password Generator & Length Detection (e.g. "สุ่มรหัส 24 ตัว", "gen password 32")
    const passLenMatch = q.match(/(?:สุ่มรหัส|สร้างรหัส|รหัสผ่าน|password|pass|gen)\s*(\d{1,2})/);
    if (passLenMatch || /สุ่มรหัส|สร้างรหัส|รหัสผ่าน|password|pass|gen pass|พาสเวิร์ด/.test(q)) {
      let targetLen = 16;
      if (passLenMatch && passLenMatch[1]) {
        const parsed = parseInt(passLenMatch[1], 10);
        if (parsed >= 6 && parsed <= 64) targetLen = parsed;
      }
      const pass = generatePassword(targetLen, { lowercase: true, uppercase: true, numbers: true, symbols: true });
      setPassLen(targetLen);
      setPassResult(pass);
      return {
        step: INTENT_TREE.root_password,
        directWidget: 'password',
        directReply: `ฉันสุ่มสร้างรหัสผ่านที่มีความปลอดภัยสูง ${targetLen} หลัก ให้คุณเรียบร้อยแล้วครับ:`
      };
    }

    // Algorithm 6: Date Difference Matching (e.g. "ระหว่างวันนี้ กับพรุ่งนี้หห่างกี่วัน", "ห่างกี่วัน", "ผลต่างวัน", "กี่วัน")
    if (/ห่างกี่วัน|ผลต่างวัน|กี่วัน|ระหว่างวัน|ต่างกี่วัน|นับวัน|date diff/.test(q)) {
      return {
        step: INTENT_TREE.root_time,
        directReply: `ตรวจพบคำขอคำนวณผลต่างของวัน (Date Difference)! สามารถกดเปิดเครื่องมือคำนวณระยะห่างระหว่างวันได้ทันทีครับ:`,
        stepOverrideChoices: [
          { label: 'เปิดเครื่องมือหาผลต่างวัน (Date Difference Calculator)', actionType: 'navigate', targetPath: '/time-tools/date-difference' },
          { label: 'คำนวณวันทำงานของไทย (Thai Working Days)', actionType: 'navigate', targetPath: '/time-tools/working-days' },
          { label: 'เปรียบเทียบเวลาต่างประเทศ (Timezone Converter)', actionType: 'navigate', targetPath: '/time-tools/timezone-converter' },
        ]
      };
    }

    // Algorithm 6b: Time & Timezone Typo Resilience (e.g. "เทียบเวลส", "เทียบเวลา", "โซนเวลา", "ต่างประเทศ")
    if (/เทียบเวล|เทียบเวลา|โซนเวลา|เวลาต่างประเทศ|timezone|gmt|utc|time zone|เวลาโลก/.test(q)) {
      return {
        step: INTENT_TREE.root_time,
        directReply: `ฉันพบคำขอเกี่ยวกับ Timezone Converter! สามารถกดปุ่มเพื่อเปิดเครื่องมือเปรียบเทียบเวลาต่างประเทศ Real-time ได้ทันทีครับ:`,
        stepOverrideChoices: [
          { label: 'เปิดเครื่องมือเปรียบเทียบเวลาต่างประเทศ (Timezone Converter)', actionType: 'navigate', targetPath: '/time-tools/timezone-converter' },
          { label: 'คำนวณวันทำงานของไทย (Thai Working Days)', actionType: 'navigate', targetPath: '/time-tools/working-days' },
          { label: 'แปลง Unix Timestamp ↔ Date', actionType: 'navigate', targetPath: '/time-tools/unix-timestamp' },
        ]
      };
    }

    // Algorithm 7: Temperature Converter (e.g., "50C เท่ากับกี่ F", "30 c เป็น f", "100 f", "อุณหภูมิ", "celsius", "fahrenheit")
    const tempMatch = q.match(/(\d+(?:\.\d+)?)\s*°?\s*([cfk])/i) || q.match(/อุณหภูมิ|celsius|fahrenheit|kelvin|องศา/i);
    if (tempMatch) {
      if (tempMatch[1] && tempMatch[2]) {
        const valStr = tempMatch[1];
        const unitStr = tempMatch[2].toUpperCase() as 'C' | 'F' | 'K';
        handleTempConvert(valStr, unitStr);
      } else {
        handleTempConvert('50', 'C');
      }
      return {
        step: INTENT_TREE.root_general,
        directWidget: 'temperature',
        directReply: `ฉันแปลงหน่วยอุณหภูมิให้คุณเรียบร้อยแล้วครับ:`
      };
    }

    // Algorithm 8: Unit Converters (Length, Weight, Data speed)
    if (/ความยาว|เมตร|กิโลเมตร|นิ้ว|ฟุต|ความยาว|length|weight|น้ำหนัก|กิโลกรัม|ปอนด์|download|mbps|เน็ต|ความเร็วเน็ต/.test(q)) {
      return {
        step: INTENT_TREE.root_general,
        directReply: `ตรวจพบคำขอแปลงหน่วยวัด! เลือกเครื่องมือแปลงหน่วยที่ต้องการ:`,
        stepOverrideChoices: [
          { label: 'แปลงหน่วยอุณหภูมิ (Temperature Converter)', actionType: 'navigate', targetPath: '/unit-converters/temperature' },
          { label: 'แปลงหน่วยความยาว (Length Converter)', actionType: 'navigate', targetPath: '/unit-converters/length' },
          { label: 'แปลงหน่วยน้ำหนัก (Weight Converter)', actionType: 'navigate', targetPath: '/unit-converters/weight' },
          { label: 'คำนวณความเร็วดาวน์โหลด (Download Speed)', actionType: 'navigate', targetPath: '/unit-converters/download-calculator' },
        ]
      };
    }

    // Algorithm 9: Color & UI Design Tools (HEX, RGB, HSL, Gradient, Glassmorphism, Palette)
    if (/color|สี|hex|rgb|hsl|gradient|contrast|glassmorphism|palette|จานสี|font|สัดส่วน|aspect ratio/.test(q)) {
      return {
        step: INTENT_TREE.root_general,
        directReply: `ตรวจพบคำขอเกี่ยวกับเครื่องมือสีและ UI Design! เลือกรายการที่ต้องการ:`,
        stepOverrideChoices: [
          { label: 'แปลงสี HEX ↔ RGB', actionType: 'navigate', targetPath: '/color-tools/hex-rgb' },
          { label: 'สร้าง CSS Gradient (Gradient Generator)', actionType: 'navigate', targetPath: '/color-tools/gradient-generator' },
          { label: 'สร้าง Glassmorphism CSS', actionType: 'navigate', targetPath: '/color-tools/glassmorphism-generator' },
          { label: 'สร้างจานสี (Color Palette Generator)', actionType: 'navigate', targetPath: '/color-tools/palette-generator' },
        ]
      };
    }

    // Algorithm 10: Network & Web Admin Tools (IP, Subnet, DNS, SSL, User Agent, Header)
    if (/ip|subnet|cidr|dns|ssl|cert|user agent|ua|header|cors|nginx|htaccess/.test(q)) {
      return {
        step: INTENT_TREE.root_general,
        directReply: `ตรวจพบงานด้าน Network & Web Server Admin! เลือกเครื่องมือที่ต้องการ:`,
        stepOverrideChoices: [
          { label: 'คำนวณ IP Subnet & CIDR', actionType: 'navigate', targetPath: '/network-tools/ip-subnet' },
          { label: 'ตรวจสอบ SSL Certificate', actionType: 'navigate', targetPath: '/network-tools/ssl-checker' },
          { label: 'ค้นหาข้อมูลระเบียน DNS (DNS Lookup)', actionType: 'navigate', targetPath: '/network-tools/dns-lookup' },
          { label: 'สร้างไฟล์ Nginx / Htaccess Config', actionType: 'navigate', targetPath: '/network-tools/nginx-htaccess-generator' },
        ]
      };
    }

    // Algorithm 11: Food & Decision Tools (Random Wheel, Split Bill, BMI)
    if (/กิน|อาหาร|มื้อ|เมนู|สุ่ม|วงล้อ|ตัดสินใจ|random|wheel|decision/.test(q)) {
      return {
        step: INTENT_TREE.root_general,
        directReply: `ตรวจพบคำขอเกี่ยวกับการเลือกอาหารและสุ่มตัวเลือก! สามารถเปิดใช้งานเครื่องมือวงล้อสุ่มเลือก (Random Wheel) หรือหารค่าอาหารได้ทันทีครับ:`,
        stepOverrideChoices: [
          { label: 'วงล้อสุ่มเลือกอาหาร & ตัวเลือก (Random Wheel)', actionType: 'navigate', targetPath: '/calculators/random-wheel' },
          { label: 'หารค่าอาหาร & ทิป (Split Bill Calculator)', actionType: 'navigate', targetPath: '/finance-tools/split-bill' },
          { label: 'คำนวณดัชนีมวลกาย (BMI Calculator)', actionType: 'navigate', targetPath: '/calculators/bmi' },
        ]
      };
    }

    // Algorithm 12: Image & Media Tools (QR Code, Crop, Compress, SVG, Favicon, EXIF)
    if (/image|รูป|รูปภาพ|qr|qrcode|compress|บีบอัด|favicon|crop|exif|svg/.test(q)) {
      return {
        step: INTENT_TREE.root_general,
        directReply: `ตรวจพบงานจัดการรูปภาพและสื่อดิจิทัล! เลือกเครื่องมือที่ต้องการ:`,
        stepOverrideChoices: [
          { label: 'สร้าง QR Code (QR Generator)', actionType: 'navigate', targetPath: '/image-tools/qr-generator' },
          { label: 'บีบอัดขนาดรูปภาพ (Image Compressor)', actionType: 'navigate', targetPath: '/image-tools/image-compressor' },
          { label: 'ครอบตัดย่อขนาดรูปภาพ (Image Crop & Resize)', actionType: 'navigate', targetPath: '/image-tools/image-cropper' },
          { label: 'สร้างไฟล์ ไอคอน Favicon', actionType: 'navigate', targetPath: '/image-tools/favicon-generator' },
        ]
      };
    }

    // Algorithm 13: Text & Document Tools (Word Counter, Case, Diff, Markdown, Lorem)
    if (/word|นับคำ|case|ตัวพิมพ์|diff|เปรียบเทียบข้อความ|markdown|lorem|ข้อความ/.test(q)) {
      return {
        step: INTENT_TREE.root_general,
        directReply: `ตรวจพบงานจัดการข้อความและเอกสาร! เลือกเครื่องมือที่ต้องการ:`,
        stepOverrideChoices: [
          { label: 'นับจำนวนคำและตัวอักษร (Word Counter)', actionType: 'navigate', targetPath: '/text-tools/word-counter' },
          { label: 'เปลี่ยนรูปแบบตัวพิมพ์ (Case Converter)', actionType: 'navigate', targetPath: '/text-tools/case-converter' },
          { label: 'เปรียบเทียบความแตกต่างข้อความ (Text Diff)', actionType: 'navigate', targetPath: '/text-tools/text-diff' },
          { label: 'เขียนและพรีวิว Markdown (Markdown Editor)', actionType: 'navigate', targetPath: '/text-tools/markdown-editor' },
        ]
      };
    }

    // Algorithm 14: Health & Calculators (BMI, Percentage)
    if (/bmi|ดัชนีมวลกาย|สุขภาพ|ความอ้วน/.test(q)) {
      return {
        step: INTENT_TREE.root_general,
        directReply: `ตรวจพบคำขอคำนวณดัชนีมวลกาย (BMI)! สามารถกดเปิดเครื่องมือคำนวณ BMI ได้ทันทีครับ:`,
        stepOverrideChoices: [
          { label: 'เปิดเครื่องมือคำนวณ BMI (BMI Calculator)', actionType: 'navigate', targetPath: '/calculators/bmi' },
          { label: 'คำนวณเปอร์เซ็นต์ (Percentage Calculator)', actionType: 'navigate', targetPath: '/calculators/percentage' },
        ]
      };
    }

    // Algorithm 15: Security & Hash Tools (Bcrypt, RSA, AES, Hash, JWT, URL Encode, HTML Entity)
    if (/hash|bcrypt|rsa|aes|jwt|url encode|html entity|security/.test(q)) {
      return {
        step: INTENT_TREE.root_password,
        directReply: `ตรวจพบคำขอความปลอดภัยและการเข้ารหัสลับ! เลือกเครื่องมือที่ต้องการ:`,
        stepOverrideChoices: [
          { label: 'เข้ารหัส / ถอดรหัส AES-256 (AES Encryption)', actionType: 'navigate', targetPath: '/encoders-decoders/aes-encrypt' },
          { label: 'สร้างคู่กุญแจ RSA Key Pair Generator', actionType: 'navigate', targetPath: '/encoders-decoders/rsa-generator' },
          { label: 'คำนวณและตรวจสอบ JWT Decoder', actionType: 'navigate', targetPath: '/encoders-decoders/jwt-decoder' },
          { label: 'สร้าง Hash (MD5 / SHA256 / Bcrypt)', actionType: 'navigate', targetPath: '/encoders-decoders/hash-generator' },
        ]
      };
    }

    // Algorithm 0: Greeting & Conversation Detection (e.g. "สวัสดี", "สวัสดีครับ", "hello", "hi", "test", "ทดสอบระบบ")
    if (/^(สวัสดี|สวัสดีครับ|สวัสดีค่ะ|สวัสดีจ้า|hello|hi|hey|test|ทดสอบ)$/i.test(q)) {
      return {
        step: INTENT_TREE.root_general,
        directReply: `สวัสดีครับ! ยินดีต้อนรับสู่ **Convertly** ศูนย์รวมเครื่องมือแปลงหน่วย, เครื่องมือนักพัฒนา, เวลา และคำนวณการเงินครบวงจร\n\nคุณสามารถพิมพ์สิ่งที่ต้องการทำ (เช่น *"แปลง 50C เป็น F"*, *"สุ่มรหัสผ่าน"*, *"จัดรูปแบบ JSON"*, *"ทดสอบ api"*) หรือเลือกเมนูเครื่องมือแนะนำด้านล่างได้เลยครับ:`,
        stepOverrideChoices: [
          { label: 'ทดสอบ API Endpoint', actionType: 'inline', widgetType: 'api_tester' },
          { label: 'สุ่มสร้างรหัสผ่านปลอดภัย', actionType: 'inline', widgetType: 'password' },
          { label: 'แปลงฐานเลข (Decimal ↔ Binary)', actionType: 'inline', widgetType: 'radix' },
          { label: 'คำนวณเปอร์เซ็นต์', actionType: 'inline', widgetType: 'percentage' },
        ]
      };
    }

    // Fallback Categorization Matching
    if (q.includes('code') || q.includes('โค้ด') || q.includes('comment') || q.includes('git') || q.includes('curl') || q.includes('sql') || q.includes('css')) return { step: INTENT_TREE.root_code };
    if (q.includes('time') || q.includes('วัน') || q.includes('เวลา') || q.includes('เวล') || q.includes('zone') || q.includes('date')) return { step: INTENT_TREE.root_time };
    
    return { 
      step: INTENT_TREE.root_general,
      directReply: `ยินดีต้อนรับครับ! ฉันได้คัดเลือกเครื่องมือที่ตรงกับคำขอหรือใกล้เคียงที่สุดมาให้คุณเลือกใช้งานดังนี้:`
    };
  };

  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleProcessInput = async (userText: string) => {
    if (!userText.trim()) return;
    setPrompt('');
    const intentResult = analyzeUserIntent(userText);
    
    // Push user message immediately
    const userMsgId = Date.now().toString();
    const systemMsgId = (Date.now() + 1).toString();
    
    setChatHistory(prev => [
      ...prev,
      { id: userMsgId, type: 'user', text: userText }
    ]);

    setIsLoadingAi(true);

    // Call Real Gemini 3.5 Flash API
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
    let aiResponseText = '';

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `คุณคือ Convertly AI ผู้ช่วยอัจฉริยะเพศชายประจำเว็บแอป Convertly
หน้าที่ของคุณคือตอบคำถามผู้ใช้เป็นภาษาไทยด้วยน้ำเสียงผู้ชายที่สุภาพ เป็นกันเอง และสั้นกระชับ ลงท้ายด้วย "ครับ" และแทนตัวเองว่า "ผม" ห้ามใช้ "ค่ะ" หรือ "นะคะ" อย่างเด็ดขาด
กฎสำคัญที่สุด:
1. คุณต้องแนะนำเฉพาะเครื่องมือที่มีอยู่จริงบนเว็บ Convertly เท่านั้น ได้แก่: วงล้อสุ่มเลือกอาหาร & ตัวเลือก (Random Wheel), แปลงข้อความ/รูปภาพ Base64, Base32, สุ่มรหัสผ่าน, JSON Formatter, UUID Generator, คำนวณเปอร์เซ็นต์, หารค่าอาหาร (Split Bill), BMI, แปลงหน่วย (อุณหภูมิ, ความยาว, น้ำหนัก, ความเร็วเน็ต), แปลงสี (HEX/RGB/HSL), CSS Generator, IP Subnet, SSL, DNS Lookup, Date Difference, Timezone Converter, Word Counter, Text Diff, QR Generator
2. หากผู้ใช้ถามเรื่องอาหาร หรือให้ช่วยเลือก/สุ่มตัวเลือก สามารถแนะนำให้ลองใช้เครื่องมือ "วงล้อสุ่มเลือก (Random Wheel)" ของเราได้เลยครับ
3. ตอบคำถามอย่างเป็นธรรมชาติ สุภาพ ลงท้ายด้วย "ครับ"

คำขอจากผู้ใช้: "${userText}"`
                }
              ]
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          aiResponseText = text;
        }
      }
    } catch (e) {
      console.warn('Gemini API call failed, falling back to local engine:', e);
    } finally {
      setIsLoadingAi(false);
    }

    if (intentResult.directWidget) {
      setChatHistory(prev => [
        ...prev,
        { 
          id: systemMsgId, 
          type: 'system', 
          text: aiResponseText || intentResult.directReply || `ฉันประมวลผลคำขอของคุณเรียบร้อยแล้วครับ:`, 
          inlineWidget: intentResult.directWidget 
        }
      ]);
    } else {
      // If intent was root_general and no direct override choices matched, don't force random tool cards on general conversation
      const showChoices = intentResult.step !== INTENT_TREE.root_general || !!intentResult.stepOverrideChoices;
      setChatHistory(prev => [
        ...prev,
        { 
          id: systemMsgId, 
          type: 'system', 
          text: aiResponseText || intentResult.directReply || intentResult.step.question, 
          choices: showChoices ? (intentResult.stepOverrideChoices || intentResult.step.choices) : undefined 
        }
      ]);
    }
  };

  const handleChoiceClick = (choice: InteractiveChoice) => {
    if (choice.actionType === 'navigate' && choice.targetPath) {
      navigate(choice.targetPath);
    } else if (choice.actionType === 'next_question' && choice.nextStepId && INTENT_TREE[choice.nextStepId]) {
      const nextNode = INTENT_TREE[choice.nextStepId];
      setChatHistory(prev => [
        ...prev,
        { id: Date.now().toString(), type: 'user', text: choice.label },
        { id: (Date.now() + 1).toString(), type: 'system', text: nextNode.question, choices: nextNode.choices }
      ]);
    } else if (choice.actionType === 'inline' && choice.widgetType) {
      if (choice.widgetType === 'password' && !passResult) {
        handleGenPass(16);
      }
      setChatHistory(prev => [
        ...prev,
        { id: Date.now().toString(), type: 'user', text: choice.label },
        { 
          id: (Date.now() + 1).toString(), 
          type: 'system', 
          text: `ฉันเตรียมเครื่องมือสำหรับ ${choice.label} ไว้ให้บนหน้านี้เรียบร้อยแล้วครับ:`, 
          inlineWidget: choice.widgetType 
        }
      ]);
    }
  };

  // Handlers
  const handleB64Convert = (val: string, mode: 'encode' | 'decode', type: 'base64' | 'base32' = b64Type) => {
    setB64Input(val);
    if (!val) { setB64Output(''); return; }
    try {
      if (type === 'base64') {
        if (mode === 'encode') setB64Output(safeBase64Encode(val));
        else setB64Output(safeBase64Decode(val));
      } else {
        if (mode === 'encode') setB64Output(safeBase32Encode(val));
        else setB64Output(safeBase32Decode(val));
      }
    } catch (e) {
      setB64Output(`รูปแบบ ${type.toUpperCase()} ไม่ถูกต้อง`);
    }
  };

  const handleGenPass = (len: number) => {
    setPassLen(len);
    const pass = generatePassword(len, { lowercase: true, uppercase: true, numbers: true, symbols: true });
    setPassResult(pass);
  };

  const handleFormatJsonInline = (val: string) => {
    setJsonInput(val);
    if (!val) { setJsonOutput(''); return; }
    try {
      setJsonOutput(formatJson(val, 2));
    } catch (e: any) {
      setJsonOutput(`JSON Invalid: ${e.message}`);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col justify-between overflow-hidden p-0 z-10">
      {/* High-End Glassmorphism Background Ambient Blur */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[160px] rounded-full pointer-events-none z-[-1]" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-teal-500/10 dark:bg-teal-500/15 blur-[150px] rounded-full pointer-events-none z-[-1]" />

      {/* Main Full-Screen Glass Workspace */}
      <div className="w-full h-full flex-1 flex flex-col bg-surface/40 dark:bg-surface/30 backdrop-blur-3xl relative overflow-hidden border-l border-border/30">

        {/* Top Floating Actions Header */}
        {chatHistory.length > 0 && (
          <div className="absolute top-5 right-6 z-30">
            <button
              onClick={() => { setChatHistory([]); setPrompt(''); }}
              className="px-4 py-2 rounded-full bg-surface/90 border border-white/20 dark:border-white/10 hover:border-emerald-500/50 text-muted hover:text-text font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg backdrop-blur-xl active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>เริ่มคำใหม่</span>
            </button>
          </div>
        )}

        {/* Main Interactive Flow Canvas */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-6 custom-scrollbar">
          {chatHistory.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-12 px-4 max-w-2xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-black text-text tracking-tight mb-3">
                Convertly AI Workspace
              </h1>
              <p className="text-muted font-semibold text-sm md:text-base mb-8 max-w-md leading-relaxed">
                พิมพ์สิ่งที่ต้องการ ประมวลผลและเลือกเครื่องมือประมวลผลที่เหมาะที่สุดให้อัตโนมัติ
              </p>

              {/* Minimal Rounded Chips */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {randomChips.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleProcessInput(tag.query)}
                    className="px-4 py-2.5 bg-surface/90 hover:bg-emerald-500/15 border border-white/20 dark:border-white/10 hover:border-emerald-500/50 rounded-full text-xs font-extrabold text-text hover:text-emerald-500 transition-all flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 backdrop-blur-2xl"
                  >
                    <tag.icon className="w-4 h-4 text-emerald-500" />
                    <span>{tag.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
              {chatHistory.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 md:gap-4 ${item.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {item.type === 'system' && (
                    <div className="w-10 h-10 rounded-2xl bg-surface/90 border border-emerald-500/30 text-emerald-500 flex items-center justify-center font-bold text-xs shrink-0 shadow-lg backdrop-blur-xl">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex flex-col gap-3 max-w-[95%] md:max-w-[85%] w-full">
                    <div className={`p-5 rounded-3xl text-sm font-semibold shadow-md leading-relaxed ${
                      item.type === 'user'
                        ? 'bg-emerald-500 text-white rounded-tr-none ml-auto font-bold'
                        : 'bg-surface/90 border border-white/20 dark:border-white/10 text-text rounded-tl-none backdrop-blur-2xl shadow-xl whitespace-pre-wrap'
                    }`}>
                      {item.text.split('\n').map((line, lIdx) => {
                        // Highlighting bold **text** or inline `code`
                        const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code class="bg-emerald-500/10 text-emerald-500 font-mono px-1.5 py-0.5 rounded border border-emerald-500/20">$1</code>');
                        return (
                          <p key={lIdx} dangerouslySetInnerHTML={{ __html: formattedLine || '&nbsp;' }} className={lIdx > 0 ? 'mt-1.5' : ''} />
                        );
                      })}
                    </div>

                    {/* Glass Choice Cards */}
                    {item.choices && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                        {item.choices.map((choice, cIdx) => {
                          const isOddLast = item.choices!.length % 2 !== 0 && cIdx === item.choices!.length - 1;
                          return (
                            <button
                              key={cIdx}
                              onClick={() => handleChoiceClick(choice)}
                              className={`p-4 bg-surface/90 hover:bg-emerald-500/20 border border-white/20 dark:border-white/10 hover:border-emerald-500/60 rounded-2xl text-xs font-extrabold text-text hover:text-emerald-500 transition-all flex items-center justify-between group shadow-lg text-left backdrop-blur-2xl hover:scale-[1.02] active:scale-95 ${
                                isOddLast ? 'sm:col-span-2 sm:w-full sm:max-w-md sm:mx-auto' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                                  {choice.actionType === 'navigate' ? <ExternalLink className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                </div>
                                <span>{choice.label}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted group-hover:translate-x-1 transition-transform shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* --- INLINE WIDGET: BASE64 --- */}
                    {item.inlineWidget === 'base64' && (
                      <div className="p-6 bg-surface/95 border border-emerald-500/40 rounded-3xl flex flex-col gap-4 shadow-2xl backdrop-blur-3xl">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <Code2 className="w-4 h-4" /> Base64 / Base32 Converter Inline
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="flex bg-background border border-border rounded-full p-1 gap-1">
                              <button
                                onClick={() => { setB64Type('base64'); handleB64Convert(b64Input, b64Mode, 'base64'); }}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${b64Type === 'base64' ? 'bg-emerald-500 text-white shadow-sm' : 'text-muted'}`}
                              >
                                Base64
                              </button>
                              <button
                                onClick={() => { setB64Type('base32'); handleB64Convert(b64Input, b64Mode, 'base32'); }}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${b64Type === 'base32' ? 'bg-emerald-500 text-white shadow-sm' : 'text-muted'}`}
                              >
                                Base32
                              </button>
                            </div>
                            <div className="flex bg-background border border-border rounded-full p-1 gap-1">
                              <button
                                onClick={() => { setB64Mode('encode'); handleB64Convert(b64Input, 'encode', b64Type); }}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${b64Mode === 'encode' ? 'bg-emerald-500 text-white shadow-sm' : 'text-muted'}`}
                              >
                                Encode
                              </button>
                              <button
                                onClick={() => { setB64Mode('decode'); handleB64Convert(b64Input, 'decode', b64Type); }}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${b64Mode === 'decode' ? 'bg-emerald-500 text-white shadow-sm' : 'text-muted'}`}
                              >
                                Decode
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <textarea
                            rows={3}
                            placeholder={b64Mode === 'encode' ? 'พิมพ์หรือวางข้อความตรงนี้...' : 'วาง Base64 String ตรงนี้...'}
                            value={b64Input}
                            onChange={(e) => handleB64Convert(e.target.value, b64Mode)}
                            className="w-full bg-background/50 border border-border/80 focus:border-emerald-500/50 rounded-2xl p-4 text-text font-mono text-sm outline-none shadow-inner resize-none"
                          />
                          <div className="relative w-full">
                            <textarea
                              rows={3}
                              readOnly
                              placeholder="ผลลัพธ์จะแสดงที่นี่..."
                              value={b64Output}
                              className="w-full h-full bg-surface border border-border/80 rounded-2xl p-4 text-emerald-500 font-mono text-sm outline-none shadow-sm resize-none pr-12"
                            />
                            {b64Output && b64Output !== 'รูปแบบ Base64 ไม่ถูกต้อง' && (
                              <button
                                onClick={() => handleCopy(b64Output, `b64-${item.id}`)}
                                className="absolute top-3 right-3 px-3 py-1.5 bg-surface/90 border border-border/80 rounded-xl text-xs font-bold text-text hover:bg-emerald-500/10 hover:text-emerald-500 transition-all shadow-md backdrop-blur-md flex items-center gap-1.5"
                              >
                                {copiedKey === `b64-${item.id}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-emerald-500 font-extrabold">คัดลอกแล้ว</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>คัดลอก</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => navigate('/encoders-decoders/text-base64')}
                            className="text-xs text-muted hover:text-emerald-500 font-extrabold flex items-center gap-1.5 hover:underline"
                          >
                            เปิดในหน้าเครื่องมือเต็ม <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* --- INLINE WIDGET: PASSWORD GENERATOR --- */}
                    {item.inlineWidget === 'password' && (
                      <div className="p-6 bg-surface/95 border border-emerald-500/40 rounded-3xl flex flex-col gap-4 shadow-2xl backdrop-blur-3xl">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <KeyRound className="w-4 h-4" /> Password Generator Inline
                          </span>
                          <span className="text-xs font-extrabold text-muted">ความยาว: {passLen} หลัก</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                          <input
                            type="range"
                            min={8}
                            max={32}
                            value={passLen}
                            onChange={(e) => handleGenPass(Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                          <button
                            onClick={() => handleGenPass(passLen)}
                            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-full text-xs flex items-center justify-center gap-2 shrink-0 shadow-lg active:scale-95"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> สุ่มรหัสใหม่
                          </button>
                        </div>

                        <div className="p-4 bg-background/50 border border-border/80 rounded-2xl flex items-center justify-between">
                          <span className="font-mono font-extrabold text-emerald-500 text-base md:text-lg tracking-wider break-all">
                            {passResult || 'กดปุ่มด้านบนเพื่อสุ่มรหัสผ่าน'}
                          </span>
                          {passResult && (
                            <button
                              onClick={() => handleCopy(passResult, `pass-${item.id}`)}
                              className="px-3.5 py-1.5 bg-surface border border-border rounded-xl text-xs font-bold text-text hover:bg-emerald-500/10 hover:text-emerald-500 transition-all shrink-0 ml-2 flex items-center gap-1.5"
                            >
                              {copiedKey === `pass-${item.id}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span className="text-emerald-500 font-extrabold">คัดลอกแล้ว</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>คัดลอก</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => navigate('/encoders-decoders/password-generator')}
                            className="text-xs text-muted hover:text-emerald-500 font-extrabold flex items-center gap-1.5 hover:underline"
                          >
                            เปิดในหน้าเครื่องมือเต็ม <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* --- INLINE WIDGET: PERCENTAGE CALCULATOR --- */}
                    {item.inlineWidget === 'percentage' && (
                      <div className="p-6 bg-surface/95 border border-emerald-500/40 rounded-3xl flex flex-col gap-4 shadow-2xl backdrop-blur-3xl">
                        <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                          <Percent className="w-4 h-4" /> Percentage Calculator Inline
                        </span>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <span className="text-xs font-extrabold text-muted">หาค่า</span>
                          <input
                            type="number"
                            value={pctP}
                            onChange={(e) => setPctP(e.target.value)}
                            className="w-24 bg-background/50 border border-border/80 rounded-xl px-3 py-2 text-text font-bold text-sm outline-none shadow-inner"
                          />
                          <span className="text-xs font-extrabold text-muted">% ของ</span>
                          <input
                            type="number"
                            value={pctTotal}
                            onChange={(e) => setPctTotal(e.target.value)}
                            className="w-32 bg-background/50 border border-border/80 rounded-xl px-3 py-2 text-text font-bold text-sm outline-none shadow-inner"
                          />
                          <span className="text-xs font-extrabold text-muted">=</span>
                          <div className="flex items-center gap-2 ml-auto">
                            <span className="text-xl font-black text-emerald-500 font-mono">
                              {calcPercentValueOf(parseFloat(pctP), parseFloat(pctTotal))?.toLocaleString('th-TH') ?? '-'}
                            </span>
                            {calcPercentValueOf(parseFloat(pctP), parseFloat(pctTotal)) !== null && (
                              <button
                                onClick={() => {
                                  const val = calcPercentValueOf(parseFloat(pctP), parseFloat(pctTotal));
                                  if (val !== null) handleCopy(val.toString(), `pct-${item.id}`);
                                }}
                                className="px-3 py-1 bg-surface border border-border rounded-xl text-xs font-bold text-text hover:bg-emerald-500/10 hover:text-emerald-500 transition-all flex items-center gap-1.5 shadow-sm"
                              >
                                {copiedKey === `pct-${item.id}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-emerald-500 font-extrabold">คัดลอกแล้ว</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>คัดลอก</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => navigate('/calculators/percentage')}
                            className="text-xs text-muted hover:text-emerald-500 font-extrabold flex items-center gap-1.5 hover:underline"
                          >
                            เปิดในหน้าเครื่องมือเต็ม <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* --- INLINE WIDGET: JSON FORMATTER --- */}
                    {item.inlineWidget === 'json' && (
                      <div className="p-6 bg-surface/95 border border-emerald-500/40 rounded-3xl flex flex-col gap-4 shadow-2xl backdrop-blur-3xl">
                        <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                          <FileJson className="w-4 h-4" /> JSON Formatter Inline
                        </span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <textarea
                            rows={4}
                            placeholder="วาง JSON String ที่นี่..."
                            value={jsonInput}
                            onChange={(e) => handleFormatJsonInline(e.target.value)}
                            className="w-full bg-background/50 border border-border/80 rounded-2xl p-4 text-text font-mono text-sm outline-none shadow-inner resize-none"
                          />
                          <div className="relative w-full">
                            <textarea
                              rows={4}
                              readOnly
                              placeholder="ผลลัพธ์จัดรูปแบบ JSON จะแสดงที่นี่..."
                              value={jsonOutput}
                              className="w-full h-full bg-surface border border-border/80 rounded-2xl p-4 text-emerald-500 font-mono text-sm outline-none shadow-sm resize-none pr-12"
                            />
                            {jsonOutput && !jsonOutput.startsWith('JSON Invalid:') && (
                              <button
                                onClick={() => handleCopy(jsonOutput, `json-${item.id}`)}
                                className="absolute top-3 right-3 px-3 py-1.5 bg-surface/90 border border-border/80 rounded-xl text-xs font-bold text-text hover:bg-emerald-500/10 hover:text-emerald-500 transition-all shadow-md backdrop-blur-md flex items-center gap-1.5"
                              >
                                {copiedKey === `json-${item.id}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-emerald-500 font-extrabold">คัดลอกแล้ว</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>คัดลอก</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => navigate('/developer-tools/json-formatter')}
                            className="text-xs text-muted hover:text-emerald-500 font-extrabold flex items-center gap-1.5 hover:underline"
                          >
                            เปิดในหน้าเครื่องมือเต็ม <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* --- INLINE WIDGET: API TESTER --- */}
                    {item.inlineWidget === 'api_tester' && (
                      <div className="p-6 bg-surface/95 border border-emerald-500/40 rounded-3xl flex flex-col gap-4 shadow-2xl backdrop-blur-3xl">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <Globe className="w-4 h-4" /> REST API Client & Request Tester Inline
                          </span>
                        </div>

                        <div className="flex flex-col gap-3">
                          <div className="flex gap-2">
                            <select
                              value={homeTestMethod}
                              onChange={(e) => setHomeTestMethod(e.target.value)}
                              className="bg-background border border-border rounded-xl px-3 py-2 text-xs font-black text-emerald-500 outline-none shadow-inner"
                            >
                              {['GET', 'POST', 'PUT', 'DELETE'].map(m => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={homeTestUrl}
                              onChange={(e) => setHomeTestUrl(e.target.value)}
                              placeholder="https://api.example.com/data"
                              className="flex-1 bg-background/50 border border-border/80 focus:border-emerald-500 rounded-xl px-4 py-2 text-xs font-mono text-text outline-none shadow-inner"
                            />
                          </div>

                          {['POST', 'PUT'].includes(homeTestMethod) && (
                            <textarea
                              rows={2}
                              value={homeTestBody}
                              onChange={(e) => setHomeTestBody(e.target.value)}
                              placeholder='JSON Body (เช่น {"key": "value"})'
                              className="w-full bg-background/50 border border-border/80 focus:border-emerald-500 rounded-xl p-3 text-xs font-mono text-text outline-none resize-none shadow-inner"
                            />
                          )}

                          <button
                            onClick={() => runHomeApiTestAndAnalyze()}
                            disabled={homeIsTesting || !homeTestUrl.trim()}
                            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md disabled:opacity-40 transition-all active:scale-98 cursor-pointer"
                          >
                            {homeIsTesting ? (
                              <>กำลังยิง Request...</>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-current" /> ยิง Request & ให้ AI วิเคราะห์ผล
                              </>
                            )}
                          </button>
                        </div>

                        {/* AI Analysis Block */}
                        {homeApiAnalysis && (
                          <div className="p-4 bg-background/80 border border-emerald-500/30 rounded-2xl flex flex-col gap-3 shadow-inner">
                            <div className="text-xs leading-relaxed text-text font-medium whitespace-pre-wrap">
                              {homeApiAnalysis.split('\n').map((line, lIdx) => {
                                const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-emerald-500">$1</strong>').replace(/`([^`]+)`/g, '<code class="bg-surface border border-emerald-500/20 px-1 py-0.5 rounded font-mono text-emerald-500">$1</code>');
                                return (
                                  <p key={lIdx} dangerouslySetInnerHTML={{ __html: formattedLine || '&nbsp;' }} className={lIdx > 0 ? 'mt-1' : ''} />
                                );
                              })}
                            </div>

                            {/* Response Payload Code Box */}
                            {homeApiResult && (
                              <div className="bg-surface border border-border rounded-xl p-3 text-[11px] font-mono flex flex-col gap-2 shadow-sm">
                                <div className="flex items-center justify-between text-emerald-500 font-bold border-b border-border/50 pb-1.5">
                                  <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Status: {homeApiResult.status}</span>
                                  <span className="flex items-center gap-1 text-muted"><Clock className="w-3.5 h-3.5" /> {homeApiResult.duration}ms ({homeApiResult.size})</span>
                                </div>
                                <pre className="text-text max-h-40 overflow-y-auto custom-scrollbar p-2 bg-background/50 rounded-lg text-[10px] whitespace-pre-wrap break-all">
                                  {homeApiResult.data}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex justify-end">
                          <button
                            onClick={() => navigate('/developer-tools/api-tester')}
                            className="text-xs text-muted hover:text-emerald-500 font-extrabold flex items-center gap-1.5 hover:underline"
                          >
                            เปิดในหน้าเครื่องมือเต็ม <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* --- INLINE WIDGET: RADIX CONVERTER --- */}
                    {item.inlineWidget === 'radix' && (
                      <div className="p-6 bg-surface/95 border border-emerald-500/40 rounded-3xl flex flex-col gap-4 shadow-2xl backdrop-blur-3xl">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <Terminal className="w-4 h-4" /> Radix / Base Number Converter Inline
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-muted">แปลงจากฐาน:</span>
                            <select
                              value={radixBase}
                              onChange={(e) => handleRadixConvert(radixVal, Number(e.target.value))}
                              className="bg-background border border-border rounded-xl px-2.5 py-1 text-xs font-bold text-text outline-none"
                            >
                              <option value={10}>ฐาน 10 (Decimal)</option>
                              <option value={2}>ฐาน 2 (Binary)</option>
                              <option value={16}>ฐาน 16 (Hexadecimal)</option>
                              <option value={8}>ฐาน 8 (Octal)</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <input
                            type="text"
                            value={radixVal}
                            onChange={(e) => handleRadixConvert(e.target.value, radixBase)}
                            placeholder="ป้อนตัวเลขที่ต้องการแปลง..."
                            className="w-full bg-background/50 border border-border/80 rounded-2xl px-4 py-3 text-text font-mono font-bold text-base outline-none shadow-inner"
                          />

                          {/* Render All Converted Bases */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                            {/* Binary (Base 2) */}
                            <div className="p-3 bg-surface border border-border/80 rounded-2xl flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">ฐาน 2 (Binary)</span>
                                <span className="font-mono font-extrabold text-emerald-500 text-sm break-all">{radixResults.bin || '-'}</span>
                              </div>
                              {radixResults.bin && radixResults.bin !== 'Invalid' && (
                                <button
                                  onClick={() => handleCopy(radixResults.bin, `bin-${item.id}`)}
                                  className="px-2.5 py-1 bg-background border border-border rounded-xl text-[11px] font-bold text-text hover:text-emerald-500 transition-all shrink-0 ml-2"
                                >
                                  {copiedKey === `bin-${item.id}` ? 'คัดลอกแล้ว' : 'คัดลอก'}
                                </button>
                              )}
                            </div>

                            {/* Decimal (Base 10) */}
                            <div className="p-3 bg-surface border border-border/80 rounded-2xl flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">ฐาน 10 (Decimal)</span>
                                <span className="font-mono font-extrabold text-emerald-500 text-sm break-all">{radixResults.dec || '-'}</span>
                              </div>
                              {radixResults.dec && radixResults.dec !== 'Invalid' && (
                                <button
                                  onClick={() => handleCopy(radixResults.dec, `dec-${item.id}`)}
                                  className="px-2.5 py-1 bg-background border border-border rounded-xl text-[11px] font-bold text-text hover:text-emerald-500 transition-all shrink-0 ml-2"
                                >
                                  {copiedKey === `dec-${item.id}` ? 'คัดลอกแล้ว' : 'คัดลอก'}
                                </button>
                              )}
                            </div>

                            {/* Hexadecimal (Base 16) */}
                            <div className="p-3 bg-surface border border-border/80 rounded-2xl flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">ฐาน 16 (Hexadecimal)</span>
                                <span className="font-mono font-extrabold text-emerald-500 text-sm break-all">{radixResults.hex || '-'}</span>
                              </div>
                              {radixResults.hex && radixResults.hex !== 'Invalid' && (
                                <button
                                  onClick={() => handleCopy(radixResults.hex, `hex-${item.id}`)}
                                  className="px-2.5 py-1 bg-background border border-border rounded-xl text-[11px] font-bold text-text hover:text-emerald-500 transition-all shrink-0 ml-2"
                                >
                                  {copiedKey === `hex-${item.id}` ? 'คัดลอกแล้ว' : 'คัดลอก'}
                                </button>
                              )}
                            </div>

                            {/* Octal (Base 8) */}
                            <div className="p-3 bg-surface border border-border/80 rounded-2xl flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">ฐาน 8 (Octal)</span>
                                <span className="font-mono font-extrabold text-emerald-500 text-sm break-all">{radixResults.oct || '-'}</span>
                              </div>
                              {radixResults.oct && radixResults.oct !== 'Invalid' && (
                                <button
                                  onClick={() => handleCopy(radixResults.oct, `oct-${item.id}`)}
                                  className="px-2.5 py-1 bg-background border border-border rounded-xl text-[11px] font-bold text-text hover:text-emerald-500 transition-all shrink-0 ml-2"
                                >
                                  {copiedKey === `oct-${item.id}` ? 'คัดลอกแล้ว' : 'คัดลอก'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => navigate('/number-tools/decimal-binary')}
                            className="text-xs text-muted hover:text-emerald-500 font-extrabold flex items-center gap-1.5 hover:underline"
                          >
                            เปิดในหน้าเครื่องมือเต็ม <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* --- INLINE WIDGET: TEMPERATURE CONVERTER --- */}
                    {item.inlineWidget === 'temperature' && (
                      <div className="p-6 bg-surface/95 border border-emerald-500/40 rounded-3xl flex flex-col gap-4 shadow-2xl backdrop-blur-3xl">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <Terminal className="w-4 h-4" /> Temperature Converter Inline
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-muted">หน่วยต้นทาง:</span>
                            <select
                              value={tempUnit}
                              onChange={(e) => handleTempConvert(tempVal, e.target.value as 'C' | 'F' | 'K')}
                              className="bg-background border border-border rounded-xl px-2.5 py-1 text-xs font-bold text-text outline-none"
                            >
                              <option value="C">Celsius (°C)</option>
                              <option value="F">Fahrenheit (°F)</option>
                              <option value="K">Kelvin (K)</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <input
                            type="number"
                            value={tempVal}
                            onChange={(e) => handleTempConvert(e.target.value, tempUnit)}
                            placeholder="ป้อนค่าอุณหภูมิ..."
                            className="w-full bg-background/50 border border-border/80 rounded-2xl px-4 py-3 text-text font-mono font-bold text-base outline-none shadow-inner"
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                            {/* Celsius */}
                            <div className="p-3 bg-surface border border-border/80 rounded-2xl flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Celsius (°C)</span>
                                <span className="font-mono font-extrabold text-emerald-500 text-sm break-all">{tempResults.c} °C</span>
                              </div>
                              {tempResults.c !== '-' && (
                                <button
                                  onClick={() => handleCopy(`${tempResults.c} °C`, `tc-${item.id}`)}
                                  className="px-2.5 py-1 bg-background border border-border rounded-xl text-[11px] font-bold text-text hover:text-emerald-500 transition-all shrink-0 ml-2"
                                >
                                  {copiedKey === `tc-${item.id}` ? 'คัดลอกแล้ว' : 'คัดลอก'}
                                </button>
                              )}
                            </div>

                            {/* Fahrenheit */}
                            <div className="p-3 bg-surface border border-border/80 rounded-2xl flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Fahrenheit (°F)</span>
                                <span className="font-mono font-extrabold text-emerald-500 text-sm break-all">{tempResults.f} °F</span>
                              </div>
                              {tempResults.f !== '-' && (
                                <button
                                  onClick={() => handleCopy(`${tempResults.f} °F`, `tf-${item.id}`)}
                                  className="px-2.5 py-1 bg-background border border-border rounded-xl text-[11px] font-bold text-text hover:text-emerald-500 transition-all shrink-0 ml-2"
                                >
                                  {copiedKey === `tf-${item.id}` ? 'คัดลอกแล้ว' : 'คัดลอก'}
                                </button>
                              )}
                            </div>

                            {/* Kelvin */}
                            <div className="p-3 bg-surface border border-border/80 rounded-2xl flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider">Kelvin (K)</span>
                                <span className="font-mono font-extrabold text-emerald-500 text-sm break-all">{tempResults.k} K</span>
                              </div>
                              {tempResults.k !== '-' && (
                                <button
                                  onClick={() => handleCopy(`${tempResults.k} K`, `tk-${item.id}`)}
                                  className="px-2.5 py-1 bg-background border border-border rounded-xl text-[11px] font-bold text-text hover:text-emerald-500 transition-all shrink-0 ml-2"
                                >
                                  {copiedKey === `tk-${item.id}` ? 'คัดลอกแล้ว' : 'คัดลอก'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => navigate('/unit-converters/temperature')}
                            className="text-xs text-muted hover:text-emerald-500 font-extrabold flex items-center gap-1.5 hover:underline"
                          >
                            เปิดในหน้าเครื่องมือเต็ม <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {item.type === 'user' && (
                    <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-lg">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoadingAi && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 md:gap-4 justify-start items-center"
                >
                  <div className="w-10 h-10 rounded-2xl bg-surface/90 border border-emerald-500/30 text-emerald-500 flex items-center justify-center font-bold text-xs shrink-0 shadow-lg backdrop-blur-xl animate-pulse">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="px-5 py-3.5 rounded-3xl bg-surface/90 border border-white/20 dark:border-white/10 text-emerald-500 text-xs font-extrabold flex items-center gap-2.5 shadow-xl backdrop-blur-2xl">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Convertly AI กำลังคิดและวิเคราะห์คำตอบ...</span>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Floating Glass Input Bar */}
        <div className="p-4 md:p-6 border-t border-border/30 bg-surface/70 dark:bg-background/50 backdrop-blur-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleProcessInput(prompt);
            }}
            className="glass-panel p-2.5 border border-white/20 dark:border-white/10 rounded-full shadow-2xl transition-all bg-surface/90 dark:bg-background/90 flex items-center gap-3 max-w-4xl mx-auto backdrop-blur-2xl"
          >
            <input
              type="text"
              placeholder="พิมพ์คำสั่งเพื่อวิเคราะห์..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
              className="w-full !bg-transparent !border-none !outline-none !ring-0 !shadow-none text-text font-bold text-sm md:text-base px-5 py-2 placeholder:text-muted/40"
            />

            <button
              type="submit"
              disabled={!prompt.trim() || isLoadingAi}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-extrabold rounded-full text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25 shrink-0 active:scale-95"
            >
              {isLoadingAi ? (
                <>
                  <span>กำลังวิเคราะห์...</span>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  <span>วิเคราะห์</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* AI Output Disclaimer */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5 text-center text-[11px] font-semibold text-muted/60">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 opacity-70" />
            <span>คำตอบและผลลัพธ์ถูกประมวลผลโดยระบบวิเคราะห์อัตโนมัติ ผลลัพธ์อาจไม่ถูกต้อง 100% ควรตรวจสอบก่อนนำไปใช้งานจริง</span>
          </div>
        </div>

      </div>
    </div>
  );
}
