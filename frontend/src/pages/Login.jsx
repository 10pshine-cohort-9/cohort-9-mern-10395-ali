import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import { StickyNote } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await login({ email, password });
      loginUser(data.data.user);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface p-4">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/20">
          <StickyNote size={28} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-sidebar">Notes Space</h1>
      </div>

      <div className="w-full max-w-md rounded-3xl bg-white p-6 md:p-10 card-shadow">
        <h2 className="mb-2 text-3xl font-bold text-sidebar">Sign In</h2>
        <p className="mb-6 text-slate-500">Enter your details to access your dashboard</p>

        {error && (
          <div className="mb-6 animate-fade-in rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            aria-label="Email Address"
            placeholder="Email Address"
            required
            className="w-full rounded-xl border border-slate-200 p-4 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            aria-label="Password"
            placeholder="Password"
            required
            className="w-full rounded-xl border border-slate-200 p-4 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full rounded-xl bg-accent p-4 font-bold text-white transition-all hover:bg-accent/90 active:scale-[0.98]">
            Sign In
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/signup" className="font-bold text-accent hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;