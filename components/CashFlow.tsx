import React, { useState, useMemo } from 'react';
import { CashFlowItem, CashFlowType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Plus, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';

const CashFlow: React.FC = () => {
  const [items, setItems] = useState<CashFlowItem[]>([
    { id: '1', type: CashFlowType.INCOME, category: '급여', amount: 8500000, frequency: 'Monthly' },
    { id: '2', type: CashFlowType.INCOME, category: '배당금', amount: 1200000, frequency: 'Yearly' },
    { id: '3', type: CashFlowType.EXPENSE, category: '주거비', amount: 2500000, frequency: 'Monthly' },
    { id: '4', type: CashFlowType.EXPENSE, category: '생활비', amount: 1500000, frequency: 'Monthly' },
  ]);

  const [form, setForm] = useState<Partial<CashFlowItem>>({
    type: CashFlowType.INCOME,
    category: '',
    amount: 0,
    frequency: 'Monthly'
  });

  const addItem = () => {
    if (!form.category || !form.amount) return;
    setItems([...items, { ...form, id: Date.now().toString() } as CashFlowItem]);
    setForm({ type: CashFlowType.INCOME, category: '', amount: 0, frequency: 'Monthly' });
  };

  // Calculate Monthly Averages
  const monthlyStats = useMemo(() => {
    let monthlyIncome = 0;
    let monthlyExpense = 0;

    items.forEach(item => {
      const amount = item.frequency === 'Yearly' ? item.amount / 12 : item.amount;
      if (item.type === CashFlowType.INCOME) monthlyIncome += amount;
      else monthlyExpense += amount;
    });

    return {
      income: monthlyIncome,
      expense: monthlyExpense,
      net: monthlyIncome - monthlyExpense
    };
  }, [items]);

  const chartData = [
    { name: '수입 (Income)', amount: monthlyStats.income },
    { name: '지출 (Expense)', amount: monthlyStats.expense },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-prestige-card border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">월 평균 수입</span>
            <ArrowUpRight className="text-emerald-500 w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{Math.round(monthlyStats.income).toLocaleString()}</div>
        </div>
        <div className="bg-prestige-card border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">월 평균 지출</span>
            <ArrowDownLeft className="text-rose-500 w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{Math.round(monthlyStats.expense).toLocaleString()}</div>
        </div>
        <div className="bg-prestige-card border border-slate-800 rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">월 잉여 현금 (Surplus)</span>
            <Wallet className="text-prestige-gold w-5 h-5" />
          </div>
          <div className={`text-3xl font-bold font-mono ${monthlyStats.net >= 0 ? 'text-prestige-gold' : 'text-rose-500'}`}>
            {monthlyStats.net > 0 ? '+' : ''}{Math.round(monthlyStats.net).toLocaleString()}
          </div>
           {monthlyStats.net > 0 && (
            <div className="mt-2 text-xs text-emerald-400">
              저축 가능률 {((monthlyStats.net / monthlyStats.income) * 100).toFixed(1)}%
            </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-prestige-card border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">수지 분석 (Monthly)</h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                 <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} />
                 <YAxis stroke="#64748b" tickFormatter={val => `${val/10000}만`} />
                 <Tooltip 
                    cursor={{fill: '#1e293b'}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} 
                    formatter={(val: number) => val.toLocaleString()}
                 />
                 <ReferenceLine y={0} stroke="#64748b" />
                 <Bar dataKey="amount" fill="#d4af37" barSize={60}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f43f5e'} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Manager */}
        <div className="bg-prestige-card border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4">현금 흐름 관리</h3>
          
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 mb-4 space-y-3">
             <div className="flex space-x-2">
               <select 
                className="bg-slate-800 border border-slate-600 text-white rounded px-3 py-2 text-sm outline-none"
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value as CashFlowType})}
               >
                 <option value={CashFlowType.INCOME}>수입</option>
                 <option value={CashFlowType.EXPENSE}>지출</option>
               </select>
               <select 
                className="bg-slate-800 border border-slate-600 text-white rounded px-3 py-2 text-sm outline-none"
                value={form.frequency}
                onChange={e => setForm({...form, frequency: e.target.value as any})}
               >
                 <option value="Monthly">월간</option>
                 <option value="Yearly">연간</option>
               </select>
             </div>
             <div className="flex space-x-2">
               <input 
                 type="text" 
                 placeholder="항목명 (예: 급여)"
                 className="flex-1 bg-slate-800 border border-slate-600 text-white rounded px-3 py-2 text-sm outline-none"
                 value={form.category}
                 onChange={e => setForm({...form, category: e.target.value})}
               />
               <input 
                 type="number" 
                 placeholder="금액"
                 className="flex-1 bg-slate-800 border border-slate-600 text-white rounded px-3 py-2 text-sm outline-none"
                 value={form.amount || ''}
                 onChange={e => setForm({...form, amount: Number(e.target.value)})}
               />
               <button 
                onClick={addItem}
                className="bg-prestige-gold text-prestige-dark rounded px-4 py-2 font-bold hover:bg-yellow-500 transition-colors"
               >
                 <Plus className="w-5 h-5" />
               </button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm text-left">
               <thead className="text-slate-500 border-b border-slate-800">
                 <tr>
                   <th className="py-2">구분</th>
                   <th className="py-2">항목</th>
                   <th className="py-2">주기</th>
                   <th className="py-2 text-right">금액</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50">
                 {items.map(item => (
                   <tr key={item.id}>
                     <td className="py-3">
                       <span className={`text-xs px-2 py-1 rounded ${item.type === CashFlowType.INCOME ? 'bg-emerald-900/30 text-emerald-400' : 'bg-rose-900/30 text-rose-400'}`}>
                         {item.type}
                       </span>
                     </td>
                     <td className="py-3 text-slate-200">{item.category}</td>
                     <td className="py-3 text-slate-400">{item.frequency === 'Monthly' ? '월' : '연'}</td>
                     <td className="py-3 text-right font-mono">{item.amount.toLocaleString()}</td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlow;