import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../api/authApi';
import { StickyNote } from 'lucide-react';

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signup({ name: formData.name, email: formData.email, password: formData.password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <h2 className="mb-2 text-3xl font-bold text-sidebar">Create Account</h2>
        <p className="mb-6 text-slate-500">Join us to start organizing your ideas</p>

        {error && (
          <div className="mb-6 animate-fade-in rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="signup-name" className="sr-only">Full Name</label>
            <input
              id="signup-name"
              name="name"
              type="text"
              aria-label="Full Name"
              placeholder="Full Name"
              required
              className="w-full rounded-xl border border-slate-200 p-4 outline-none transition-all focus:border-accent"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="signup-email" className="sr-only">Email Address</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              aria-label="Email Address"
              placeholder="Email Address"
              required
              className="w-full rounded-xl border border-slate-200 p-4 outline-none transition-all focus:border-accent"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="sr-only">Create Password</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              aria-label="Create Password"
              placeholder="Create Password"
              required
              className="w-full rounded-xl border border-slate-200 p-4 outline-none transition-all focus:border-accent"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="signup-confirm-password" className="sr-only">Confirm Password</label>
            <input
              id="signup-confirm-password"
              name="confirmPassword"
              type="password"
              aria-label="Confirm Password"
              placeholder="Confirm Password"
              required
              className="w-full rounded-xl border border-slate-200 p-4 outline-none transition-all focus:border-accent"
              onChange={handleChange}
            />
          </div>
          <button className="w-full rounded-xl bg-accent p-4 font-bold text-white transition-all hover:bg-accent/90 active:scale-[0.98]">
            Get Started
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-bold text-accent hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;