import React, { useMemo } from 'react';
import { Asset, Liability, AssetCategory } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Anchor } from 'lucide-react';

interface DashboardProps {
  assets: Asset[];
  liabilities: Liability[];
}

const COLORS = ['#d4af37', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#64748b'];

const Dashboard: React.FC<DashboardProps> = ({ assets, liabilities }) => {
  const totalAssets = useMemo(() => assets.reduce((sum, a) => sum + a.value, 0), [assets]);
  const totalLiabilities = useMemo(() => liabilities.reduce((sum, l) => sum + l.amount, 0), [liabilities]);
  const netWorth = totalAssets - totalLiabilities;
  const leverageRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

  const assetData = useMemo(() => {
    const grouped = assets.reduce((acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + asset.value;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(grouped).map((key) => ({
      name: key,
      value: grouped[key],
    }));
  }, [assets]);

  // Mock historical data for visual flair
  const historyData = [
    { month: '1월', worth: netWorth * 0.85 },
    { month: '2월', worth: netWorth * 0.88 },
    { month: '3월', worth: netWorth * 0.86 },
    { month: '4월', worth: netWorth * 0.91 },
    { month: '5월', worth: netWorth * 0.95 },
    { month: '6월', worth: netWorth },
  ];

  const formatCurrency = (val: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">자산 개요</h2>
        <p className="text-slate-400">현재 실시간 자산 및 부채 현황입니다.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-prestige-card border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-prestige-gold/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Anchor size={64} />
          </div>
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">총 순자산 (Net Worth)</h3>
          <p className="text-3xl font-bold text-white mt-2 font-mono">{formatCurrency(netWorth)}</p>
          <div className="flex items-center mt-4 text-emerald-500 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+15.2% YTD</span>
          </div>
        </div>

        <div className="bg-prestige-card border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">총 자산 (Assets)</h3>
          <p className="text-2xl font-bold text-slate-200 mt-2 font-mono">{formatCurrency(totalAssets)}</p>
          <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-full"></div>
          </div>
        </div>

        <div className="bg-prestige-card border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
           <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">총 부채 (Liabilities)</h3>
          <p className="text-2xl font-bold text-slate-200 mt-2 font-mono">{formatCurrency(totalLiabilities)}</p>
           <div className="flex items-center mt-4 text-sm">
             <span className={`mr-2 font-medium ${leverageRatio > 50 ? 'text-rose-500' : 'text-slate-400'}`}>
               부채비율 {leverageRatio.toFixed(1)}%
             </span>
           </div>
           <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${Math.min(leverageRatio, 100)}%` }}></div>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation Chart */}
        <div className="bg-prestige-card border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">자산 배분 현황</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Trend */}
        <div className="bg-prestige-card border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">순자산 성장 추이</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorWorth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{fontSize: 12}} />
                <YAxis stroke="#64748b" tick={{fontSize: 12}} tickFormatter={(val) => `${val / 100000000}억`} width={40} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Area type="monotone" dataKey="worth" stroke="#d4af37" fillOpacity={1} fill="url(#colorWorth)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
