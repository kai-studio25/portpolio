import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AssetManager from './components/AssetManager';
import PortfolioAnalyzer from './components/PortfolioAnalyzer';
import CashFlow from './components/CashFlow';
import Simulator from './components/Simulator';
import { INITIAL_ASSETS, INITIAL_LIABILITIES } from './constants';
import { Asset, Liability } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [liabilities, setLiabilities] = useState<Liability[]>(INITIAL_LIABILITIES);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard assets={assets} liabilities={liabilities} />;
      case 'assets':
        return <AssetManager assets={assets} liabilities={liabilities} setAssets={setAssets} setLiabilities={setLiabilities} />;
      case 'portfolio':
        return <PortfolioAnalyzer assets={assets} />;
      case 'cashflow':
        return <CashFlow />;
      case 'simulator':
        return <Simulator assets={assets} liabilities={liabilities} />;
      default:
        return <Dashboard assets={assets} liabilities={liabilities} />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-prestige-dark text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-800 bg-prestige-dark/95 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-10">
           <h2 className="text-lg font-medium text-white">
             {activeTab === 'dashboard' && 'Executive Dashboard'}
             {activeTab === 'assets' && 'Asset Allocation & Liabilities'}
             {activeTab === 'portfolio' && 'AI Portfolio Analytics'}
             {activeTab === 'cashflow' && 'Cash Flow Management'}
             {activeTab === 'simulator' && 'Wealth Simulation'}
           </h2>
           <div className="flex items-center space-x-4">
             <div className="text-right">
               <div className="text-xs text-slate-500">Last Updated</div>
               <div className="text-sm font-mono text-slate-300">{new Date().toLocaleDateString()}</div>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-prestige-gold font-bold">
               VIP
             </div>
           </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
