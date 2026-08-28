import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';
import { ChevronLeft, User, Mail, LogOut } from 'lucide-react';
import Loader from '../components/Loader';
import Alert from '../components/Alert';

const Profile = () => {
  const { profile, loading, error, fetchProfile } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-surface p-4 md:p-8">
      <div className="mx-auto max-w-2xl text-slate-800">
        <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-2 text-slate-600 hover:text-sidebar font-bold transition-colors">
          <ChevronLeft size={20} /> Back to Space
        </button>

        <div className="rounded-3xl bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200 md:p-12 border border-slate-100">
          <div className="mb-10 flex flex-col items-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-accent text-3xl font-black text-white shadow-xl shadow-accent/20">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl font-black text-sidebar">User Profile</h1>
            <p className="text-slate-600 text-sm font-medium mt-1">Manage your identity and session</p>
          </div>

          {error && <Alert message={error} />}

          <div className="space-y-8">
            <div className="flex items-center gap-4 border-b border-slate-200/50 pb-6">
              <User className="text-slate-400" size={20} />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Full Name</p>
                <p className="mt-1 font-bold text-sidebar text-lg">{profile?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pb-2">
              <Mail className="text-slate-400" size={20} />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Email Address</p>
                <p className="mt-1 font-bold text-sidebar text-lg">{profile?.email}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="mt-12 flex w-full items-center justify-center gap-3 rounded-2xl bg-red-50 py-4 font-black text-red-600 transition-all hover:bg-red-600 hover:text-white shadow-sm border border-red-100 active:scale-[0.98]"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;