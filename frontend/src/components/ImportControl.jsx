import { Upload } from 'lucide-react';
import { createNote } from '../api/notesApi';
import logger from '../api/logger';

const ImportControl = ({ onComplete }) => {
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    let imported = 0;
    let skipped = 0;

    for (const file of files) {
      try {
        const content = await file.text();
        const title = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
        
        await createNote({ title, content });
        imported++;
      } catch (err) {
        skipped++;
        logger.error({ err }, 'File import failed');
      }
    }

    onComplete({ imported, skipped });
    e.target.value = '';
  };

  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all border border-slate-200">
      <Upload size={16} /> Import
      <input 
        type="file" 
        accept=".txt" 
        multiple 
        className="hidden" 
        onChange={handleFileChange} 
      />
    </label>
  );
};

export default ImportControl;
