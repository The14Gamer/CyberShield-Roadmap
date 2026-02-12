
import React, { useState, useEffect } from 'react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');
  const [isLockedOut, setIsLockedOut] = useState(false);

  useEffect(() => {
    const lockoutDate = localStorage.getItem('lockout_date');
    if (lockoutDate === new Date().toDateString()) {
      setIsLockedOut(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    if (!username || !password) {
      setError('CREDENTIALS REQUIRED');
      return;
    }

    setIsAuthenticating(true);
    setError('');

    // Simulate authentication delay
    setTimeout(() => {
      onLogin(username);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] relative overflow-hidden px-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 mb-4">
            <svg className={`w-10 h-10 ${isLockedOut ? 'text-red-500' : 'text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2 mono">
            CYBERSHIELD <span className={isLockedOut ? 'text-red-500' : 'text-blue-500'}>AUTH</span>
          </h1>
          <p className="text-zinc-500 text-xs mono uppercase tracking-widest">
            {isLockedOut ? 'Quota Exceeded for Today' : 'Secure Terminal Access Required'}
          </p>
        </div>

        <form 
          onSubmit={handleLogin}
          className={`glass p-8 rounded-2xl border-t-2 shadow-2xl animate-in zoom-in-95 duration-500 ${isLockedOut ? 'border-t-red-600 opacity-60' : 'border-t-blue-500'}`}
        >
          <div className="space-y-6">
            {isLockedOut ? (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-500 border border-red-500/30 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-red-400 font-bold mono text-sm mb-2 uppercase">System Lockdown Active</h3>
                  <p className="text-zinc-500 text-[10px] leading-relaxed">
                    You have exceeded the 4-hour daily training quota. Access will be restored at 00:00 UTC. Take some rest, operator.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 mono">Operator ID</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="AGENT_00"
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-zinc-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 mono">Access Key</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-zinc-700"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-pulse">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-[10px] font-bold text-red-400 mono">{error}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isAuthenticating}
                  className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest transition-all relative overflow-hidden group ${
                    isAuthenticating 
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                  }`}
                >
                  <span className={isAuthenticating ? 'opacity-0' : 'opacity-100 group-hover:scale-105 transition-transform inline-block'}>
                    ESTABLISH CONNECTION
                  </span>
                  {isAuthenticating && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  )}
                </button>
              </>
            )}
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-zinc-600 text-[10px] mono">
            {isLockedOut ? 'TERMINAL LOCKED // RE-ESTABLISH TOMORROW' : 'RESTRICTED ACCESS // AUTHORIZED PERSONNEL ONLY'}
            <br />
            BY LOGGING IN YOU AGREE TO THE E.U.L.A.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
