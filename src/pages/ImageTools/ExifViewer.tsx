import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, ShieldCheck, Check, Info } from 'lucide-react';
import ExifReader from 'exifreader';

interface TagValue {
  name: string;
  value: string;
}

export default function ExifViewer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [rawTags, setRawTags] = useState<TagValue[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [stripped, setStripped] = useState<boolean>(false);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(2)} KB (${file.size.toLocaleString()} Bytes)`);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result;
      setImageSrc(result as string);

      try {
        // Parse real EXIF tags using ExifReader library from ArrayBuffer
        const tags = await ExifReader.load(file);
        const parsedTags: TagValue[] = [];

        for (const [key, tag] of Object.entries(tags)) {
          if (key !== 'MakerNote') {
            parsedTags.push({
              name: tag.description ? `${key} (${tag.description})` : key,
              value: String(tag.value ?? tag.description ?? JSON.stringify(tag)),
            });
          }
        }

        if (parsedTags.length === 0) {
          parsedTags.push({
            name: 'EXIF Tag Status',
            value: 'No EXIF metadata tags found in this file (Metadata clean or stripped).',
          });
        }

        setRawTags(parsedTags);
      } catch (err: any) {
        setRawTags([
          {
            name: 'Parser Notice',
            value: 'No standard EXIF header tags detected in file (Clean graphic / Web PNG).',
          },
        ]);
      }
      setStripped(false);
    };

    reader.readAsDataURL(file);
  };

  const stripMetadataAndDownload = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const cleanUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `clean-${fileName}`;
        link.href = cleanUrl;
        link.click();
        setStripped(true);
      }
    };
    img.src = imageSrc;
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-full py-12 md:py-20 z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none z-[-1]" />

      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-tight">EXIF Metadata Inspector</h1>
        <p className="text-muted font-medium text-lg">ตรวจสอบและดึงข้อมูล EXIF Metadata เชิงลึกจากไฟล์ภาพโดยตรงด้วย ExifReader</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-4xl p-6 md:p-8 flex flex-col gap-8 items-center"
      >
        {!imageSrc ? (
          <label className="w-full h-64 border-2 border-dashed border-border hover:border-emerald-500/50 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer bg-surface/50 transition-all">
            <Upload className="w-10 h-10 text-emerald-500" />
            <span className="text-sm font-bold text-text">Click or Drag & Drop Image Here</span>
            <span className="text-xs text-muted">Extract real EXIF tags from JPEG, PNG, WEBP, TIFF, HEIC</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        ) : (
          <div className="w-full flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Image Preview */}
              <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-surface border border-border rounded-2xl">
                <img src={imageSrc} alt="EXIF Preview" className="max-h-64 max-w-full rounded-xl object-contain border border-border shadow-sm mb-4" />
                <div className="text-center">
                  <span className="text-sm font-bold text-text block truncate max-w-[200px]">{fileName}</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-1 block">{fileSize}</span>
                </div>
              </div>

              {/* Authentic EXIF Tags Table */}
              <div className="md:col-span-2 flex flex-col gap-3">
                <h3 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Info className="w-4 h-4 text-emerald-500" /> Authentic Embedded EXIF Tags</span>
                  <span className="text-emerald-500 font-mono">{rawTags.length} Tags Detected</span>
                </h3>
                
                <div className="overflow-y-auto max-h-[380px] border border-border rounded-2xl bg-surface shadow-sm divide-y divide-border">
                  {rawTags.map((tag, idx) => (
                    <div key={idx} className="p-3 hover:bg-background/50 transition-colors flex flex-col gap-0.5">
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">{tag.name}</span>
                      <span className="text-xs font-mono text-text break-all">{tag.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end pt-4 border-t border-border">
              <label className="px-5 py-2.5 bg-background border border-border rounded-xl font-bold text-sm text-text cursor-pointer hover:bg-surface transition-all flex items-center gap-2">
                <Upload className="w-4 h-4" /> Change Image
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                onClick={stripMetadataAndDownload}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                {stripped ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                {stripped ? 'Clean Image Downloaded' : 'Strip All EXIF & Download Clean Image'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
