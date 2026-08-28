import { useState, useEffect, useRef, useCallback } from 'react';
import { LayoutDashboard, FileText, LogOut, Plus, StickyNote, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
import { useSocket } from '../hooks/useSocket';
import { useNavigate } from 'react-router-dom';
import SearchFilters from '../components/SearchFilters';
import NoteGrid from '../components/NoteGrid';
import DeleteModal from '../components/DeleteModal';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { debounce } from '../utils/debounce';

const AllNotes = () => {
  const { user, logout } = useAuth();
  const { notes, loading, error, fetchNotes, removeNote } = useNotes();
  const socket = useSocket();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const menuButtonRef = useRef(null);

  const debouncedFetch = useCallback(debounce((q) => fetchNotes(q), 500), [fetchNotes]);
  const handleSearch = (val) => { setSearchTerm(val); debouncedFetch(val); };

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  useEffect(() => {
    if (socket) {
      const refresh = () => fetchNotes(searchTerm);
      socket.on('note:created', refresh);
      socket.on('note:updated', refresh);
      socket.on('note:deleted', refresh);
      return () => {
        socket.off('note:created'); socket.off('note:updated'); socket.off('note:deleted');
      };
    }
  }, [socket, fetchNotes, searchTerm]);

  return (
    <div className="flex min-h-screen bg-surface text-slate-800">
      <aside className="w-72 hidden lg:flex flex-col bg-sidebar p-6 text-white">
        <div className="mb-10 flex items-center gap-3">
          <StickyNote size={24} className="text-accent" />
          <span className="text-xl font-bold">Notes Space</span>
        </div>
        <button onClick={() => navigate('/profile')} className="mb-10 flex flex-col items-center border-b border-white/10 pb-10">
          <div className="mb-4 h-20 w-20 flex items-center justify-center rounded-full bg-accent text-2xl font-black">{user?.name?.charAt(0)}</div>
          <p className="font-bold">{user?.name}</p>
        </button>
        <nav className="space-y-2 flex-1">
          <button onClick={() => navigate('/')} className="flex w-full items-center gap-3 p-4 text-slate-300 hover:text-white"><LayoutDashboard size={20} /> Dashboard</button>
          <button className="flex w-full items-center gap-3 rounded-xl bg-white/10 p-4 font-medium text-white"><FileText size={20} /> All Notes</button>
        </nav>
        <button onClick={logout} className="p-4 text-red-400 font-bold flex items-center gap-3"><LogOut size={20} /> Log Out</button>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <h1 className="text-3xl font-black text-sidebar">All Notes</h1>
          <div className="flex-1 flex justify-center max-w-xl">
            <SearchFilters onSearch={handleSearch} value={searchTerm} />
          </div>
          <button onClick={() => navigate('/new')} className="bg-accent text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus size={18} /> New Note</button>
        </header>

        {loading ? <Loader /> : error ? <Alert message={error} /> : <NoteGrid notes={notes} onDelete={setSelectedNote} />}
      </main>

      <DeleteModal isOpen={!!selectedNote} noteTitle={selectedNote?.title} onClose={() => setSelectedNote(null)} onConfirm={async () => { await removeNote(selectedNote.id); setSelectedNote(null); }} />
    </div>
  );
};

export default AllNotes;