import { useState, useEffect, useRef, useCallback } from 'react';
import { LayoutDashboard, FileText, Bell, LogOut, Plus, StickyNote, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
import { useNavigate } from 'react-router-dom';
import SearchFilters from '../components/SearchFilters';
import NoteGrid from '../components/NoteGrid';
import DeleteModal from '../components/DeleteModal';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { debounce } from '../utils/debounce';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { notes, loading, error, fetchNotes, removeNote } = useNotes();
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
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

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, []);

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
        setSelectedNote(null);
      } else {
        setDeleteError('Could not delete note. Please try again.');
      }
    } catch (err) {
      setDeleteError('An unexpected error occurred during deletion.');
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <div 
        className={`fixed inset-0 z-40 bg-sidebar/50 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} 
        onClick={closeSidebar}
      />

      <aside 
        id="main-sidebar"
        inert={isMobile && !isSidebarOpen ? "true" : undefined}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col transform bg-sidebar p-6 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-lg shadow-accent/20">
              <StickyNote size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">Notes Space</span>
          </div>
          <button 
            ref={closeButtonRef}
            className="lg:hidden" 
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        <button 
          type="button"
          onClick={() => navigate('/profile')} 
          aria-label="View Profile"
          className="mb-10 flex w-full flex-col items-center border-b border-white/5 pb-10 cursor-pointer hover:bg-white/5 rounded-2xl transition-colors outline-none focus:ring-2 focus:ring-accent/50"
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl font-black ring-4 ring-white/5">
            {user?.name?.charAt(0)}
          </div>
          <p className="text-xs text-slate-400">View Profile</p>
          <p className="max-w-50 truncate font-bold text-white">{user?.name}</p>
        </button>

        <nav className="space-y-2">
          <button 
            type="button"
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-white/10 p-4 font-medium transition-all"
          >
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </button>
          <button 
            type="button"
            className="flex w-full cursor-pointer items-center gap-3 p-4 text-slate-400 transition-all hover:bg-white/5 hover:text-white"
          >
            <FileText size={20} /> <span>All Notes</span>
          </button>
          <button 
            type="button"
            className="group flex w-full cursor-pointer items-center gap-3 p-4 text-slate-400 transition-all hover:bg-white/5 hover:text-white"
          >
            <Bell size={20} /> 
            <span className="flex-1 text-left">Reminders</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white shadow-sm ring-2 ring-sidebar">
              5
            </span>
          </button>
        </nav>

        <button 
          onClick={logout} 
          className="mt-auto flex items-center gap-3 p-4 text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={20} /> <span>Log Out</span>
        </button>
      </aside>

      <main 
        inert={isMobile && isSidebarOpen ? "true" : undefined}
        className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10"
      >
        <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <button 
              ref={menuButtonRef}
              className="rounded-lg bg-white p-2 text-sidebar shadow-sm lg:hidden" 
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
              aria-expanded={isSidebarOpen}
              aria-controls="main-sidebar"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-sidebar md:text-3xl">Overview</h1>
              <p className="text-slate-500">Managing your personal workspace</p>
            </div>
          </div>

          <SearchFilters onSearch={handleSearch} value={searchTerm} />

          <div className="hidden text-right xl:block">
            <p className="font-bold text-sidebar">Activity Score</p>
            <p className="text-sm font-medium text-green-500">+12% this week</p>
          </div>
        </header>

        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-cardGreen p-8 shadow-sm transition-transform hover:scale-[1.02]">
            <p className="font-medium text-slate-600">Total Notes</p>
            <h2 className="mt-2 text-4xl font-black text-sidebar">{notes.length}</h2>
            <div className="mt-4 h-1.5 w-full rounded-full bg-sidebar/5">
              <div className="h-full w-full rounded-full bg-green-500" />
            </div>
          </div>
          <div className="rounded-3xl bg-cardYellow p-8 shadow-sm transition-transform hover:scale-[1.02]">
            <p className="font-medium text-slate-600">Pinned</p>
            <h2 className="mt-2 text-4xl font-black text-sidebar">0</h2>
            <div className="mt-4 h-1.5 w-full rounded-full bg-sidebar/5">
              <div className="h-full w-0 rounded-full bg-yellow-500" />
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-3xl bg-cardPurple p-8 shadow-sm transition-all hover:bg-cardPurple/80">
            <p className="font-bold text-sidebar">Go Pro</p>
            <p className="mb-4 text-xs text-slate-500">Get unlimited cloud sync</p>
            <button className="rounded-xl bg-sidebar px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800">
              Upgrade
            </button>
          </div>
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-bold text-slate-500">Tag Capacity</p>
            <div className="relative mt-3 flex h-16 w-16 items-center justify-center">
               <svg className="h-full w-full" viewBox="0 0 36 36" aria-hidden="true">
                 <path className="text-slate-100" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                 <path className="text-accent" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
               </svg>
               <span className="absolute text-xs font-bold text-sidebar">75%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="col-span-1 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-10 xl:col-span-2">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-bold text-sidebar">Recent Workspace</h3>
              <button 
                onClick={() => navigate('/new')}
                className="flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 active:scale-95"
              >
                <Plus size={18} /> Create New
              </button>
            </div>
            
            {loading ? (
              <Loader />
            ) : error ? (
              <Alert message={error} type="error" />
            ) : (
              <NoteGrid notes={notes} onDelete={setSelectedNote} />
            )}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-10">
             <h3 className="mb-8 text-xl font-bold text-sidebar">Live Activity</h3>
             <div className="space-y-8">
                <div className="flex items-center justify-between border-l-4 border-accent pl-4">
                  <div>
                    <p className="text-sm font-bold text-sidebar">Sync Completed</p>
                    <p className="text-xs text-slate-400">Just now</p>
                  </div>
                  <p className="text-xs font-black text-accent uppercase tracking-tighter">Success</p>
                </div>
                <div className="flex items-center justify-between border-l-4 border-slate-100 pl-4">
                  <div>
                    <p className="text-sm font-bold text-sidebar">System Ready</p>
                    <p className="text-xs text-slate-400">1 hour ago</p>
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Online</p>
                </div>
             </div>
          </div>
        </div>
      </main>

      <DeleteModal 
        isOpen={!!selectedNote} 
        noteTitle={selectedNote?.title} 
        onClose={() => {
          setSelectedNote(null);
          setDeleteError('');
        }} 
        onConfirm={handleDeleteConfirm} 
      >
        {deleteError && <Alert message={deleteError} type="error" />}
      </DeleteModal>
    </div>
  );
};

export default Dashboard;