'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Link as LinkIcon, ExternalLink, Code, FileText, Database, Globe } from 'lucide-react';

interface ExtractedLink {
  id: string;
  url: string;
  title: string | null;
  platform_type: string | null;
  shared_by: string | null;
  created_at: string;
}

const getPlatformIcon = (platform: string | null) => {
  const type = platform?.toLowerCase() || '';
  if (type.includes('github')) return <Code size={18} />;
  if (type.includes('drive') || type.includes('doc')) return <FileText size={18} />;
  if (type.includes('notion') || type.includes('database')) return <Database size={18} />;
  return <Globe size={18} />;
};

export default function ExtractedMediaPage() {
  const supabase = createClient();
  const [links, setLinks] = useState<ExtractedLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    const { data, error } = await supabase
      .from('extracted_links')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching links:', error);
    } else {
      setLinks(data || []);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col p-8 md:p-12 mx-auto w-full min-h-screen font-sans bg-gray-50 dark:bg-[#0D1117] transition-colors duration-300">
      <div className="max-w-[1200px] w-full mx-auto flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2 text-gray-900 dark:text-white flex items-center gap-3">
            Extracted Media
          </h1>
          <p className="font-mono text-[#10B981] text-sm uppercase tracking-widest">
            Resources. Indexed and retrievable.
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shrink-0">
              <LinkIcon size={18} />
            </div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">All Shared Links</h2>
          </div>

          {isLoading ? (
            <div className="animate-pulse flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-100 dark:bg-[#0D1117] rounded-2xl w-full"></div>
              ))}
            </div>
          ) : links.length === 0 ? (
            <div className="border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <LinkIcon size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">No links extracted yet.</p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">Upload a chat log on the dashboard to populate this vault.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {links.map((link) => (
                <a 
                  key={link.id} 
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col p-5 bg-gray-50 dark:bg-[#0D1117] border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-[#10B981]/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400 dark:text-gray-500 group-hover:text-[#10B981] transition-colors">
                        {getPlatformIcon(link.platform_type)}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-[1px] text-gray-500 dark:text-gray-400 group-hover:text-[#10B981] transition-colors">
                        {link.platform_type || 'Web Link'}
                      </span>
                    </div>
                    <ExternalLink size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4 line-clamp-2 leading-relaxed">
                    {link.title || link.url}
                  </h3>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800/60">
                    <span className="font-mono text-[10px] text-gray-500 dark:text-gray-500 truncate mr-4">
                      {link.url}
                    </span>
                    {link.shared_by && (
                      <div className="flex items-center gap-2 shrink-0 bg-white dark:bg-[#161B22] px-2 py-1 rounded-md border border-gray-200 dark:border-gray-800">
                        <span className="text-[10px] text-gray-600 dark:text-gray-400">by <span className="text-gray-900 dark:text-gray-200 font-medium">{link.shared_by}</span></span>
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
