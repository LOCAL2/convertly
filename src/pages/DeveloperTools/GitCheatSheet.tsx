import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Search } from 'lucide-react';

interface GitCommand {
  id: string;
  category: string;
  title: string;
  description: string;
  command: string;
  hasParams?: boolean;
}

const gitCheatSheetData: GitCommand[] = [
  // Essentials & Workflow
  {
    id: 'git-status',
    category: 'คำสั่งที่ใช้บ่อยประจำวัน (Daily Essentials)',
    title: 'ตรวจสอบสถานะไฟล์ (Status)',
    description: 'ดูว่ามีไฟล์ไหนถูกแก้ไข เพิ่มใหม่ หรือเตรียม commit อยู่บ้าง',
    command: 'git status',
  },
  {
    id: 'git-add-all',
    category: 'คำสั่งที่ใช้บ่อยประจำวัน (Daily Essentials)',
    title: 'เตรียมไฟล์ทั้งหมดเพื่อ Commit (Add All)',
    description: 'นำไฟล์ที่ถูกแก้ไขและสร้างใหม่ทั้งหมดเข้าสู่ Staging Area',
    command: 'git add .',
  },
  {
    id: 'git-add-file',
    category: 'คำสั่งที่ใช้บ่อยประจำวัน (Daily Essentials)',
    title: 'เลือกเตรียมเฉพาะบางไฟล์ (Add File)',
    description: 'นำเฉพาะไฟล์ที่ต้องการเข้าสู่ Staging Area',
    command: 'git add <file>',
    hasParams: true,
  },
  {
    id: 'git-commit',
    category: 'คำสั่งที่ใช้บ่อยประจำวัน (Daily Essentials)',
    title: 'บันทึกการเปลี่ยนแปลง (Commit)',
    description: 'บันทึกไฟล์ใน Staging Area พร้อมใส่ข้อความอธิบายการแก้ไข',
    command: 'git commit -m "<message>"',
    hasParams: true,
  },
  {
    id: 'git-push',
    category: 'คำสั่งที่ใช้บ่อยประจำวัน (Daily Essentials)',
    title: 'ส่งโค้ดขึ้น Server (Push)',
    description: 'ส่ง Commit จากเครื่อง local ไปยัง Remote Repository (เช่น GitHub)',
    command: 'git push origin <branch>',
    hasParams: true,
  },
  {
    id: 'git-pull',
    category: 'คำสั่งที่ใช้บ่อยประจำวัน (Daily Essentials)',
    title: 'ดึงโค้ดล่าสุดจาก Server (Pull)',
    description: 'ดึงการอัปเดตล่าสุดจาก Remote มาอัปเดตใส่ Branch ในเครื่อง',
    command: 'git pull origin <branch>',
    hasParams: true,
  },
  {
    id: 'git-clone',
    category: 'คำสั่งที่ใช้บ่อยประจำวัน (Daily Essentials)',
    title: 'คัดลอกโปรเจกต์จาก Remote (Clone)',
    description: 'ดาวน์โหลด Repository จาก GitHub/GitLab มาไว้ในเครื่อง',
    command: 'git clone <url>',
    hasParams: true,
  },
  {
    id: 'git-init',
    category: 'คำสั่งที่ใช้บ่อยประจำวัน (Daily Essentials)',
    title: 'เริ่มต้นสร้าง Git ในโปรเจกต์ (Init)',
    description: 'สร้างตัวจัดการเวอร์ชัน Git ในโฟลเดอร์ปัจจุบัน',
    command: 'git init',
  },

  // Undo & Reset
  {
    id: 'undo-last-commit-keep',
    category: 'Undo & Reset (ยกเลิกการแก้ไข)',
    title: 'ยกเลิก Commit ล่าสุด (เก็บโค้ดไว้)',
    description: 'ยกเลิกการ commit ล่าสุด แต่คงการแก้ไขไฟล์เดิมไว้ใน Staging Area',
    command: 'git reset --soft HEAD~1',
  },
  {
    id: 'undo-last-commit-hard',
    category: 'Undo & Reset (ยกเลิกการแก้ไข)',
    title: 'ยกเลิก Commit ล่าสุด และลบโค้ดทิ้ง (Hard Reset)',
    description: 'ยกเลิก commit ล่าสุดและย้อนกลับลบการแก้ไขไฟล์ทั้งหมดทิ้งทันที',
    command: 'git reset --hard HEAD~1',
  },
  {
    id: 'unstage-file',
    category: 'Undo & Reset (ยกเลิกการแก้ไข)',
    title: 'ยกเลิก git add (Unstage File)',
    description: 'นำไฟล์ออกจาก Staging Area โดยไม่กระทบเนื้อหาในไฟล์',
    command: 'git restore --staged <file>',
    hasParams: true,
  },
  {
    id: 'discard-local-changes',
    category: 'Undo & Reset (ยกเลิกการแก้ไข)',
    title: 'ทิ้งการแก้ไขไฟล์ทั้งหมดที่ยังไม่ Commit',
    description: 'ล้างการเปลี่ยนแปลงใน Working Directory ให้กลับเป็นเวอร์ชันล่าสุด',
    command: 'git restore .',
  },

  // Branch Operations
  {
    id: 'checkout-branch',
    category: 'Branch (จัดการกิ่งโค้ด)',
    title: 'สลับไปใช้งาน Branch อื่น',
    description: 'สลับไปยัง Branch ที่มีอยู่แล้วในเครื่อง',
    command: 'git checkout <branch>',
    hasParams: true,
  },
  {
    id: 'create-and-checkout-branch',
    category: 'Branch (จัดการกิ่งโค้ด)',
    title: 'สร้างและสลับไป Branch ใหม่ทันที',
    description: 'สร้าง Branch ใหม่พร้อม checkout สลับไปใช้งาน',
    command: 'git checkout -b <new_branch>',
    hasParams: true,
  },
  {
    id: 'merge-branch',
    category: 'Branch (จัดการกิ่งโค้ด)',
    title: 'รวมโค้ดจาก Branch อื่นเข้า Branch ปัจจุบัน (Merge)',
    description: 'นำการเปลี่ยนแปลงจาก Branch เป้าหมายมารวมกับ Branch ที่อยู่',
    command: 'git merge <branch>',
    hasParams: true,
  },
  {
    id: 'delete-local-branch',
    category: 'Branch (จัดการกิ่งโค้ด)',
    title: 'ลบ Local Branch',
    description: 'ลบ Branch ในเครื่อง (ต้องสลับไป Branch อื่นก่อน)',
    command: 'git branch -d <branch>',
    hasParams: true,
  },
  {
    id: 'delete-remote-branch',
    category: 'Branch (จัดการกิ่งโค้ด)',
    title: 'ลบ Remote Branch บน Server',
    description: 'ลบ Branch บน GitHub / GitLab / Bitbucket',
    command: 'git push origin --delete <branch>',
    hasParams: true,
  },

  // Stash Operations
  {
    id: 'stash-save',
    category: 'Stash (ซ่อนงานชั่วคราว)',
    title: 'ซ่อนการแก้ไขชั่วคราว (Stash)',
    description: 'เก็บงานที่ยังทำไม่เสร็จไว้ชั่วคราวเพื่อสลับไปทำอย่างอื่น',
    command: 'git stash -u',
  },
  {
    id: 'stash-pop',
    category: 'Stash (ซ่อนงานชั่วคราว)',
    title: 'ดึงงานที่ Stash ไว้กลับมาใช้งาน',
    description: 'คืนค่าการแก้ไขล่าสุดที่เคย Stash ไว้ และลบออกจาก Stash list',
    command: 'git stash pop',
  },

  // History & Amend
  {
    id: 'pretty-log',
    category: 'History (ประวัติ)',
    title: 'ดูประวัติ Commit แบบย่อสวยงาม (One Line Tree)',
    description: 'แสดง กิ่งก้าน Graph และ Commit Log แบบเข้าใจง่าย',
    command: 'git log --oneline --graph --all',
  },
  {
    id: 'amend-commit-message',
    category: 'History (ประวัติ)',
    title: 'แก้ไขข้อความ Commit ล่าสุด',
    description: 'เปลี่ยน Commit message ล่าสุดที่เพิ่งพิมพ์ไป',
    command: 'git commit --amend -m "<message>"',
    hasParams: true,
  },
];

export default function GitCheatSheet() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(gitCheatSheetData.map((d) => d.category)))];

  const handleCopy = (id: string, commandText: string) => {
    navigator.clipboard.writeText(commandText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCommands = gitCheatSheetData.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.command.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-8 md:py-12 px-4 md:px-8 z-10">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-text tracking-tight">
            Git Cheat Sheet & Commands
          </h1>
          <p className="text-muted text-sm font-medium mt-1">
            คลังคำสั่ง Git พื้นฐานประจำวันที่ใช้บ่อยที่สุด (add, commit, push, pull, branch, undo) คัดลอกไปใช้งานได้ทันที
          </p>
        </div>
      </div>

      {/* Control Bar & Filter */}
      <div className="glass-panel w-full max-w-6xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="text"
            placeholder="ค้นหาคำสั่ง Git (เช่น add, commit, push)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm text-text outline-none focus:ring-1 focus:ring-emerald-500/50"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-surface border border-border text-muted hover:text-text'
              }`}
            >
              {cat === 'All' ? 'ทั้งหมด (All)' : cat.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Command List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {filteredCommands.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-md">
                  {item.category.split(' ')[0]}
                </span>
              </div>
              <h3 className="text-lg font-bold text-text mb-1 group-hover:text-emerald-500 transition-colors">
                {item.title}
              </h3>
              <p className="text-muted text-xs font-medium leading-relaxed mb-4">{item.description}</p>
            </div>

            {/* Code Box */}
            <div className="relative bg-background/80 border border-border rounded-xl p-3.5 flex items-center justify-between font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="truncate pr-8">$ {item.command}</span>
              <button
                onClick={() => handleCopy(item.id, item.command)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-surface border border-border hover:bg-black/5 dark:hover:bg-white/10 text-muted hover:text-text transition-colors"
                title="คัดลอกคำสั่ง"
              >
                {copiedId === item.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
