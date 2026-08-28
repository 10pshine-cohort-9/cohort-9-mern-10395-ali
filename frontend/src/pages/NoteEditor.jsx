import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { createNote, updateNote, getNoteById } from '../api/notesApi';
import { StickyNote, ChevronLeft, Save } from 'lucide-react';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import '../styles/editor.css';

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    if (id) {
      setLoading(true);
      setError('');
      getNoteById(id)
        .then(({ data }) => {
          if (active) {
            setTitle(data.data.note.title);
            setContent(data.data.note.content);
          }
        })
        .catch(() => {
          if (active) setError('Could not load note');
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }
    return () => {
      active = false;
    };
  }, [id]);

  const handleSave = async () => {
    if (!title.trim()) return setError('Title is required');
    setSaving(true);
    try {
      if (id) await updateNote(id, { title, content });
      else await createNote({ title, content });
      navigate('/');
    } catch (err) {
      setError('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-surface p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-sidebar">
            <ChevronLeft size={20} /> Back
          </button>
          <div className="flex items-center gap-2">
             <StickyNote className="text-accent" />
             <span className="font-bold">Note Editor</span>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 font-bold text-white shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </header>

        {error && <Alert message={error} type="error" />}

        <div className="rounded-3xl bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200 md:p-10">
          <input
            type="text"
            placeholder="Note Title"
            className="mb-6 w-full text-3xl font-bold outline-none placeholder:text-slate-200 focus-visible:ring-2 focus-visible:ring-accent/10 rounded-xl px-2 transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <ReactQuill value={content} onChange={setContent} theme="snow" className="min-h-100" />
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;