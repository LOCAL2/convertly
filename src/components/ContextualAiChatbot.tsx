import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, User, Globe, Play, Clock, Zap } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const TOOL_KNOWLEDGE_BASE: Record<string, { title: string; description: string; faqs: Array<{ q: string; a: string }> }> = {
  '/': {
    title: 'Convertly Center (หน้าหลัก)',
    description: 'ศูนย์รวมเครื่องมือแปลงไฟล์, คำนวณ, แปลงหน่วย และ Developer Tools ครบวงจร',
    faqs: [
      { q: 'Convertly มีเครื่องมืออะไรบ้าง?', a: 'เรามีเครื่องมือแปลงหน่วย, คำนวณการเงิน, เครื่องมือพัฒนาเว็บ (Developer Tools) และตัวแปลงรูปภาพ/ข้อความครับ' },
      { q: 'ทดสอบ API อย่างไร?', a: 'คุณสามารถพิมพ์ "ทดสอบ api" หรือวาง URL Endpoint ในช่องแชทนี้เพื่อทดสอบยิง Request ได้ทันทีครับ' }
    ]
  },
  '/number-tools/decimal-binary': {
    title: 'แปลงฐานเลข (Decimal ↔ Binary)',
    description: 'เครื่องมือแปลงเลขฐานสิบ (Decimal) เป็นเลขฐานสอง (Binary), ฐานแปด (Octal) และฐานสิบหก (Hexadecimal) แบบ Real-time',
    faqs: [
      { 
        q: 'แปลงเลขฐาน 10 เป็น ฐาน 2 อย่างไร?', 
        a: 'วิธีการคำนวณแปลงเลขฐาน 10 เป็น ฐาน 2 ทำได้โดย **หารเลขฐานสิบด้วย 2 ไปเรื่อยๆ แล้วจดเศษที่ได้ไว้** ดังนี้:\n\n1. นำตัวเลขตั้ง แล้วหารด้วย 2\n2. บันทึกผลหารและ **เศษที่ได้** (เป็น 0 หรือ 1)\n3. นำผลหารไปหารด้วย 2 ต่อไปเรื่อยๆ จนกว่าผลหารจะเป็น 0\n4. อ่านเศษย้อนกลับจาก **ล่างขึ้นบน** (จากเศษสุดท้ายไปเศษแรก)\n\n**ตัวอย่าง (แปลง 13 เป็นฐาน 2)**:\n• 13 ÷ 2 = 6 เศษ **1**\n• 6 ÷ 2 = 3 เศษ **0**\n• 3 ÷ 2 = 1 เศษ **1**\n• 1 ÷ 2 = 0 เศษ **1**\nนำเศษอ่านย้อนกลับ จะได้ **1101₂** ครับ!' 
      },
      { q: 'รองรับฐาน 16 (Hex) และ ฐาน 8 (Octal) ไหม?', a: 'รองรับครับ! ระบบจะแปลงและแสดงผลลัพธ์ทั้ง Binary (ฐาน 2), Octal (ฐาน 8), Decimal (ฐาน 10) และ Hexadecimal (ฐาน 16) พร้อมกันให้อย่างครบถ้วน' },
      { q: 'ทำอะไรได้บ้าง?', a: 'เครื่องมือนี้ใช้แปลงเลขระหว่างฐานสิบ, ฐานสอง, ฐานแปด และฐานสิบหก ได้ทันทีแบบ Real-time พร้อมปุ่ม Copy ผลลัพธ์อย่างสะดวกครับ' }
    ]
  },
  '/unit-converters/length': {
    title: 'แปลงหน่วยความยาว (Length Converter)',
    description: 'เครื่องมือแปลงหน่วยความยาวสากล เช่น เมตร, กิโลเมตร, เซนติเมตร, นิ้ว, ฟุต, หลา และไมล์',
    faqs: [
      { q: '1 นิ้ว เท่ากับกี่เซนติเมตร?', a: '1 นิ้ว (inch) เท่ากับ 2.54 เซนติเมตร (cm) พอดีครับ' },
      { q: '1 ไมล์ เท่ากับกี่กิโลเมตร?', a: '1 ไมล์ (mile) เท่ากับประมาณ 1.60934 กิโลเมตร (km) ครับ' }
    ]
  },
  '/unit-converters/weight': {
    title: 'แปลงหน่วยน้ำหนัก (Weight Converter)',
    description: 'เครื่องมือแปลงหน่วยน้ำหนัก เช่น กิโลกรัม, กรัม, ปอนด์, ออนซ์ และตัน',
    faqs: [
      { q: '1 ปอนด์ เท่ากับกี่กิโลกรัม?', a: '1 ปอนด์ (lb) เท่ากับประมาณ 0.453592 กิโลกรัม (kg) ครับ' }
    ]
  },
  '/unit-converters/temperature': {
    title: 'แปลงหน่วยอุณหภูมิ (Temperature Converter)',
    description: 'เครื่องมือแปลงอุณหภูมิระหว่าง เซลเซียส (°C), ฟาเรนไฮต์ (°F) และเคลวิน (K)',
    faqs: [
      { q: 'แปลงเซลเซียสเป็นฟาเรนไฮต์คำนวณอย่างไร?', a: 'สูตรคือ (°C × 9/5) + 32 = °F ครับ' }
    ]
  },
  '/developer-tools/api-tester': {
    title: 'REST API Client Tester',
    description: 'เครื่องมือทดสอบยิง HTTP Request (GET, POST, PUT, DELETE) พร้อมตรวจสอบ Response Status, Header และ Response Time',
    faqs: [
      { q: 'ทำไมยิงบาง API แล้วขึ้น Error?', a: 'อาจเกิดจากปัญหา CORS policy ของเซิร์ฟเวอร์ปลายทาง หรือยังไม่ได้ใส่ Authorization Header ครับ' }
    ]
  },
  '/finance-tools/salary-calculator': {
    title: 'Salary to Hourly Calculator',
    description: 'คำนวณเงินเดือนรายเดือน/รายปี ทอนเป็นค่าจ้างรายชั่วโมง รายวัน และรายสัปดาห์',
    faqs: [
      { q: 'คำนวณจากชั่วโมงทำงานกี่ชั่วโมง?', a: 'ค่าเริ่มต้นคิดจากทำงาน 40 ชั่วโมงต่อสัปดาห์ (วันละ 8 ชั่วโมง 5 วัน) คุณสามารถปรับแก้จำนวนชั่วโมงได้ครับ' }
    ]
  },
  '/calculators/random-wheel': {
    title: 'วงล้อสุ่มเลือก (Random Decision Wheel)',
    description: 'วงล้อสุ่มคำตอบ สุ่มรายชื่อ อาหาร หรือตัวเลือกตัดสินใจ พร้อมเอฟเฟกต์หมุนอินเทอร์แอคทีฟ',
    faqs: [
      { q: 'เมื่อสุ่มได้แล้วสามารถนำตัวเลือกนั้นออกได้ไหม?', a: 'ได้ครับ! เมื่อสุ่มได้แล้วจะมีปุ่มป๊อปอัปให้เลือก "ลบตัวเลือกนี้ออก" หรือ "เก็บไว้สุ่มต่อ" ครับ' }
    ]
  }
};

function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-extrabold text-emerald-500 dark:text-emerald-400">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="bg-background/80 px-1.5 py-0.5 rounded text-[11px] font-mono text-emerald-500 border border-emerald-500/20">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export default function ContextualAiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; apiResult?: any; isInteractiveApiForm?: boolean }>>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Quick Embedded API Tester State inside Chat
  const [showApiTester, setShowApiTester] = useState(false);
  const [testUrl, setTestUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [testMethod, setTestMethod] = useState('GET');
  const [testBody, setTestBody] = useState('');
  const [isTestingApi, setIsTestingApi] = useState(false);

  const location = useLocation();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentToolInfo = TOOL_KNOWLEDGE_BASE[location.pathname] || {
    title: `เครื่องมือในหน้านี้ (${location.pathname.split('/').pop() || 'Tool'})`,
    description: 'เครื่องมืออำนวยความสะดวกสำหรับนักพัฒนาและผู้ใช้งานทั่วไป',
    faqs: []
  };

  useEffect(() => {
    const isApiPage = location.pathname.includes('api') || location.pathname.includes('developer-tools');
    const greetingMsg = isApiPage
      ? `สวัสดีครับ ผมคือ AI Assistant ประจำหน้า **${currentToolInfo.title}**\nมีข้อสงสัยเกี่ยวกับวิธีใช้งาน หรือต้องการยิง **ทดสอบ API** แบบ Real-time สอบถามผมได้เลยครับ`
      : `สวัสดีครับ ผมคือ AI Assistant ประจำหน้า **${currentToolInfo.title}**\nมีข้อสงสัยเกี่ยวกับวิธีใช้งาน หรือต้องการสอบถามเรื่องการแปลงค่าและคำนวณ สอบถามผมได้เลยครับ`;

    setMessages([
      {
        sender: 'ai',
        text: greetingMsg
      }
    ]);
  }, [location.pathname]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, showApiTester]);

  const analyzePayloadData = (rawData: any): string => {
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

  const runApiTestAndAnalyze = async () => {
    if (!testUrl.trim()) return;
    setIsTestingApi(true);
    const userQueryText = `[ทดสอบ API] ${testMethod} ${testUrl}`;
    
    // Add user action to chat
    setMessages(prev => [...prev, { sender: 'user', text: userQueryText }]);
    setIsTyping(true);

    const startTime = performance.now();
    try {
      const options: RequestInit = { method: testMethod };
      if (['POST', 'PUT', 'PATCH'].includes(testMethod) && testBody.trim()) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = testBody;
      }

      const res = await fetch(testUrl, options);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      const rawText = await res.text();
      let parsedJson: any = null;
      try { parsedJson = JSON.parse(rawText); } catch {}

      const isSuccess = res.ok;
      const statusStr = `${res.status} ${res.statusText || (isSuccess ? 'OK' : 'Error')}`;
      const payloadSize = (new Blob([rawText]).size / 1024).toFixed(2);
      const speedRating = duration < 300 ? 'รวดเร็วมาก' : duration < 1000 ? 'ปานกลาง' : 'ตอบสนองช้า';

      // AI Analysis Synthesis (Clean Professional Format without Emojis)
      let aiAnalysis = `**วิเคราะห์ผลการทดสอบ API (HTTP ${testMethod})**\n\n`;
      aiAnalysis += `• **สถานะการตอบรับ**: \`${statusStr}\` (${isSuccess ? 'สำเร็จ' : 'ผิดพลาด'})\n`;
      aiAnalysis += `• **ระยะเวลาประมวลผล**: \`${duration} ms\` (${speedRating})\n`;
      aiAnalysis += `• **ขนาด Response**: \`${payloadSize} KB\`\n\n`;
      
      aiAnalysis += `**วิเคราะห์โครงสร้างและเนื้อหาข้อมูล (Data Analysis)**:\n`;
      aiAnalysis += `• ${analyzePayloadData(parsedJson || rawText)}\n\n`;

      aiAnalysis += `**ข้อสรุปและคำแนะนำเชิงลึก**:\n`;
      if (isSuccess) {
        aiAnalysis += `- Endpoint ตอบสนองสมบูรณ์ ข้อมูลอยู่ในรูปแบบ ${parsedJson ? 'JSON Valid Structure' : 'Text Content'}\n`;
        aiAnalysis += `- HTTP Status ${res.status} ยืนยันว่า request ได้รับการประมวลผลเรียบร้อยอย่างถูกต้อง`;
      } else {
        aiAnalysis += `- เกิดข้อผิดพลาด ${res.status}: กรุณาตรวจสอบ URL, Authentication Headers หรือโครงสร้าง Request Body\n`;
        aiAnalysis += `- หากขึ้น CORS Error ควรตรวจสอบการตั้งค่า Access-Control-Allow-Origin ที่เซิร์ฟเวอร์ปลายทาง`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiAnalysis,
          apiResult: {
            status: statusStr,
            duration,
            size: payloadSize,
            data: parsedJson ? JSON.stringify(parsedJson, null, 2) : rawText.slice(0, 300)
          }
        }
      ]);
    } catch (err: any) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      const errorAnalysis = `**เกิดข้อผิดพลาดในการเชื่อมต่อ (Connection Error)**\n\n` +
        `• **ข้อความแจ้งเตือน**: \`${err.message || 'CORS Blocked หรือ Network Disconnected'}\`\n` +
        `• **ระยะเวลา**: \`${duration} ms\`\n\n` +
        `**วิเคราะห์และวิธีแก้ไข**:\n` +
        `1. เซิร์ฟเวอร์ปลายทางอาจบล็อกคำขอข้ามโดเมน (CORS Policy)\n` +
        `2. โดเมน URL ที่ระบุอาจไม่ถูกต้อง หรือเซิร์ฟเวอร์ออฟไลน์อยู่`;

      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: errorAnalysis }
      ]);
    } finally {
      setIsTestingApi(false);
      setIsTyping(false);
      setShowApiTester(false);
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    const userMessage = { sender: 'user' as const, text: query };
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputMsg('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = `สำหรับเครื่องมือ **${currentToolInfo.title}** นี้:\n${currentToolInfo.description}\n\nคุณสามารถกรอกข้อมูลในช่อง Input แล้วระบบจะคำนวณและประมวลผลให้แบบ Real-time บนเครื่องของคุณทันทีครับ!`;

      const urlMatch = query.match(/(https?:\/\/[^\s]+)/gi);
      if (urlMatch && urlMatch[0]) {
        setTestUrl(urlMatch[0]);
      }

      const lowerQ = query.toLowerCase();
      const matchedFaq = currentToolInfo.faqs.find(f => lowerQ.includes(f.q.toLowerCase().slice(0, 5)));
      
      if (matchedFaq) {
        replyText = matchedFaq.a;
      } else if (lowerQ.includes('ทำอะไรได้บ้าง') || lowerQ.includes('คืออะไร') || lowerQ.includes('ใช้ยังไง') || lowerQ.includes('วิธีใช้') || lowerQ.includes('ทำอะไรได้')) {
        let faqListStr = '';
        if (currentToolInfo.faqs.length > 0) {
          faqListStr = '\n\n**คำถามที่พบบ่อย & ฟีเจอร์เด่น**:\n' + currentToolInfo.faqs.map(f => `• **${f.q}**: ${f.a}`).join('\n');
        }
        replyText = `เครื่องมือ **${currentToolInfo.title}**\n\n📌 **รายละเอียด**: ${currentToolInfo.description}${faqListStr}\n\n💡 คุณสามารถกรอกข้อมูลในช่องป้อนข้อมูลหน้าเว็บเพื่อรับผลลัพธ์แบบ Real-time ได้ทันทีครับ`;
      } else if (lowerQ.includes('api') || query.includes('ทดสอบ') || urlMatch) {
        replyText = `ผมได้เตรียมกล่องเครื่องมือทดสอบยิง **API Endpoint** สำหรับยิง Request และวิเคราะห์ผลไว้ในแชทนี้แล้วครับ สามารถปรับ Method/URL แล้วกด **"ยิง Request & ให้ AI วิเคราะห์ผล"** ได้เลยครับ`;
      }

      const isApiQuery = query.toLowerCase().includes('api') || query.includes('ทดสอบ') || Boolean(urlMatch);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: replyText,
          isInteractiveApiForm: isApiQuery
        }
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-6 z-50 p-3.5 bg-surface/90 hover:bg-surface border border-emerald-500/40 text-emerald-500 rounded-full shadow-2xl hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all active:scale-90 flex items-center gap-2 group cursor-pointer backdrop-blur-xl"
        title={`คุยกับ AI ประจำหน้า ${currentToolInfo.title}`}
      >
        <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-black pr-1 hidden sm:inline text-text">ถาม AI ประจำหน้านี้</span>
      </button>

      {/* Chat Window Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="!fixed bottom-36 right-4 sm:right-6 z-[999] w-[calc(100vw-2rem)] sm:w-[420px] max-h-[75vh] sm:max-h-[520px] h-[520px] bg-surface/95 backdrop-blur-2xl rounded-2xl flex flex-col shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 bg-surface/90 border-b border-border flex items-center justify-between backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0 truncate">
                  <span className="text-xs font-bold text-text truncate">{currentToolInfo.title}</span>
                  <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> AI Assistant
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-muted hover:text-text rounded-lg hover:bg-surface transition-colors"
                title="ปิดหน้าต่างแชท"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-3.5 overflow-y-auto flex flex-col gap-3 custom-scrollbar bg-background/50">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20 mt-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2 max-w-[85%]">
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed font-medium shadow-sm whitespace-pre-wrap ${
                        m.sender === 'user'
                          ? 'bg-emerald-500 text-white font-bold rounded-tr-none'
                          : 'bg-surface border border-border text-text rounded-tl-none'
                      }`}
                    >
                      {renderFormattedText(m.text)}
                    </div>

                    {/* Interactive API Tester Card embedded directly inside chat message */}
                    {m.isInteractiveApiForm && (
                      <div className="bg-surface/95 border border-emerald-500/40 rounded-xl p-3 flex flex-col gap-2.5 shadow-lg backdrop-blur-xl">
                        <div className="flex items-center justify-between text-xs font-black text-emerald-500">
                          <span className="flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5" /> ฟอร์มทดสอบยิง Request API
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <select
                            value={testMethod}
                            onChange={(e) => setTestMethod(e.target.value)}
                            className="bg-background border border-border rounded-xl px-2 py-1.5 text-xs font-black text-emerald-500 outline-none"
                          >
                            {['GET', 'POST', 'PUT', 'DELETE'].map(method => (
                              <option key={method} value={method}>{method}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={testUrl}
                            onChange={(e) => setTestUrl(e.target.value)}
                            placeholder="https://api.example.com/data"
                            className="flex-1 bg-background border border-border focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs font-mono text-text outline-none"
                          />
                        </div>

                        {['POST', 'PUT'].includes(testMethod) && (
                          <textarea
                            rows={2}
                            value={testBody}
                            onChange={(e) => setTestBody(e.target.value)}
                            placeholder='JSON Body (เช่น {"key": "value"})'
                            className="w-full bg-background border border-border focus:border-emerald-500 rounded-xl p-2 text-[11px] font-mono text-text outline-none resize-none"
                          />
                        )}

                        <button
                          onClick={runApiTestAndAnalyze}
                          disabled={isTestingApi || !testUrl.trim()}
                          className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md disabled:opacity-40 transition-all active:scale-98 cursor-pointer"
                        >
                          {isTestingApi ? (
                            <>กำลังยิง Request...</>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" /> ยิง Request & ให้ AI วิเคราะห์ผล
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Render Formatted API Code Response Block inside AI Reply */}
                    {m.apiResult && (
                      <div className="bg-background border border-emerald-500/30 rounded-xl p-3 text-[11px] font-mono flex flex-col gap-2 shadow-inner">
                        <div className="flex items-center justify-between text-emerald-500 font-bold border-b border-border/50 pb-1.5">
                          <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Status: {m.apiResult.status}</span>
                          <span className="flex items-center gap-1 text-muted"><Clock className="w-3 h-3" /> {m.apiResult.duration}ms</span>
                        </div>
                        <pre className="text-text max-h-32 overflow-y-auto custom-scrollbar p-2 bg-surface/50 rounded-lg text-[10px] whitespace-pre-wrap break-all">
                          {m.apiResult.data}
                        </pre>
                      </div>
                    )}
                  </div>
                  {m.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-surface text-muted flex items-center justify-center shrink-0 border border-border mt-1">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5 items-center text-xs font-bold text-muted">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <Bot className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div className="px-3 py-2 bg-surface border border-border rounded-xl flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span>AI กำลังวิเคราะห์ผลลัพธ์...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Embedded API Tester Collapsible Drawer */}
            <AnimatePresence>
              {showApiTester && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-3 bg-surface/95 border-t border-emerald-500/40 flex flex-col gap-2.5 shadow-2xl backdrop-blur-xl shrink-0"
                >
                  <div className="flex items-center justify-between text-xs font-black text-emerald-500">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4" /> ทดสอบยิง Request API ทันที
                    </span>
                    <button
                      onClick={() => setShowApiTester(false)}
                      className="text-muted hover:text-text text-[10px]"
                    >
                      ปิด
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={testMethod}
                      onChange={(e) => setTestMethod(e.target.value)}
                      className="bg-background border border-border rounded-xl px-2 py-1.5 text-xs font-black text-emerald-500 outline-none"
                    >
                      {['GET', 'POST', 'PUT', 'DELETE'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={testUrl}
                      onChange={(e) => setTestUrl(e.target.value)}
                      placeholder="https://api.example.com/data"
                      className="flex-1 bg-background border border-border focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs font-mono text-text outline-none"
                    />
                  </div>

                  {['POST', 'PUT'].includes(testMethod) && (
                    <textarea
                      rows={2}
                      value={testBody}
                      onChange={(e) => setTestBody(e.target.value)}
                      placeholder='JSON Body (เช่น {"key": "value"})'
                      className="w-full bg-background border border-border focus:border-emerald-500 rounded-xl p-2 text-[11px] font-mono text-text outline-none resize-none"
                    />
                  )}

                  <button
                    onClick={runApiTestAndAnalyze}
                    disabled={isTestingApi || !testUrl.trim()}
                    className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md disabled:opacity-40 transition-all active:scale-98"
                  >
                    {isTestingApi ? (
                      <>กำลังยิง Request...</>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" /> ยิง Request & ให้ AI วิเคราะห์ผล
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Action Chips & FAQ Bar */}
            {(currentToolInfo.faqs.length > 0 || location.pathname.includes('api') || location.pathname.includes('developer-tools')) && (
              <div className="px-3 py-2 bg-surface/50 border-t border-border flex gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
                {(location.pathname.includes('api') || location.pathname.includes('developer-tools')) && (
                  <button
                    onClick={() => setShowApiTester(!showApiTester)}
                    className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-[11px] font-bold text-emerald-500 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Globe className="w-3 h-3" /> {showApiTester ? 'ซ่อนตัวทดสอบ API' : 'ทดสอบ API ด่วน'}
                  </button>
                )}
                {currentToolInfo.faqs.map((faq, fIdx) => (
                  <button
                    key={fIdx}
                    onClick={() => handleSendMessage(faq.q)}
                    className="px-2.5 py-1 bg-surface hover:bg-emerald-500/10 border border-border text-[11px] font-medium text-muted hover:text-emerald-500 rounded-lg whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {faq.q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-surface border-t border-border flex gap-2 items-center shrink-0"
            >
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="พิมพ์คำถามที่นี่..."
                className="flex-1 bg-background border border-border focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-medium text-text outline-none"
              />
              <button
                type="submit"
                disabled={!inputMsg.trim()}
                className="p-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
