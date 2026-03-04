import React, { useEffect, useState } from 'react';
import { Activity, Cpu, HardDrive, Clock } from 'lucide-react';
import { SystemStatus } from '../types';

export default function StatusCard() {
  const [time, setTime] = useState(new Date());
  const [status, setStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const fetchStatus = () => {
      fetch('/api/status')
        .then(res => res.json())
        .then(setStatus);
    };

    fetchStatus();
    const statusTimer = setInterval(fetchStatus, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(statusTimer);
    };
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="h-full flex flex-col bg-white/50 backdrop-blur-sm border border-black/5 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-indigo-600" />
        <h2 className="font-semibold text-gray-900">System Health</h2>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-black/5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Local Time</span>
          </div>
          <div className="text-2xl font-mono font-medium text-gray-900">
            {format(time, 'HH:mm:ss')}
          </div>
          <div className="text-[10px] text-gray-400">
            {format(time, 'EEEE, MMM do')}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-black/5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-lg font-medium text-gray-900 capitalize">{status?.status || 'Online'}</span>
          </div>
          <div className="text-[10px] text-gray-400">
            Uptime: {status ? formatUptime(status.uptime) : '--'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-black/5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Memory</span>
          </div>
          <div className="text-lg font-medium text-gray-900">
            {status ? `${Math.round(status.memory / 1024 / 1024)} MB` : '--'}
          </div>
          <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-1/3" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-black/5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <HardDrive className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Platform</span>
          </div>
          <div className="text-sm font-medium text-gray-900 truncate">
            {status?.platform || '--'}
          </div>
          <div className="text-[10px] text-gray-400">
            Node: {status?.nodeVersion || '--'}
          </div>
        </div>
      </div>
    </div>
  );
}

import { format } from 'date-fns';
