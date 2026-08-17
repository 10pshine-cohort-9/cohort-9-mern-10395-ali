import { Trash2, Calendar, FileEdit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/dateFormatter';

const NoteCard = ({ note, onDelete }) => {
  const navigate = useNavigate();

  const getPreviewText = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.substring(0, 100);
  };

  const preview = getPreviewText(note.content);

  return (
    <div className="group relative rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md hover:ring-accent/20">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="line-clamp-1 font-bold text-sidebar">{note.title}</h3>
        <div className="flex gap-1 transition-opacity opacity-100 md:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
          <button 
            onClick={() => navigate(`/edit/${note.id}`)} 
            aria-label={`Edit note: ${note.title}`}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <FileEdit size={16} aria-hidden="true" />
          </button>
          <button 
            onClick={() => onDelete(note)} 
            aria-label={`Delete note: ${note.title}`}
            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-slate-500">
        {preview || 'No additional content...'}
      </p>
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
        <Calendar size={12} aria-hidden="true" />
        {formatDate(note.updated_at)}
      </div>
    </div>
  );
};

export default NoteCard;