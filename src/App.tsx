import React from 'react';
import { motion } from 'motion/react';
import DocsCard from './components/DocsCard';
import TasksCard from './components/TasksCard';
import CalendarCard from './components/CalendarCard';
import StatusCard from './components/StatusCard';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Mission Control</h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Local Instance v1.0.0</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            System Operational
          </div>
        </div>
      </header>

      {/* Main Bento Grid */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[280px]">
        {/* Docs - Large Vertical */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-4 md:row-span-2"
        >
          <DocsCard />
        </motion.div>

        {/* Tasks - Large Horizontal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-8 md:row-span-1"
        >
          <TasksCard />
        </motion.div>

        {/* Calendar - Small Square */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-4 md:row-span-1"
        >
          <CalendarCard />
        </motion.div>

        {/* Status - Small Square */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-4 md:row-span-1"
        >
          <StatusCard />
        </motion.div>
      </main>

      {/* Footer Decoration */}
      <footer className="max-w-7xl mx-auto px-6 py-8 text-center">
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
          End of Transmission // Local Data Only
        </p>
      </footer>
    </div>
  );
}
