import { ClipboardPen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyState = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 rounded-full bg-slate-100 p-8 text-slate-300">
        <ClipboardPen size={48} />
      </div>
      <h3 className="mb-2 text-xl font-bold text-sidebar">No notes yet</h3>
      <p className="mb-8 max-w-xs text-sm text-slate-400">
        Start organizing your space by creating your very first note.
      </p>
      <button 
        onClick={() => navigate('/new')}
        className="rounded-xl bg-sidebar px-8 py-3 font-bold text-white transition-transform hover:scale-105"
      >
        Create First Note
      </button>
    </div>
  );
};
export default EmptyState;