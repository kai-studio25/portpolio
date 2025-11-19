import React from 'react';
import { LayoutDashboard, PieChart, Wallet, Activity, TrendingUp, DollarSign } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'assets', label: '자산 관리', icon: Wallet },
    { id: 'portfolio', label: '포트폴리오 분석', icon: PieChart },
    { id: 'cashflow', label: '현금 흐름', icon: DollarSign },
    { id: 'simulator', label: '목표 시뮬레이션', icon: TrendingUp },
  ];

  return (
    <div className="w-64 bg-prestige-dark border-r border-slate-800 flex flex-col h-full sticky top-0">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800/50">
        <div className="w-8 h-8 bg-prestige-gold rounded-sm flex items-center justify-center">
          <Activity className="text-prestige-dark w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          PRESTIGE <span className="text-prestige-gold">OS</span>
        </h1>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-prestige-gold/10 text-prestige-gold border border-prestige-gold/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-prestige-gold' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
          <p className="text-xs text-slate-500 mb-1">VIP Client Status</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Platinum</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
