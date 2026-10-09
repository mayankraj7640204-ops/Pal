'use client';
import { useEffect, useState } from 'react';
import { createClient } from '../../utils/supabase/client';
import { Plus, Droplet, Activity, Sparkles, ArrowRight, Calendar as CalendarIcon, ChevronLeft, ChevronRight, MessageCircle, Apple } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const userName = user?.user_metadata?.name || 'User';
  const firstName = userName.split(' ')[0];

  return (
    <div className="flex flex-col p-8 md:p-12 max-w-[1200px] mx-auto w-full transition-colors duration-300">
      
      {/* Header Section */}
      <div className="flex items-start justify-between w-full mb-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-gray-500">Sunday, October 4</span>
            <div className="flex gap-1">
              <HeartIcon small />
              <div className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-[#111]">
                <span className="text-[8px] text-gray-600 dark:text-gray-400">2</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-3 flex items-center gap-3 text-gray-900 dark:text-white transition-colors duration-300">
            A little check-in, {firstName} <Sparkles size={28} className="text-gray-500" strokeWidth={1} />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Your cycle is part of your story. Let's see where you are today.</p>
        </div>

        <button className="hidden md:flex items-center gap-2 bg-[#780014] hover:bg-[#e3000f] transition-colors text-white px-5 py-3 rounded-xl font-medium text-sm">
          <Plus size={18} /> Log your cycle
        </button>
      </div>

      {/* Main Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        
        {/* Left Card: Period Phase */}
        <div className="lg:col-span-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl p-8 flex flex-col relative overflow-hidden transition-colors duration-300 shadow-sm dark:shadow-none">
          {/* Subtle gradient background decoration */}
          <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#780014] blur-[120px] opacity-10 dark:opacity-20 pointer-events-none"></div>

          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-gray-500 mb-1 block">Your cycle, today</span>
              <h2 className="text-2xl font-medium text-gray-900 dark:text-white">Period phase</h2>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] px-3 py-1.5 rounded-full transition-colors duration-300">
              <div className="w-2 h-2 rounded-full bg-[#e3000f]"></div>
              <span className="text-xs font-medium text-gray-900 dark:text-white">Period</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-12 relative z-10">
            {/* Circular Progress (Static representation) */}
            <div className="relative w-48 h-48 rounded-full border-4 border-gray-100 dark:border-[#222] flex flex-col items-center justify-center shrink-0 transition-colors duration-300">
              {/* Fake active progress arch */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle cx="96" cy="96" r="94" fill="none" stroke="#780014" strokeWidth="4" strokeDasharray="590" strokeDashoffset="450" className="opacity-80" />
              </svg>
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-black border-2 border-[#780014] rounded-full transition-colors duration-300"></div>
              
              <span className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">Day</span>
              <span className="text-5xl font-serif text-gray-900 dark:text-white">4</span>
              <span className="text-[10px] text-gray-500 mt-2">of your cycle</span>
            </div>

            {/* Cycle Stats */}
            <div className="flex flex-col gap-6 w-full">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#222] flex items-center justify-center text-[#e3000f] transition-colors duration-300">
                  <Droplet size={20} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Next period in</span>
                  <div className="flex items-baseline gap-2 text-gray-900 dark:text-white">
                    <span className="font-medium text-lg">23 days</span>
                    <span className="text-xs text-gray-500 dark:text-gray-600">| Oct 27</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#222] flex items-center justify-center text-blue-500 dark:text-blue-400 transition-colors duration-300">
                  <Activity size={20} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Average cycle</span>
                  <span className="font-medium text-lg text-gray-900 dark:text-white">26 days</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#222] flex items-center justify-center text-purple-500 dark:text-purple-400 transition-colors duration-300">
                  <Activity size={20} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Last period</span>
                  <span className="font-medium text-lg text-gray-900 dark:text-white">Oct 1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-10 flex gap-4 text-[10px] uppercase tracking-wider font-medium text-gray-500 relative z-10">
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#780014]"></div> Period</div>
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-900"></div> Follicular</div>
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500 dark:bg-yellow-900"></div> Ovulation</div>
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-900"></div> Luteal</div>
          </div>
        </div>

        {/* Right Card: Calendar */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl p-8 flex flex-col transition-colors duration-300 shadow-sm dark:shadow-none">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-gray-500 mb-1 block">Your rhythm</span>
              <h2 className="text-xl font-medium text-gray-900 dark:text-white">October 2026</h2>
            </div>
            <CalendarIcon size={20} className="text-gray-500" />
          </div>

          <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-xs w-full mt-2 flex-1 content-start">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-gray-500 dark:text-gray-600 font-medium pb-2">{d}</div>
            ))}
            
            {/* Empty slots for start of month */}
            <div></div><div></div><div></div>
            
            {/* Days 1-4 with Period marking */}
            {[1, 2, 3, 4].map(d => (
              <div key={d} className="flex justify-center items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-medium ${d === 4 ? 'bg-[#780014] text-white' : 'text-red-700 dark:text-[#e3000f] bg-red-50 dark:bg-[#2a080c]'}`}>
                  {d}
                </div>
              </div>
            ))}
            
            {/* Days 5-31 Normal */}
            {Array.from({length: 27}, (_, i) => i + 5).map(d => (
              <div key={d} className="flex justify-center items-center text-gray-700 dark:text-gray-400">
                <div className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#222] cursor-pointer transition-colors">
                  {d}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-[#222] flex gap-4 text-[10px] uppercase tracking-wider font-medium text-gray-500 transition-colors duration-300">
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full border border-gray-400 dark:border-gray-500"></div> Period days</div>
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full border-2 border-gray-800 dark:border-gray-400"></div> Today</div>
          </div>
        </div>
      </div>

      {/* Alert Card */}
      <div className="bg-yellow-50 dark:bg-[#1a1500] border border-yellow-200 dark:border-[#332b00] rounded-2xl p-5 mb-8 flex items-start gap-4 cursor-pointer hover:bg-yellow-100 dark:hover:bg-[#221c00] transition-colors group shadow-sm dark:shadow-none">
        <div className="mt-1 text-yellow-600 dark:text-yellow-500">
          <Sparkles size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-500 mb-1">Your cycles have been irregular recently.</h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-700/80 mb-3">Irregular periods can have many causes. PCOS is one possible cause. Would you like to check your PCOS awareness assessment?</p>
          <div className="flex items-center gap-2 text-sm font-medium text-yellow-700 dark:text-yellow-500 group-hover:gap-3 transition-all">
            Take the PCOS Awareness Check <ArrowRight size={16} />
          </div>
        </div>
        <button className="text-yellow-500 hover:text-yellow-700 dark:text-yellow-700/50 dark:hover:text-yellow-500 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      {/* Bottom Guidance Section */}
      <div className="flex flex-col">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-gray-500 mb-2 block">A question on your mind?</span>
            <h2 className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-white">Need a little guidance?</h2>
          </div>
          <button className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            Ask PALS
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl p-6 flex items-start gap-4 hover:border-gray-400 dark:hover:border-gray-700 cursor-pointer transition-colors shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-[#1a0a1a] text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 transition-colors duration-300">
              <MessageCircle size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-gray-500 mb-1 block">Ask PALS</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">Got a question about your cycle, symptoms, or health? Ask our AI assistant for personalized insights.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl p-6 flex items-start gap-4 hover:border-gray-400 dark:hover:border-gray-700 cursor-pointer transition-colors shadow-sm dark:shadow-none">
            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-[#0a1a0f] text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 transition-colors duration-300">
              <Apple size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-gray-500 mb-1 block">Nourishment, not rules</span>
              <p className="text-sm text-gray-600 dark:text-gray-300">Discover which foods support your body best during your current cycle phase.</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

function HeartIcon({ small = false }: { small?: boolean }) {
  return (
    <svg width={small ? "16" : "24"} height={small ? "16" : "24"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-600">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
  );
}
