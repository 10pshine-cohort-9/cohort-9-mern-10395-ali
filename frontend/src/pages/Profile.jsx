import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';
import { ChevronLeft, User, Mail, Calendar, LogOut, Check, Edit2 } from 'lucide-react';
import Loader from '../components/Loader';
import Alert from '../components/Alert';

const Profile = () => {
  const { profile, loading, error, fetchProfile, editProfile } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) setNewName(profile.name);
  }, [profile]);

  const handleUpdate = async () => {
    const success = await editProfile(newName);
    if (success) setIsEditing(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-surface p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-sidebar transition-colors">
          <ChevronLeft size={20} /> Back to Space
        </button>

        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 md:p-12">
          <div className="mb-10 flex flex-col items-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-accent text-3xl font-black text-white shadow-xl shadow-accent/20">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold text-sidebar">User Profile</h1>
          </div>

          {error && <Alert message={error} />}

          <div className="space-y-8">
            <div className="group flex items-center justify-between border-b border-slate-50 pb-6">
              <div className="flex items-center gap-4">
                <User className="text-slate-300" size={20} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name</p>
                  {isEditing ? (
                    <input 
                      className="mt-1 font-bold text-sidebar outline-none ring-2 ring-accent/10 rounded px-2"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <p className="font-bold text-sidebar">{profile?.name}</p>
                  )}
                </div>
              </div>
              <button 
                onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
                className="rounded-lg p-2 text-slate-300 hover:bg-slate-50 hover:text-accent transition-all"
              >
                {isEditing ? <Check size={18} /> : <Edit2 size={18} />}
              </button>
            </div>

            <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
              <Mail className="text-slate-300" size={20} />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</p>
                <p className="font-bold text-sidebar">{profile?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
              <Calendar className="text-slate-300" size={20} />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Member Since</p>
                <p className="font-bold text-sidebar">{profile?.created_at && new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="mt-12 flex w-full items-center justify-center gap-3 rounded-2xl bg-red-50 py-4 font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;