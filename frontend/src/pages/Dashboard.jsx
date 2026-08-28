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
import ImportControl from '../components/ImportControl';
import ImportSummary from '../components/ImportSummary';
import { getProfile } from '../api/userApi';
import { debounce } from '../utils/debounce';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { notes, loading, error, fetchNotes, removeNote } = useNotes();
  const socket = useSocket();
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [importResults, setImportResults] = useState(null);
  const [deletedCount, setDeletedCount] = useState(user?.deleted_notes_count || 0);
  
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  const debouncedFetch = useCallback(
    debounce((q) => fetchNotes(q), 500),
    [fetchNotes]
  );

  const handleSearch = (val) => {
    setSearchTerm(val);
    debouncedFetch(val);
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const syncDeletedCount = useCallback(() => {
    getProfile()
      .then(({ data }) => {
        const count = data?.data?.user?.deleted_notes_count;
        if (typeof count === 'number') {
          setDeletedCount(count);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    getProfile()
      .then(({ data }) => {
        const count = data?.data?.user?.deleted_notes_count;
        if (active && typeof count === 'number') {
          setDeletedCount(count);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [syncDeletedCount]);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => fetchNotes(searchTerm);
    const handleDelete = () => {
      fetchNotes(searchTerm);
      syncDeletedCount();
    };

    socket.on('note:created', handleUpdate);
    socket.on('note:updated', handleUpdate);
    socket.on('note:deleted', handleDelete);

    return () => {
      socket.off('note:created', handleUpdate);
      socket.off('note:updated', handleUpdate);
      socket.off('note:deleted', handleDelete);
    };
  }, [socket, fetchNotes, searchTerm, syncDeletedCount]);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      if (closeButtonRef.current) closeButtonRef.current.focus();
    } else {
      const timeout = setTimeout(() => {
        if (menuButtonRef.current) menuButtonRef.current.focus();
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeSidebar();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isSidebarOpen]);

  const handleDeleteConfirm = async () => {
    if (!selectedNote) return;
    setDeleteError('');
    try {
      const success = await removeNote(selectedNote.id);
      if (success) {
        setDeletedCount((prev) => prev + 1);
        setSelectedNote(null);
      } else {
        setDeleteError('Could not delete note. Please try again.');
      }
    } catch (err) {
      setDeleteError('An unexpected error occurred during deletion.');
    }
  };

  return (
    <div className="flex min-h-screen bg-surface text-slate-800">
      <div 
        className={`fixed inset-0 z-40 bg-sidebar/50 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} 
        onClick={closeSidebar}
      />

      <aside 
        id="main-sidebar"
        inert={isMobile && !isSidebarOpen ? true : undefined}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col transform bg-sidebar p-6 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-lg shadow-accent/20">
              <StickyNote size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">Notes Space</span>
          </div>
          <button ref={closeButtonRef} className="lg:hidden" onClick={closeSidebar} aria-label="Close sidebar"><X size={24} /></button>
        </div>

        <button 
          type="button"
          onClick={() => navigate('/profile')} 
          aria-label="View Profile"
          className="mb-10 flex w-full flex-col items-center border-b border-white/10 pb-10 cursor-pointer hover:bg-white/5 rounded-2xl transition-colors outline-none focus:ring-2 focus:ring-accent/50"
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl font-black ring-4 ring-white/10">
            {user?.name?.charAt(0)}
          </div>
          <p className="text-xs text-slate-300 font-medium">View Profile</p>
          <p className="max-w-50 truncate font-bold text-white text-lg">{user?.name}</p>
        </button>

        <nav className="space-y-2 flex-1">
          <button type="button" onClick={() => navigate('/')} className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-white/10 p-4 font-bold transition-all text-white"><LayoutDashboard size={20} /> <span>Dashboard</span></button>
          <button type="button" onClick={() => navigate('/all-notes')} className="flex w-full cursor-pointer items-center gap-3 p-4 text-slate-300 font-bold transition-all hover:bg-white/5 hover:text-white"><FileText size={20} /> <span>All Notes</span></button>
        </nav>

        <button onClick={logout} className="mt-auto flex items-center gap-3 p-4 text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300 font-black tracking-tight"><LogOut size={20} /> <span>Log Out</span></button>
      </aside>

      <main 
        inert={isMobile && isSidebarOpen ? true : undefined} 
        className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10"
      >
        <header className="mb-10 flex flex-col gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-4 min-w-max">
            <button ref={menuButtonRef} className="rounded-lg bg-white p-2 text-sidebar shadow-sm lg:hidden border border-slate-100" onClick={() => setIsSidebarOpen(true)} aria-label="Open sidebar" aria-expanded={isSidebarOpen} aria-controls="main-sidebar"><Menu size={24} /></button>
            <div>
              <h1 className="text-2xl font-black text-sidebar md:text-3xl tracking-tight">Overview</h1>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center gap-4 px-4 max-w-2xl mx-auto">
            <SearchFilters onSearch={handleSearch} value={searchTerm} />
            <ImportControl onComplete={(res) => { setImportResults(res); fetchNotes(); }} />
          </div>
        </header>

        {importResults && <ImportSummary results={importResults} onClose={() => setImportResults(null)} />}

        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl bg-cardGreen p-8 shadow-sm transition-transform hover:scale-[1.02] border border-green-200">
            <p className="font-black text-slate-800 text-sm uppercase tracking-wide">Total Notes</p>
            <h2 className="mt-2 text-4xl font-black text-sidebar">{notes.length}</h2>
            <div className="mt-4 h-1.5 w-full rounded-full bg-sidebar/10"><div className="h-full w-full rounded-full bg-green-600" /></div>
          </div>
          <div className="rounded-3xl bg-red-50 p-8 shadow-sm transition-transform hover:scale-[1.02] border border-red-100">
            <p className="font-black text-red-800 text-sm uppercase tracking-wide">Deleted Notes</p>
            <h2 className="mt-2 text-4xl font-black text-red-900">{deletedCount}</h2>
            <div className="mt-4 h-1.5 w-full rounded-full bg-red-900/5"><div className="h-full w-full rounded-full bg-red-500" style={{ width: deletedCount > 0 ? '100%' : '0%' }} /></div>
          </div>
          <div className="group relative overflow-hidden rounded-3xl bg-cardPurple p-8 shadow-sm transition-all hover:bg-cardPurple/80 border border-purple-200">
            <p className="font-black text-slate-800 text-sm uppercase tracking-wide">Storage Status</p>
            <button className="mt-4 rounded-xl bg-sidebar px-6 py-2.5 text-xs font-black text-white transition-all hover:bg-slate-800 shadow-md">Upgrade Plan</button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-10 border border-slate-100">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-50 pb-6">
            <div>
              <h3 className="text-xl font-black text-sidebar">Recent Workspace</h3>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/all-notes')} className="text-sm font-black text-accent hover:underline flex items-center gap-1"><FileText size={16}/> View All</button>
              <button onClick={() => navigate('/new')} className="flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-black text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 active:scale-95"><Plus size={18} /> Create New</button>
            </div>
          </div>
          
          {loading ? <Loader /> : error ? <Alert message={error} type="error" /> : <NoteGrid notes={notes.slice(0, 3)} onDelete={setSelectedNote} />}
        </div>
      </main>

      <DeleteModal isOpen={!!selectedNote} noteTitle={selectedNote?.title} onClose={() => { setSelectedNote(null); setDeleteError(''); }} onConfirm={handleDeleteConfirm}>
        {deleteError && <Alert message={deleteError} type="error" />}
      </DeleteModal>
    </div>
  );
};

export default Dashboard;