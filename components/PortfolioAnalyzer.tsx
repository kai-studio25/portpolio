import React, { useState } from 'react';
import { Asset, AssetCategory } from '../types';
import { analyzePortfolio } from '../services/geminiService';
import { BrainCircuit, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface PortfolioAnalyzerProps {
  assets: Asset[];
}

const PortfolioAnalyzer: React.FC<PortfolioAnalyzerProps> = ({ assets }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const stocks = assets.filter(a => a.category === AssetCategory.STOCK || a.category === AssetCategory.CRYPTO);

  const handleAnalysis = async () => {
    if (stocks.length === 0) return;
    setLoading(true);
    const result = await analyzePortfolio(assets);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Portfolio List */}
      <div className="lg:col-span-1 bg-prestige-card border border-slate-800 rounded-xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h3 className="font-bold text-white">투자 포트폴리오</h3>
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
            {stocks.length} 종목
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {stocks.length === 0 ? (
             <div className="text-center py-10 text-slate-500">
                <AlertTriangle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>분석할 주식/코인 자산이 없습니다.</p>
             </div>
          ) : (
            stocks.map(stock => (
              <div key={stock.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-200">{stock.name}</div>
                  <div className="text-xs text-slate-500">{stock.details} • {stock.qty}주</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm text-white">{stock.value.toLocaleString()}</div>
                  {stock.costBasis && stock.qty && (
                     <div className={`text-xs ${(stock.value - (stock.costBasis * stock.qty)) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {((stock.value - (stock.costBasis * stock.qty)) / (stock.costBasis * stock.qty) * 100).toFixed(2)}%
                     </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <button
            onClick={handleAnalysis}
            disabled={loading || stocks.length === 0}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <BrainCircuit className="w-5 h-5" />}
            <span>AI 포트폴리오 정밀 진단</span>
          </button>
        </div>
      </div>

      {/* AI Output */}
      <div className="lg:col-span-2 bg-prestige-card border border-slate-800 rounded-xl overflow-hidden flex flex-col">
         <div className="p-6 border-b border-slate-800 bg-slate-900">
            <h3 className="font-bold text-white flex items-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mr-2">Gemini 2.5 AI</span> 
              Analyst Report
            </h3>
         </div>
         <div className="flex-1 p-6 overflow-y-auto bg-slate-950/50">
            {analysis ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
                  {analysis}
                </div>
                <div className="mt-8 p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-lg flex items-start">
                   <CheckCircle2 className="w-5 h-5 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                   <p className="text-xs text-indigo-200 m-0">
                     본 분석은 AI 모델에 기반한 시뮬레이션 결과이며, 실제 투자 권유가 아닙니다. 모든 투자의 책임은 투자자 본인에게 있습니다.
                   </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                <BrainCircuit className="w-16 h-16 opacity-20" />
                <p>왼쪽 버튼을 눌러 월스트리트 수준의 AI 진단을 받아보세요.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default PortfolioAnalyzer;
