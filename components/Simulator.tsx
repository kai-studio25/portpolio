import React, { useState, useEffect } from 'react';
import { Asset, Liability } from '../types';
import { generateWealthAdvice } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Target, Calculator, Lightbulb } from 'lucide-react';

interface SimulatorProps {
  assets: Asset[];
  liabilities: Liability[];
}

const Simulator: React.FC<SimulatorProps> = ({ assets, liabilities }) => {
  const [targetYear, setTargetYear] = useState(new Date().getFullYear() + 5);
  const [targetAmount, setTargetAmount] = useState(5000000000); // 50억
  const [expectedReturn, setExpectedReturn] = useState(7); // 7%
  const [monthlySavings, setMonthlySavings] = useState(5000000); // 500만

  const [simData, setSimData] = useState<any[]>([]);
  const [aiAdvice, setAiAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const currentNetWorth = assets.reduce((a, b) => a + b.value, 0) - liabilities.reduce((a, b) => a + b.amount, 0);

  useEffect(() => {
    const data = [];
    let current = currentNetWorth;
    const currentYear = new Date().getFullYear();
    
    for (let year = currentYear; year <= targetYear + 2; year++) {
      data.push({
        year,
        amount: Math.round(current),
        target: targetAmount
      });
      // Simple compound interest + Annual contribution (Monthly * 12)
      current = current * (1 + expectedReturn / 100) + (monthlySavings * 12);
    }
    setSimData(data);
  }, [targetYear, targetAmount, expectedReturn, monthlySavings, currentNetWorth]);

  const handleGetAdvice = async () => {
    setLoading(true);
    const advice = await generateWealthAdvice(
      currentNetWorth, 
      monthlySavings * 12, 
      assets, 
      targetAmount, 
      targetYear
    );
    setAiAdvice(advice);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Controls */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-prestige-card border border-slate-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Calculator className="text-prestige-gold" />
            <h3 className="text-xl font-bold text-white">시뮬레이션 설정</h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-slate-400 mb-2">목표 연도</label>
              <input 
                type="number" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-prestige-gold outline-none"
                value={targetYear}
                onChange={e => setTargetYear(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">목표 순자산 (KRW)</label>
              <input 
                type="number" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-prestige-gold outline-none"
                value={targetAmount}
                onChange={e => setTargetAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">예상 연평균 수익률 (%)</label>
              <div className="flex items-center space-x-4">
                 <input 
                  type="range" min="1" max="20" step="0.5"
                  className="flex-1 accent-prestige-gold h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  value={expectedReturn}
                  onChange={e => setExpectedReturn(Number(e.target.value))}
                />
                <span className="text-white font-mono w-12 text-right">{expectedReturn}%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">월 추가 저축액 (KRW)</label>
              <input 
                type="number" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-prestige-gold outline-none"
                value={monthlySavings}
                onChange={e => setMonthlySavings(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/30 rounded-xl p-6">
           <div className="flex items-start space-x-3 mb-4">
              <Lightbulb className="text-indigo-400 w-6 h-6" />
              <h3 className="text-lg font-bold text-indigo-100">AI Wealth Advisor</h3>
           </div>
           <p className="text-sm text-slate-300 mb-4 leading-relaxed">
             현재 설정된 시뮬레이션을 바탕으로 목표 달성을 위한 전문적인 자산 배분 전략을 제안받으세요.
           </p>
           <button 
             onClick={handleGetAdvice}
             disabled={loading}
             className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-semibold transition-colors"
           >
             {loading ? '분석 중...' : '전략 리포트 생성'}
           </button>
        </div>
      </div>

      {/* Charts & Results */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-prestige-card border border-slate-800 rounded-xl p-6 h-[400px]">
           <h3 className="text-lg font-bold text-white mb-6 flex items-center">
             <Target className="mr-2 text-prestige-gold" />
             자산 성장 시뮬레이션
           </h3>
           <ResponsiveContainer width="100%" height="85%">
             <LineChart data={simData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
               <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
               <XAxis dataKey="year" stroke="#64748b" />
               <YAxis stroke="#64748b" tickFormatter={val => `${val/100000000}억`} width={40} />
               <Tooltip 
                 contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                 formatter={(val: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val)}
               />
               <ReferenceLine y={targetAmount} label="Goal" stroke="#f43f5e" strokeDasharray="3 3" />
               <Line type="monotone" dataKey="amount" stroke="#d4af37" strokeWidth={3} dot={{r: 4, fill: '#d4af37'}} activeDot={{r: 8}} />
             </LineChart>
           </ResponsiveContainer>
        </div>

        {aiAdvice && (
          <div className="bg-prestige-card border border-slate-800 rounded-xl p-6 animate-fade-in">
            <h4 className="text-lg font-bold text-indigo-400 mb-4">전문가 전략 제안</h4>
            <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap">
              {aiAdvice}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulator;
