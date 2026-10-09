'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import Link from 'next/link';
import { 
  Sun, Moon, Calendar, MessageCircle, Link as LinkIcon, Lock, Database, LayoutDashboard, Search,
  Settings, User as UserIcon, ShieldCheck, ChevronRight, Menu, LogOut 
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/auth');
      } else if (!session.user.user_metadata?.has_profile) {
        router.push('/onboarding');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.push('/auth');
        } else if (!session.user.user_metadata?.has_profile) {
          router.push('/onboarding');
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);



  return (
    <div className="flex min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white font-sans overflow-x-hidden transition-colors duration-300">
      
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 z-40 h-screen w-[260px] border-r border-gray-200 dark:border-[#222] bg-gray-50 dark:bg-[#0a0a0a] transition-all duration-300 flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and Close button */}
        <div className="flex h-20 items-center justify-between px-6 pt-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#10B981] text-[#0D1117] font-bold tracking-tight">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight leading-tight">SAAR.</span>
              <span className="text-[9px] uppercase tracking-wider text-gray-500">Local Intelligence.</span>
            </div>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 dark:text-gray-500">Your Space</h3>
          </div>
          
          <nav className="flex flex-col gap-1">
            <NavItem href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active={pathname === '/dashboard'} />
            <NavItem href="/dashboard/ask" icon={<MessageCircle size={18} />} label="Ask SAAR" active={pathname === '/dashboard/ask'} />
            <NavItem href="/dashboard/action-matrix" icon={<Calendar size={18} />} label="Action Matrix" active={pathname === '/dashboard/action-matrix'} />
            <NavItem href="/dashboard/extracted-media" icon={<LinkIcon size={18} />} label="Extracted Media" active={pathname === '/dashboard/extracted-media'} />
            <NavItem href="/dashboard/vault" icon={<Database size={18} />} label="Local Vault" active={pathname === '/dashboard/vault'} />
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="px-4 pb-6">
          {/* Privacy Badge */}
          <div className="mb-6 rounded-xl bg-gray-100 dark:bg-[#161616] p-4 flex gap-3 border border-gray-200 dark:border-[#222]">
            <ShieldCheck size={18} className="text-[#10B981] mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-gray-800 dark:text-gray-200">Zero-Cloud Privacy.</span>
              <span className="text-[10px] text-gray-500 mt-1">Your chats never leave this device.</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1 mb-4">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="group flex items-center justify-between rounded-xl px-4 py-3 transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#161616] hover:text-gray-900 dark:hover:text-gray-200"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-300">
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </span>
                <span className="text-[14px]">Switch to {theme === 'dark' ? 'Light' : 'Dark'} mode</span>
              </div>
            </button>
            <NavItem href="/dashboard/settings" icon={<Settings size={18} />} label="Settings" active={pathname === '/dashboard/settings'} />
          </nav>

          {/* User Profile Summary & Logout */}
          <div className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors group">
            <Link href="/onboarding" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 dark:border-transparent overflow-hidden">
                {user?.user_metadata?.avatar_seed ? (
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.user_metadata.avatar_seed}&backgroundColor=ffffff`} className="w-full h-full" alt="User Avatar" />
                ) : (
                  <span className="text-[#e3000f] font-semibold text-sm">{user?.user_metadata?.name?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-gray-900 dark:text-white">{user?.user_metadata?.name || 'User'}</span>
                <span className="text-[11px] text-gray-500">Admin / Local Node</span>
              </div>
            </Link>
            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/');
              }}
              title="Log Out"
              className="p-2 text-gray-500 hover:text-[#e3000f] hover:bg-gray-200 dark:hover:bg-[#222] rounded-md transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`flex-1 min-h-screen bg-white dark:bg-[#050505] transition-all duration-300 relative ${
          isSidebarOpen ? 'ml-[260px]' : 'ml-0'
        }`}
      >
        {!isSidebarOpen && (
          <div className="absolute top-6 left-6 z-50">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#222] p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        )}
        
        {children}

        {(loading || !user) && (
          <div className="absolute inset-0 z-50 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-sm flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 rounded-full border-2 border-[#e3000f] border-t-transparent animate-spin"></div>
          </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active, notification }: { href: string, icon: React.ReactNode, label: string, active?: boolean, notification?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`group flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${
        active 
          ? 'bg-emerald-50 dark:bg-[#10B981]/20 text-[#10B981] font-medium' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#161616] hover:text-gray-900 dark:hover:text-gray-200'
      }`}
    >
      <div className="flex items-center gap-4">
        <span className={`${active ? 'text-[#10B981]' : 'text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-300'}`}>{icon}</span>
        <span className="text-[14px]">{label}</span>
      </div>
      {notification && (
        <div className="h-1.5 w-1.5 rounded-full bg-[#10B981]"></div>
      )}
    </Link>
  );
}
