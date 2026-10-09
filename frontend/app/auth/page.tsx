'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  // Form states
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    
    if (!signUpName || !signUpEmail || !signUpPassword) {
      setError('Please fill in all fields to sign up.');
      return;
    }

    setLoading(true);
    try {
      // First, we can't directly check if email exists cleanly with anonymous signup,
      // but Supabase signInWithOtp or signUp can return specific errors.
      // Supabase by default will not let you sign up if email exists.
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          data: {
            name: signUpName,
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.toLowerCase().includes('already registered')) {
          setError('Account already exists. Please sign in.');
          setIsRightPanelActive(false); // Switch to sign in panel
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (data?.user && data.user.identities && data.user.identities.length === 0) {
        // Supabase returns an empty identities array if the user already exists 
        // when confirming email is disabled or enabled depending on settings.
        setError('Account already exists. Please sign in.');
        setIsRightPanelActive(false);
        return;
      }

      setSuccess('Account created successfully! Please check your email for confirmation or sign in.');
      // Clear fields
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPassword('');
      setIsRightPanelActive(false); // Switch to sign in
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!signInEmail || !signInPassword) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      // Test backend /auth/me endpoint (Assuming backend is on localhost:8000)
      try {
        const backendRes = await fetch('http://localhost:8000/auth/me', {
          headers: {
            'Authorization': `Bearer ${data.session.access_token}`
          }
        });
        if (!backendRes.ok) {
          console.warn("Backend validation failed, but Supabase login succeeded.");
        }
      } catch (err) {
        console.warn("Could not connect to backend to validate token.");
      }

      setSuccess('Signed in successfully! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const togglePanel = (toSignUp: boolean) => {
    clearMessages();
    setIsRightPanelActive(toSignUp);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#151515] font-sans selection:bg-red-500/30 overflow-hidden px-4">
      
      {/* Toast Notification Container */}
      <div className="absolute top-10 z-[200] w-full max-w-md px-4 text-center">
        {error && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-700 shadow-lg border border-red-200 transition-all">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md bg-green-100 px-4 py-3 text-green-700 shadow-lg border border-green-200 transition-all">
            <p className="text-sm font-medium">{success}</p>
          </div>
        )}
      </div>

      <div 
        className={`relative w-full max-w-[768px] h-[480px] overflow-hidden rounded-[12px] bg-white shadow-2xl transition-all duration-500 ease-in-out`}
      >
        
        {/* Sign Up Container */}
        <div 
          className={`absolute left-0 top-0 h-full w-1/2 transition-all duration-500 ease-in-out ${isRightPanelActive ? 'translate-x-full opacity-100 z-50' : 'opacity-0 z-10 pointer-events-none'}`}
        >
          <form className="flex h-full flex-col items-center justify-center bg-white px-[40px] text-center" onSubmit={handleSignUp}>
            <h1 className="m-0 text-black font-bold text-3xl tracking-tight">Create Account</h1>
            <div className="my-5 flex gap-4">
              <SocialIcon letter="G" />
              <SocialIcon letter="f" />
              <SocialIcon letter="GH" />
              <SocialIcon letter="in" />
            </div>
            <span className="mb-3 text-[12px] text-gray-500">Register with E-mail</span>
            
            <input 
              type="text" 
              placeholder="Name" 
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              className="mb-2 w-full rounded-md bg-[#eee] p-3 text-[14px] text-black border-none outline-none focus:ring-1 focus:ring-red-500 transition-shadow" 
              disabled={loading}
            />
            <input 
              type="email" 
              placeholder="Enter E-mail" 
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              className="mb-2 w-full rounded-md bg-[#eee] p-3 text-[14px] text-black border-none outline-none focus:ring-1 focus:ring-red-500 transition-shadow" 
              disabled={loading}
            />
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              className="mb-4 w-full rounded-md bg-[#eee] p-3 text-[14px] text-black border-none outline-none focus:ring-1 focus:ring-red-500 transition-shadow" 
              disabled={loading}
            />
            
            <button 
              type="submit" 
              disabled={loading}
              className="mt-2 rounded-full bg-[#e3000f] px-12 py-3 text-[12px] font-bold uppercase tracking-[1px] text-white transition-transform active:scale-95 hover:bg-red-700 shadow-md disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* Sign In Container */}
        <div 
          className={`absolute left-0 top-0 h-full w-1/2 transition-all duration-500 ease-in-out ${isRightPanelActive ? 'translate-x-full opacity-0 z-10 pointer-events-none' : 'opacity-100 z-50'}`}
        >
          <form className="flex h-full flex-col items-center justify-center bg-white px-[40px] text-center" onSubmit={handleSignIn}>
            <h1 className="m-0 text-black font-bold text-3xl tracking-tight">Sign In</h1>
            <div className="my-5 flex gap-4">
              <SocialIcon letter="G" />
              <SocialIcon letter="f" />
              <SocialIcon letter="GH" />
              <SocialIcon letter="in" />
            </div>
            <span className="mb-3 text-[12px] text-gray-500">Sign in With Email & Password</span>
            
            <input 
              type="email" 
              placeholder="Enter E-mail" 
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              className="mb-2 w-full rounded-md bg-[#eee] p-3 text-[14px] text-black border-none outline-none focus:ring-1 focus:ring-red-500 transition-shadow" 
              disabled={loading}
            />
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              className="mb-2 w-full rounded-md bg-[#eee] p-3 text-[14px] text-black border-none outline-none focus:ring-1 focus:ring-red-500 transition-shadow" 
              disabled={loading}
            />
            
            <button type="button" onClick={() => setError('Password recovery not implemented yet')} className="my-3 text-[13px] text-gray-500 decoration-none hover:text-black hover:underline cursor-pointer bg-transparent border-none p-0">
              Forget Password?
            </button>
            
            <button 
              type="submit" 
              disabled={loading}
              className="mt-2 rounded-full bg-[#e3000f] px-12 py-3 text-[12px] font-bold uppercase tracking-[1px] text-white transition-transform active:scale-95 hover:bg-red-700 shadow-md disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Overlay Container */}
        <div 
          className={`absolute left-1/2 top-0 h-full w-1/2 overflow-hidden transition-transform duration-500 ease-in-out z-[100] ${isRightPanelActive ? '-translate-x-full' : ''}`}
        >
          <div 
            className={`relative -left-full h-full w-[200%] bg-[#e3000f] text-white transition-transform duration-500 ease-in-out ${isRightPanelActive ? 'translate-x-1/2' : 'translate-x-0'}`}
          >
            
            {/* Overlay Left (Sign In Trigger) */}
            <div 
              className={`absolute top-0 flex h-full w-1/2 flex-col items-center justify-center px-10 text-center transition-transform duration-500 ease-in-out ${isRightPanelActive ? 'translate-x-0' : '-translate-x-[20%]'}`}
            >
              <h1 className="m-0 font-bold text-3xl tracking-tight text-white drop-shadow-sm">Welcome To<br/>PALS</h1>
              <p className="my-6 text-[14px] font-light leading-5 tracking-[0.5px] text-[rgba(255,255,255,0.9)]">Already have an account? Sign in With Email & Password</p>
              <button 
                type="button" 
                onClick={() => togglePanel(false)}
                className="rounded-full border border-white bg-transparent px-12 py-3 text-[12px] font-bold uppercase tracking-[1px] text-white transition-all active:scale-95 hover:bg-white hover:text-[#e3000f]"
              >
                Sign In
              </button>
            </div>

            {/* Overlay Right (Sign Up Trigger) */}
            <div 
              className={`absolute right-0 top-0 flex h-full w-1/2 flex-col items-center justify-center px-10 text-center transition-transform duration-500 ease-in-out ${isRightPanelActive ? 'translate-x-[20%]' : 'translate-x-0'}`}
            >
              <h1 className="m-0 font-bold text-3xl tracking-tight text-white drop-shadow-sm">Hello World</h1>
              <p className="my-6 text-[14px] font-light leading-5 tracking-[0.5px] text-[rgba(255,255,255,0.9)]">Sign up now and enjoy our site</p>
              <button 
                type="button" 
                onClick={() => togglePanel(true)}
                className="rounded-full border border-white bg-transparent px-12 py-3 text-[12px] font-bold uppercase tracking-[1px] text-white transition-all active:scale-95 hover:bg-white hover:text-[#e3000f]"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      <Link href="/" className="mt-8 text-sm text-gray-400 hover:text-white underline transition-colors">← Back to Home</Link>
    </div>
  );
}

function SocialIcon({ letter }: { letter: string }) {
  return (
    <button 
      type="button" 
      onClick={(e) => { e.preventDefault(); alert('Social authentication is not configured yet.'); }}
      className="flex h-10 w-10 items-center justify-center rounded-md border border-[#dddddd] text-black text-[15px] font-semibold transition-colors hover:bg-gray-100 hover:border-gray-300 opacity-60 cursor-not-allowed"
      title="Not configured"
    >
      {letter}
    </button>
  );
}
