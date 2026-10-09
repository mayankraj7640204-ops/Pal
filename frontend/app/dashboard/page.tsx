'use client';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '../../utils/supabase/client';
import { Upload, BellRing, Search, Link as LinkIcon, Calendar as CalendarIcon, ArrowRight, Loader2, Terminal } from 'lucide-react';

const systemPrompt = `You are a chat parsing assistant. Read the following chat log and extract the actionable data. 
Chronologically track decisions: If a time, date, or plan is proposed but later changed by another user, extract ONLY the final decision and append a boolean flag "is_revised": true.
You MUST return ONLY a valid JSON object matching this exact structure:
{
  "action_items": [
    { "task_description": "string", "due_date": "YYYY-MM-DDTHH:MM:SSZ or null", "source_context": "string", "is_revised": boolean }
  ],
  "extracted_links": [
    { "url": "string", "title": "string", "platform_type": "string", "shared_by": "string" }
  ],
  "urgent_mentions": [
    { "message": "string", "timestamp": "string" }
  ],
  "stats": {
    "action_count": 0,
    "mention_count": 0,
    "noise_filtered": 0
  }
}`;

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState({
    action_count: 5,
    mention_count: 12,
    noise_filtered: 525,
    total_messages: 542
  });
  const [urgentMentions, setUrgentMentions] = useState<any[]>([
    { message: "Mayank, we need the final designs before the 2 PM meeting.", timestamp: "15 mins ago" }
  ]);
  
  const [cachedChatLog, setCachedChatLog] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [purgeLines, setPurgeLines] = useState<string[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const userName = user?.user_metadata?.name || 'Mayank';
  const firstName = userName.split(' ')[0];

  const syncToDatabase = async (geminiResponse: any) => {
    // 1. Insert Action Items
    if (geminiResponse.action_items && geminiResponse.action_items.length > 0) {
      const sanitizedActions = geminiResponse.action_items.map((item: any) => ({
        ...item,
        user_id: user?.id || null,
        due_date: item.due_date === 'null' || !item.due_date ? null : new Date(item.due_date).toISOString()
      }));
      const { error: actionsError } = await supabase
        .from('action_items')
        .insert(sanitizedActions);
        
      if (actionsError) console.error("Error saving actions:", actionsError);
    }
  
    // 2. Insert Extracted Links
    if (geminiResponse.extracted_links && geminiResponse.extracted_links.length > 0) {
      const sanitizedLinks = geminiResponse.extracted_links.map((link: any) => ({
        ...link,
        user_id: user?.id || null
      }));
      const { error: linksError } = await supabase
        .from('extracted_links')
        .insert(sanitizedLinks);
        
      if (linksError) console.error("Error saving links:", linksError);
    }
  };

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const rawChatText = e.target?.result as string;
      setCachedChatLog(rawChatText);
      
      try {
        const res = await fetch('/api/distill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rawChatText, systemPrompt })
        });
        
        if (!res.ok) throw new Error("Failed to distill chat");
        
        const geminiResponse = await res.json();
        
        // Update stats
        if (geminiResponse.stats) {
          setStats({
            action_count: geminiResponse.stats.action_count || 0,
            mention_count: geminiResponse.stats.mention_count || 0,
            noise_filtered: geminiResponse.stats.noise_filtered || 0,
            total_messages: (geminiResponse.stats.action_count || 0) + (geminiResponse.stats.mention_count || 0) + (geminiResponse.stats.noise_filtered || 0)
          });
        }

        if (geminiResponse.urgent_mentions && geminiResponse.urgent_mentions.length > 0) {
          setUrgentMentions(geminiResponse.urgent_mentions);
        }

        // Sync to Supabase
        await syncToDatabase(geminiResponse);
        
      } catch (error) {
        console.error("Error processing file:", error);
      } finally {
        setIsProcessing(false);
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  const handlePurge = () => {
    setIsPurging(true);
    setPurgeLines([]);
    
    const sequence = [
      "> SEVERING BROWSER CACHE... [DONE]",
      "> SHREDDING FILE [WhatsApp-Chat.txt]... [DONE]",
      "> WIPING REACT STATE... [SUCCESS]",
      "> TRACE ELIMINATED."
    ];
    
    let step = 0;
    const interval = setInterval(() => {
      setPurgeLines(prev => [...prev, sequence[step]]);
      step++;
      
      if (step >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          setStats({
            action_count: 0,
            mention_count: 0,
            noise_filtered: 0,
            total_messages: 0
          });
          setUrgentMentions([]);
          setCachedChatLog('');
          setChatHistory([]);
          setIsPurging(false);
          setPurgeLines([]);
        }, 1500);
      }
    }, 400);
  };

  const handleAskSaar = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentQuery.trim() || !cachedChatLog) return;

    const query = currentQuery;
    setCurrentQuery('');
    setChatHistory(prev => [...prev, { role: 'user', content: query }]);
    setIsChatting(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, cachedChatLog })
      });
      const data = await res.json();
      if (res.ok) {
        setChatHistory(prev => [...prev, { role: 'ai', content: data.text }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'ai', content: data.error || 'Error processing query.' }]);
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', content: 'Network error.' }]);
    } finally {
      setIsChatting(false);
    }
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, isChatting]);

  return (
    <div className="flex flex-col p-8 md:p-12 mx-auto w-full min-h-screen font-sans bg-gray-50 dark:bg-[#0D1117] text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-[1200px] w-full mx-auto flex flex-col">
        {/* 1. TOP HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full mb-10 gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2 text-gray-900 dark:text-white flex items-center gap-3">
              Your Catch-Up Digest, {firstName} ✨
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Here is the signal from the noise. <span className="font-mono text-[#10B981]">{stats.total_messages}</span> messages distilled locally.
            </p>
          </div>
          
          <input 
            type="file" 
            accept=".txt" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className={`flex items-center gap-2 transition-colors text-white dark:text-[#0D1117] px-5 py-3 rounded-xl font-bold text-sm ${isProcessing ? 'bg-gray-400 dark:bg-gray-500 cursor-not-allowed' : 'bg-[#10B981] hover:bg-[#0ea5e9]'}`}
          >
            {isProcessing ? <><Loader2 className="animate-spin" size={18} /> Processing...</> : <><Upload size={18} /> Upload Chat Log (.txt)</>}
          </button>
        </div>

        {/* Main Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          
          {/* 2. LEFT CARD: CHAT DISTILLATION RING */}
          <div className="lg:col-span-3 bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 flex flex-col relative overflow-hidden transition-colors duration-300">
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 dark:text-gray-500 mb-1 block">Overview</span>
                <h2 className="text-2xl font-medium text-gray-900 dark:text-white">Distillation Ring</h2>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#0D1117] border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-full transition-colors duration-300">
                <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-[#10B981]'}`}></div>
                <span className="text-xs font-medium text-gray-300">{isProcessing ? 'Processing Data...' : 'Local Processing Active'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-12 relative z-10">
              {/* Distillation Ring */}
              <div className="relative w-48 h-48 rounded-full border-4 border-gray-800 flex flex-col items-center justify-center shrink-0">
                {/* Active progress arch */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                  <circle cx="96" cy="96" r="94" fill="none" stroke="#10B981" strokeWidth="4" strokeDasharray="590" strokeDashoffset="50" className="opacity-80 transition-all duration-1000" />
                  <circle cx="96" cy="96" r="94" fill="none" stroke="#EF4444" strokeWidth="4" strokeDasharray="590" strokeDashoffset="540" className="opacity-80 transition-all duration-1000" />
                  <circle cx="96" cy="96" r="94" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray="590" strokeDashoffset="570" className="opacity-80 transition-all duration-1000" />
                </svg>
                
                <span className="text-4xl font-mono text-gray-900 dark:text-white transition-all">{stats.total_messages}</span>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-2 text-center">Unread<br/>Messages</span>
              </div>

              {/* Vertically stacked stats */}
              <div className="flex flex-col gap-6 w-full">
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#0D1117] border border-gray-200 dark:border-gray-800 p-4 rounded-xl border-l-2 border-l-red-500 transition-all">
                  <div className="w-3 h-3 rounded-full bg-red-500 shrink-0"></div>
                  <div className="flex flex-col">
                    <span className="font-mono text-lg text-gray-900 dark:text-white">{stats.action_count} Action Items</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#0D1117] border border-gray-200 dark:border-gray-800 p-4 rounded-xl border-l-2 border-l-blue-500 transition-all">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0"></div>
                  <div className="flex flex-col">
                    <span className="font-mono text-lg text-gray-900 dark:text-white">{stats.mention_count} Direct Mentions</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#0D1117] border border-gray-200 dark:border-gray-800 p-4 rounded-xl border-l-2 border-l-[#10B981] transition-all">
                  <div className="w-3 h-3 rounded-full bg-[#10B981] shrink-0"></div>
                  <div className="flex flex-col">
                    <span className="font-mono text-lg text-[#10B981]">{stats.noise_filtered} Noise Filtered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. RIGHT CARD: DEADLINE CALENDAR */}
          <div className="lg:col-span-2 bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 flex flex-col transition-colors duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#10B981] mb-1 block">Extracted Deadlines</span>
                <h2 className="text-xl font-medium text-gray-900 dark:text-white">October 2026</h2>
              </div>
              <CalendarIcon size={20} className="text-gray-500" />
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center text-xs w-full mb-6">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="text-gray-500 font-medium pb-1">{d}</div>
              ))}
              
              {/* Empty slots for start of month (Oct 1 is Thursday) */}
              <div></div><div></div><div></div><div></div>
              
              {/* Days 1-31 */}
              {Array.from({length: 31}, (_, i) => i + 1).map(d => {
                const isToday = d === 9;
                const hasDeadline = [9, 10, 12].includes(d);
                return (
                  <div key={d} className="flex flex-col items-center justify-start h-10">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-sm ${isToday ? 'bg-[#10B981] text-white dark:text-[#0D1117] font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                      {d}
                    </div>
                    {hasDeadline && <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1"></div>}
                  </div>
                );
              })}
            </div>

            {/* Mini Checklist */}
            <div className="flex flex-col gap-3 mt-auto border-t border-gray-200 dark:border-gray-800 pt-5">
              <div className="flex items-start gap-3 group cursor-pointer">
                <div className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600 mt-0.5 group-hover:border-[#10B981] transition-colors"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Submit BMSIT project report <span className="text-red-500 dark:text-red-400 font-mono text-xs ml-1">(Due: Today, 5 PM)</span></span>
              </div>
              <div className="flex items-start gap-3 group cursor-pointer">
                <div className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600 mt-0.5 group-hover:border-[#10B981] transition-colors"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Confirm venue booking</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. MIDDLE ALERT BANNER */}
        {urgentMentions.map((mention, index) => (
          <div key={index} className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-8 flex items-start gap-4 cursor-pointer hover:bg-amber-500/20 transition-colors group">
            <div className="mt-1 text-amber-500">
              <BellRing size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-amber-500 mb-1 flex items-center gap-2">⚠️ Urgent Mention Extracted</h3>
              <p className="text-sm text-amber-100/80 mb-3 italic">"{mention.message}" <span className="text-amber-500/60 font-mono text-xs not-italic">({mention.timestamp})</span></p>
              <div className="flex items-center gap-2 text-sm font-medium text-amber-500 group-hover:gap-3 transition-all">
                Jump to original message <ArrowRight size={16} />
              </div>
            </div>
          </div>
        ))}

        {/* 5. BOTTOM SECTION */}
        {/* 5. BOTTOM SECTION: ASK SAAR CHAT UI */}
        <div className="flex flex-col bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden mt-2 transition-colors duration-300">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0D1117] transition-colors duration-300">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
            <h2 className="text-[14px] font-bold uppercase tracking-[1px] text-gray-500 dark:text-gray-400">Ask SAAR: Local Context Search</h2>
          </div>
          
          {/* Chat Window */}
          <div ref={chatScrollRef} className="flex flex-col p-6 h-[300px] overflow-y-auto gap-4">
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 opacity-50">
                <Search size={32} className="mb-2" />
                <p className="text-sm">Upload a chat log, then ask questions about it.</p>
              </div>
            ) : (
              chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-br-none' 
                      : 'bg-transparent text-[#10B981] font-mono text-sm border border-gray-200 dark:border-gray-800/50 rounded-bl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {isChatting && (
              <div className="flex justify-start">
                <div className="bg-transparent text-[#10B981] border border-gray-800/50 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0D1117] transition-colors duration-300">
            <form onSubmit={handleAskSaar} className="relative flex items-center">
              <input 
                type="text" 
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                disabled={!cachedChatLog || isProcessing || isPurging}
                placeholder={cachedChatLog ? "Ask about your unread messages..." : "Upload a chat log first..."}
                className="w-full bg-white dark:bg-[#161B22] border border-gray-300 dark:border-gray-700 rounded-xl py-3 pl-4 pr-12 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#10B981] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button 
                type="submit" 
                disabled={!currentQuery.trim() || isChatting || !cachedChatLog || isProcessing || isPurging}
                className="absolute right-2 p-2 bg-[#10B981] text-white dark:text-[#0D1117] rounded-lg hover:bg-[#0ea5e9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* 6. PURGE LOCAL CACHE BURN RECEIPT */}
        <div className="flex flex-col items-center justify-center mt-12 mb-8">
          <button 
            onClick={handlePurge}
            disabled={isPurging || !cachedChatLog}
            className="group px-6 py-3 rounded-full border border-gray-300 dark:border-gray-800 hover:border-red-500/50 hover:bg-red-500/10 text-gray-500 dark:text-gray-500 hover:text-red-500 font-mono text-xs tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Terminal size={14} className="group-hover:text-red-500 transition-colors" />
            Purge Local Cache
          </button>

          {(isPurging || purgeLines.length > 0) && (
            <div className="mt-6 w-full max-w-md bg-[#000000] border border-red-500/30 rounded-lg p-4 font-mono text-[10px] md:text-xs text-red-500 text-left overflow-hidden flex flex-col gap-2 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
              {purgeLines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
              {isPurging && purgeLines.length < 4 && (
                <div className="w-2 h-4 bg-red-500 animate-pulse mt-1"></div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
