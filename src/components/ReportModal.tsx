import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareWarning, X, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import CustomSelect, { type SelectOption } from './CustomSelect';

const REPORT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'incorrect_result', label: '⚠️ ผลลัพธ์คำตอบไม่ตรง / ผิดหลักความเป็นจริง' },
  { value: 'bug', label: '🐛 พบปัญหาบั๊ก / ปุ่มกดไม่ทำงาน / หน้าเว็บค้าง' },
  { value: 'feature_request', label: '💡 เสนอแนะฟีเจอร์เครื่องมือใหม่' },
  { value: 'other', label: '📝 ข้อเสนอแนะอื่นๆ' },
];

export default function ReportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [reportType, setReportType] = useState<'bug' | 'incorrect_result' | 'feature_request' | 'other'>('incorrect_result');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const location = useLocation();

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSending(true);
    setErrorMsg(null);

    const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

    if (!webhookUrl || webhookUrl.includes('your_webhook_url_here')) {
      setErrorMsg('ยังไม่ได้ตั้งค่า VITE_DISCORD_WEBHOOK_URL ในไฟล์ .env');
      setIsSending(false);
      return;
    }

    const typeTitles: Record<string, { label: string; color: number }> = {
      bug: { label: '🐛 รายงานข้อผิดพลาดของระบบ (Bug)', color: 15158332 }, // Red
      incorrect_result: { label: '⚠️ ผลลัพธ์คำตอบไม่ตรง / ขัดกับความเป็นจริง', color: 16744192 }, // Orange
      feature_request: { label: '💡 เสนอแนะฟีเจอร์ใหม่', color: 3066993 }, // Green
      other: { label: '📝 ข้อเสนอแนะอื่นๆ', color: 3447003 } // Blue
    };

    const currentType = typeTitles[reportType] || typeTitles.other;

    const payload = {
      username: 'Convertly Feedback Bot',
      avatar_url: 'https://cdn-icons-png.flaticon.com/512/3682/3682281.png',
      embeds: [
        {
          title: currentType.label,
          color: currentType.color,
          description: description.trim(),
          fields: [
            {
              name: '📍 หน้าที่พบปัญหา (Page URL)',
              value: `\`${window.location.origin}${location.pathname}\``,
              inline: false
            },
            {
              name: '👤 ข้อมูลติดต่อกลับ (Contact)',
              value: contactInfo.trim() ? `\`${contactInfo.trim()}\`` : '*ไม่ระบุ*',
              inline: true
            },
            {
              name: '💻 อุปกรณ์ & เบราว์เซอร์',
              value: `\`${navigator.userAgent.slice(0, 70)}...\``,
              inline: true
            }
          ],
          footer: {
            text: `Convertly Utility System • ${new Date().toLocaleString('th-TH')}`
          }
        }
      ]
    };

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok || res.status === 204) {
        setSentSuccess(true);
        setTimeout(() => {
          setSentSuccess(false);
          setIsOpen(false);
          setDescription('');
          setContactInfo('');
        }, 2200);
      } else {
        throw new Error(`ส่งข้อมูลไม่สำเร็จ Status: ${res.status}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ Discord Webhook');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full shadow-2xl hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all active:scale-90 flex items-center gap-2 group cursor-pointer border border-white/20 backdrop-blur-xl"
        title="รายงานปัญหากลับมายังทีมพัฒนา"
      >
        <MessageSquareWarning className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-black pr-1 hidden sm:inline">แจ้งปัญหา / ข้อเสนอแนะ</span>
      </button>

      {/* Report Modal Backdrop & Window */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-panel p-6 md:p-8 flex flex-col gap-6 shadow-2xl border border-white/20 dark:border-white/10"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 p-2 text-muted hover:text-text hover:bg-surface rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-black text-text tracking-tight">รายงานปัญหาหรือข้อผิดพลาด</h3>
                  <span className="text-xs font-semibold text-muted">รายงานนี้จะถูกส่งไปยังทีมพัฒนาผ่าน Discord Webhook ทันที</span>
                </div>
              </div>

              {sentSuccess ? (
                <div className="py-10 flex flex-col items-center justify-center text-center gap-3">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
                  <h4 className="text-lg font-black text-text">ส่งรายงานเรียบร้อยแล้ว!</h4>
                  <p className="text-xs font-bold text-muted">ขอบพระคุณสำหรับข้อมูลเพื่อการปรับปรุง Convertly ครับ</p>
                </div>
              ) : (
                <form onSubmit={handleSendReport} className="flex flex-col gap-4">
                  {/* Category Selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-muted uppercase tracking-wider">ประเภทของปัญหา</label>
                    <CustomSelect
                      value={reportType}
                      onChange={(val) => setReportType(val as any)}
                      options={REPORT_TYPE_OPTIONS}
                      size="md"
                    />
                  </div>

                  {/* Page URL Info */}
                  <div className="flex items-center justify-between px-3.5 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-muted">
                    <span>หน้าเว็บปัจจุบัน:</span>
                    <span className="font-mono text-emerald-500 font-bold truncate max-w-[240px]">
                      {location.pathname}
                    </span>
                  </div>

                  {/* Description Detail */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-muted uppercase tracking-wider">รายละเอียดปัญหาหรือสิ่งที่พบ</label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      placeholder="อธิบายรายละเอียดปัญหา เช่น คำนวณค่า X แล้วได้ผลลัพธ์เป็น Y ซึ่งที่ถูกต้องควรเป็น Z..."
                      className="w-full bg-background border border-border focus:border-emerald-500 rounded-xl p-3.5 text-text text-sm font-medium outline-none shadow-inner"
                    />
                  </div>

                  {/* Contact Info (Optional) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-muted uppercase tracking-wider">ข้อมูลติดต่อกลับ (ไม่ระบูก็ได้)</label>
                    <input
                      type="text"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="เช่น อีเมล หรือ Discord Tag"
                      className="w-full bg-background border border-border focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-text text-sm font-medium outline-none shadow-inner"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold rounded-xl">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSending || !description.trim()}
                    className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-extrabold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    {isSending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>ส่งรายงานไปยัง Discord</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
