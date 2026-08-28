import { Trash2, Calendar, FileEdit, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { formatDate } from '../utils/dateFormatter';

const NoteCard = ({ note, onDelete }) => {
  const navigate = useNavigate();

  const getPlainText = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const handleDownload = () => {
    const plainText = getPlainText(note.content);
    const element = document.createElement('a');
    const file = new Blob([`Title: ${note.title}\n\n${plainText}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const preview = DOMPurify.sanitize(note.content) || 'No additional content...';

  return (
    <div className="group relative rounded-3xl bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200/50 transition-all hover:shadow-md hover:ring-accent/20">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="line-clamp-1 font-bold text-sidebar">{note.title}</h3>
        <div className="flex gap-1 transition-opacity opacity-100 md:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
          <button 
            onClick={handleDownload}
            aria-label={`Download note: ${note.title}`}
            className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <Download size={16} aria-hidden="true" />
          </button>
          <button 
            onClick={() => navigate(`/edit/${note.id}`)} 
            aria-label={`Edit note: ${note.title}`}
            className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <FileEdit size={16} aria-hidden="true" />
          </button>
          <button 
            onClick={() => onDelete(note)} 
            aria-label={`Delete note: ${note.title}`}
            className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        className="note-preview mb-6 line-clamp-3 text-sm leading-relaxed text-slate-600"
        dangerouslySetInnerHTML={{ __html: preview }}
      />
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <Calendar size={12} aria-hidden="true" />
        {formatDate(note.updated_at)}
      </div>
    </div>
  );
};

export default NoteCard;