import React from 'react';
import { Settings, Zap, Thermometer, Gauge } from 'lucide-react';
import { cn } from '../lib/utils';

export default function MachineStatusCard() {
  const stats = [
    { label: 'Power Load', value: '42%', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Temperature', value: '38°C', icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Throughput', value: '1.2 GB/s', icon: Gauge, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="h-full flex flex-col bg-white/50 backdrop-blur-sm border border-black/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          <h2 className="font-semibold text-gray-900">Machine Status</h2>
        </div>
        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
          Optimal
        </span>
      </div>

      <div className="flex-1 space-y-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-black/5">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon className={cn("w-4 h-4", stat.color)} />
              </div>
              <span className="text-xs font-medium text-gray-600">{stat.label}</span>
            </div>
            <span className="text-sm font-bold text-gray-900 font-mono">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-black/5">
        <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          <span>Last Sync</span>
          <span>Just Now</span>
        </div>
      </div>
    </div>
  );
}
