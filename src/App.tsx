import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DocsCard from './components/DocsCard';
import TasksCard from './components/TasksCard';
import CalendarCard from './components/CalendarCard';
import StatusCard from './components/StatusCard';
import MachineStatusCard from './components/MachineStatusCard';
import { 
  Terminal, 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Activity,
  Settings,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'docs', label: 'Documentation', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'machine', label: 'Machine Status', icon: Settings },
    { id: 'status', label: 'System Health', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="text-sm font-bold tracking-tight">Mission Control</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Local v1.0.0</p>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                activeTab === item.id 
                  ? "bg-indigo-50 text-indigo-600" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", activeTab === item.id ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
              {isSidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Settings className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="text-sm font-medium">Settings</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 transition-all duration-300 min-h-screen flex flex-col",
        isSidebarOpen ? "pl-64" : "pl-20"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#F8F9FC]/80 backdrop-blur-md px-8 py-6 flex items-center justify-between border-b border-slate-200/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 capitalize">{activeTab}</h2>
            <p className="text-xs text-slate-400 font-medium">Welcome back, Commander.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              System Operational
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8 flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {/* Tasks - Wide */}
                <div className="lg:col-span-2 xl:col-span-2 h-[400px]">
                  <TasksCard />
                </div>

                {/* Status - Square */}
                <div className="h-[400px]">
                  <StatusCard />
                </div>

                {/* Docs - Tall */}
                <div className="lg:col-span-1 h-[500px]">
                  <DocsCard />
                </div>

                {/* Calendar - Square */}
                <div className="h-[500px]">
                  <CalendarCard />
                </div>

                {/* Machine Status - New Card */}
                <div className="h-[500px]">
                  <MachineStatusCard />
                </div>

                {/* Future Card Placeholder */}
                <div className="h-[500px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300 gap-3 group hover:border-indigo-200 hover:text-indigo-300 transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Add Module</span>
                </div>
              </motion.div>
            )}

            {activeTab === 'tasks' && (
              <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-200px)]">
                <TasksCard />
              </motion.div>
            )}

            {activeTab === 'docs' && (
              <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-200px)]">
                <DocsCard />
              </motion.div>
            )}

            {activeTab === 'calendar' && (
              <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-200px)]">
                <CalendarCard />
              </motion.div>
            )}

            {activeTab === 'machine' && (
              <motion.div key="machine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-200px)]">
                <MachineStatusCard />
              </motion.div>
            )}

            {activeTab === 'status' && (
              <motion.div key="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-200px)]">
                <StatusCard />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="px-8 py-6 text-center border-t border-slate-200/50">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
            End of Transmission // Local Data Only
          </p>
        </footer>
      </div>
    </div>
  );
}
