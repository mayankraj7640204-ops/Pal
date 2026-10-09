'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Calendar as CalendarIcon, Plus, Printer, CheckCircle2, Circle, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

import { ActionTask } from '@/types';

const printKeywords = ['report', 'print', 'submission', 'hard copy', 'project'];

/**
 * Utility function to determine if a task requires physical dispatch.
 * Checks the boolean flag or scans the task description for keywords.
 */
const needsPrintout = (task: ActionTask): boolean => {
  if (task.requires_print) return true;
  const lowerDesc = task.task_description.toLowerCase();
  return printKeywords.some(keyword => lowerDesc.includes(keyword));
};

export default function SmartPlannerPage() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<ActionTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [requiresPrint, setRequiresPrint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calendar State
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchTasks();
    setCurrentDate(new Date());
  }, []);

  /**
   * Fetches the user's active tasks directly from the Supabase client.
   * Note: In a production Service Layer architecture, this would route through 
   * the /api/tasks endpoint with server-side validation.
   */
  const fetchTasks = async (): Promise<void> => {
    const { data, error } = await supabase
      .from('action_items')
      .select('*')
      .order('due_date', { ascending: true, nullsFirst: false });
      
    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data || []);
    }
    setIsLoading(false);
  };

  const handleAddTask = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setIsSubmitting(true);

    const { data: userData } = await supabase.auth.getUser();
    
    // Construct strongly-typed Task object
    const newTask: Partial<ActionTask> = {
      task_description: newTaskTitle,
      due_date: newTaskDate ? new Date(newTaskDate).toISOString() : null,
      requires_print: requiresPrint,
      is_completed: false,
      user_id: userData?.user?.id || undefined,
      source_context: "Manual Entry"
    };

    const { data, error } = await supabase
      .from('action_items')
      .insert([newTask])
      .select();

    if (!error && data) {
      setTasks([...tasks, data[0]]);
      setNewTaskTitle('');
      setNewTaskDate('');
      setRequiresPrint(false);
    }
    setIsSubmitting(false);
  };

  /**
   * Optimistically toggles the completion state of a task.
   */
  const toggleTask = async (id: string): Promise<void> => {
    const taskToUpdate = tasks.find(t => t.id === id);
    if (!taskToUpdate) return;
    
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, is_completed: !task.is_completed } : task
    ));

    await supabase
      .from('action_items')
      .update({ is_completed: !taskToUpdate.is_completed })
      .eq('id', id);
  };

  const nextMonth = () => setCurrentDate(prev => prev ? new Date(prev.getFullYear(), prev.getMonth() + 1, 1) : new Date());
  const prevMonth = () => setCurrentDate(prev => prev ? new Date(prev.getFullYear(), prev.getMonth() - 1, 1) : new Date());

  const hasTasksOnDay = (day: number) => {
    if (!currentDate) return false;
    return tasks.some(task => {
      if (!task.due_date || task.is_completed) return false;
      const taskDate = new Date(task.due_date);
      return taskDate.getDate() === day && 
             taskDate.getMonth() === currentDate.getMonth() && 
             taskDate.getFullYear() === currentDate.getFullYear();
    });
  };

  if (!currentDate) {
    return <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117]"></div>;
  }

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  const today = new Date();
  
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i); // Assuming Monday start

  return (
    <div className="flex flex-col p-8 md:p-12 mx-auto w-full min-h-screen font-sans bg-gray-50 dark:bg-[#0D1117] transition-colors duration-300">
      <div className="max-w-[1200px] w-full mx-auto flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2 text-gray-900 dark:text-white flex items-center gap-3">
            Smart Planner
          </h1>
          <p className="font-mono text-[#10B981] text-sm uppercase tracking-widest">
            INTERACTIVE SCHEDULE & PHYSICAL DISPATCH DISK.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Calendar */}
          <div className="lg:col-span-5 bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 flex flex-col shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white font-mono">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 rounded-lg bg-gray-50 dark:bg-[#0D1117] text-gray-500 hover:text-[#10B981] transition-colors border border-gray-200 dark:border-gray-800">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={nextMonth} className="p-2 rounded-lg bg-gray-50 dark:bg-[#0D1117] text-gray-500 hover:text-[#10B981] transition-colors border border-gray-200 dark:border-gray-800">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {day}
                </div>
              ))}
              
              {blanksArray.map((_, i) => (
                <div key={`blank-${i}`} className="h-10"></div>
              ))}
              
              {daysArray.map(day => {
                const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
                const hasTask = hasTasksOnDay(day);
                
                return (
                  <div key={day} className="flex flex-col items-center justify-start h-10 relative group cursor-default">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm transition-colors duration-300
                      ${isToday ? 'bg-[#10B981] text-white font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}
                    `}>
                      {day}
                    </div>
                    {hasTask && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] absolute bottom-0 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Scheduled Deliverables & Tasks */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm transition-colors duration-300">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                <Plus size={16} className="text-[#10B981]" />
                New Deliverable
              </h3>
              
              <div className="flex flex-col gap-4">
                <input 
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task description (e.g. Submit lab record)..."
                  className="w-full bg-gray-50 dark:bg-[#0D1117] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#10B981] transition-colors"
                  required
                />
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input 
                    type="date"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="w-full sm:w-auto bg-gray-50 dark:bg-[#0D1117] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-400 focus:outline-none focus:border-[#10B981] transition-colors"
                  />
                  
                  <label className="flex items-center gap-3 cursor-pointer mr-auto text-sm text-gray-600 dark:text-gray-400 font-mono">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={requiresPrint}
                        onChange={(e) => setRequiresPrint(e.target.checked)}
                        className="sr-only" 
                      />
                      <div className={`w-5 h-5 border-2 rounded transition-colors flex items-center justify-center ${requiresPrint ? 'border-[#10B981] bg-[#10B981]/10' : 'border-gray-300 dark:border-gray-700'}`}>
                        {requiresPrint && <CheckCircle2 size={14} className="text-[#10B981]" />}
                      </div>
                    </div>
                    Requires Hard Copy / Printout
                  </label>

                  <button 
                    type="submit"
                    disabled={isSubmitting || !newTaskTitle.trim()}
                    className="w-full sm:w-auto px-6 py-3 bg-[#10B981] text-white dark:text-[#0D1117] font-bold text-sm rounded-xl hover:bg-[#0ea5e9] transition-colors disabled:opacity-50"
                  >
                    Schedule
                  </button>
                </div>
              </div>
            </form>

            {/* Task List */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 pl-2">
                Scheduled Deliverables & Deadlines
              </h3>
              
              {isLoading ? (
                <div className="animate-pulse flex flex-col gap-4">
                  <div className="h-24 bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800 rounded-2xl w-full"></div>
                  <div className="h-24 bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800 rounded-2xl w-full"></div>
                </div>
              ) : tasks.filter(t => !t.is_completed).length === 0 ? (
                <div className="border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                  <CalendarIcon size={32} className="text-gray-300 dark:text-gray-700 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">Schedule clear.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {tasks.filter(t => !t.is_completed).map((task) => {
                    const print = needsPrintout(task);
                    
                    return (
                      <div key={task.id} className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex flex-col shadow-sm transition-colors duration-300 group">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex flex-col gap-1">
                            <h4 className="text-gray-900 dark:text-white font-medium">{task.task_description}</h4>
                            {task.due_date && (
                              <span className="text-xs font-mono text-[#10B981]">
                                DUE: {new Date(task.due_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                          
                          <button 
                            onClick={() => toggleTask(task.id)}
                            className="w-6 h-6 rounded-md border-2 border-gray-300 dark:border-gray-700 text-transparent hover:border-[#10B981] flex items-center justify-center transition-all shrink-0 mt-1"
                          >
                            <CheckCircle2 size={14} className="opacity-0 group-hover:opacity-100 group-hover:text-[#10B981]" />
                          </button>
                        </div>
                        
                        {/* EzeePrints Integration */}
                        {print && (
                          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                              <Printer size={16} className="text-[#10B981]" />
                              <span className="text-xs font-mono uppercase tracking-wider">Physical printout required for submission.</span>
                            </div>
                            <a 
                              href="https://www.ezeeprints.in/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] hover:bg-[#10B981] hover:text-white dark:hover:text-[#0D1117] text-xs font-bold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                            >
                              Order Printout via EzeePrints <ExternalLink size={14} />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
