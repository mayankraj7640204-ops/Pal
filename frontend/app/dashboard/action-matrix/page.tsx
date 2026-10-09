'use client';
import { useState, useEffect } from 'react';
import { Check, Clock, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface ActionTask {
  id: string;
  task_description: string;
  source_context?: string;
  is_completed: boolean;
}

const mockTasks: ActionTask[] = [
  {
    id: "1",
    task_description: "Submit BMSIT project report",
    source_context: "Origin: Falak • 10/09/26, 9:20 AM",
    is_completed: false
  },
  {
    id: "2",
    task_description: "Confirm venue booking",
    source_context: "Origin: System • 10/09/26, 11:30 AM",
    is_completed: false
  },
  {
    id: "3",
    task_description: "Send final UI designs before 2 PM",
    source_context: "Origin: Client • 10/08/26, 2:45 PM",
    is_completed: true
  }
];

export default function ActionMatrixPage() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<ActionTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('action_items')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data || []);
    }
    setIsLoading(false);
  };

  const toggleTask = async (id: string) => {
    const taskToUpdate = tasks.find(t => t.id === id);
    if (!taskToUpdate) return;
    
    // Optimistic UI update for smooth transition
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, is_completed: !task.is_completed } : task
    ));

    const { error } = await supabase
      .from('action_items')
      .update({ is_completed: !taskToUpdate.is_completed })
      .eq('id', id);
      
    if (error) {
      console.error('Error toggling task:', error);
      // Revert optimistic update on error
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, is_completed: taskToUpdate.is_completed } : task
      ));
    }
  };

  const pendingTasks = tasks.filter(t => !t.is_completed);
  const resolvedTasks = tasks.filter(t => t.is_completed);

  return (
    <div className="flex flex-col p-8 md:p-12 mx-auto w-full min-h-screen font-sans bg-gray-50 dark:bg-[#0D1117] transition-colors duration-300">
      <div className="max-w-[1200px] w-full mx-auto flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2 text-gray-900 dark:text-white flex items-center gap-3">
            Action Matrix
          </h1>
          <p className="font-mono text-[#10B981] text-sm uppercase tracking-widest">
            Distilled workflow. Securely synced.
          </p>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Pending Signals Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2 px-2">
              <Clock size={18} className="text-amber-500" />
              <h2 className="font-mono text-sm uppercase tracking-[2px] text-gray-600 dark:text-gray-400 font-bold">
                Pending Signals ({pendingTasks.length})
              </h2>
            </div>
            
            {isLoading ? (
              <div className="animate-pulse flex flex-col gap-4">
                <div className="h-32 bg-gray-200 dark:bg-[#161B22] rounded-2xl w-full"></div>
                <div className="h-32 bg-gray-200 dark:bg-[#161B22] rounded-2xl w-full"></div>
              </div>
            ) : pendingTasks.length === 0 ? (
              <div className="border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <CheckCircle2 size={32} className="text-gray-400 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">All signals resolved.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {pendingTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onToggle={() => toggleTask(task.id)} />
                ))}
              </div>
            )}
          </div>

          {/* Resolved Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2 px-2">
              <CheckCircle2 size={18} className="text-[#10B981]" />
              <h2 className="font-mono text-sm uppercase tracking-[2px] text-gray-600 dark:text-gray-400 font-bold">
                Resolved ({resolvedTasks.length})
              </h2>
            </div>

            {isLoading ? (
              <div className="animate-pulse flex flex-col gap-4">
                <div className="h-32 bg-gray-200 dark:bg-[#161B22] rounded-2xl w-full"></div>
              </div>
            ) : resolvedTasks.length === 0 ? (
              <div className="border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">No resolved signals yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {resolvedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onToggle={() => toggleTask(task.id)} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, onToggle }: { task: ActionTask; onToggle: () => void }) {
  return (
    <div className={`
      relative group flex flex-col p-6 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer
      ${task.is_completed 
        ? 'bg-gray-100/50 dark:bg-[#0D1117]/50 border-gray-200 dark:border-gray-800/50 opacity-60 hover:opacity-100' 
        : 'bg-white dark:bg-[#161B22] border-gray-200 dark:border-gray-800 hover:border-[#10B981]/50 shadow-sm'}
    `}
    onClick={onToggle}
    >
      {/* Background glow effect for pending items */}
      {!task.is_completed && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      )}

      {/* Task Description */}
      <h3 className={`text-base font-medium mb-3 pr-8 transition-colors ${task.is_completed ? 'text-gray-500 line-through decoration-gray-400' : 'text-gray-900 dark:text-white'}`}>
        {task.task_description}
      </h3>

      {/* Source Context */}
      <div className="font-mono text-xs text-gray-500 dark:text-gray-400 mb-6 bg-gray-50 dark:bg-[#0D1117] p-2 rounded-lg border border-gray-100 dark:border-gray-800 inline-block w-fit">
        {task.source_context || "Origin: Unknown"}
      </div>

      {/* Checkbox Area */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800/60">
        <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400">
          {task.is_completed ? 'Status: Resolved' : 'Status: Pending'}
        </span>
        
        <div className={`
          flex items-center justify-center w-6 h-6 rounded-md transition-all duration-300
          ${task.is_completed 
            ? 'bg-[#10B981] text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
            : 'border-2 border-gray-300 dark:border-gray-700 text-transparent group-hover:border-[#10B981]'}
        `}>
          <Check size={14} className={task.is_completed ? 'opacity-100' : 'opacity-0'} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}
