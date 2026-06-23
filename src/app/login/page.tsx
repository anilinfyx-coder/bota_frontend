"use client";
import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLoginMutation } from '@/services/api';
import { useAppDispatch } from '@/lib/hooks';
import { setCredentials } from '@/features/auth/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: data.user, token: data.token }));
      if (data.user.role === 'super_admin') router.push('/admin');
      else if (data.user.role === 'customer') router.push('/customer/dashboard');
      else router.push('/business');
    } catch {
      // error shown via RTK error state
    }
  };

  const errorMessage = error
    ? ('data' in error ? (error.data as any)?.error : 'Network error. Please try again.')
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-panel max-w-md w-full p-8 rounded-2xl border border-border shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-rose-600 p-3 rounded-xl logo-box">
            <Lock size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-foreground mb-2">Welcome Back</h2>
        <p className="text-center text-muted-foreground mb-8">Sign in to your Book My Bota dashboard</p>

        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-lg mb-6 text-sm text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="admin@reserve.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" disabled={isLoading} className="w-full btn-primary mt-6">
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/register" className="text-rose-500 hover:text-rose-400">Sign up</Link>
        </p>
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Super Admin default: admin@reserve.com / superadmin123</p>
        </div>
      </div>
    </div>
  );
}
