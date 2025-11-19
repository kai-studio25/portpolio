import React, { useState } from 'react';
import { Asset, Liability, AssetCategory, LiabilityCategory, Currency } from '../types';
import { Plus, Trash2, Building2, Briefcase, Coins, CreditCard } from 'lucide-react';

interface AssetManagerProps {
  assets: Asset[];
  liabilities: Liability[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  setLiabilities: React.Dispatch<React.SetStateAction<Liability[]>>;
}

const AssetManager: React.FC<AssetManagerProps> = ({ assets, liabilities, setAssets, setLiabilities }) => {
  const [activeTab, setActiveTab] = useState<'assets' | 'liabilities'>('assets');
  
  // Form States
  const [assetForm, setAssetForm] = useState<Partial<Asset>>({
    category: AssetCategory.STOCK,
    currency: Currency.KRW,
    value: 0
  });
  const [liabilityForm, setLiabilityForm] = useState<Partial<Liability>>({
    category: LiabilityCategory.MORTGAGE,
    amount: 0,
    interestRate: 0
  });

  const handleAddAsset = () => {
    if (!assetForm.name || !assetForm.value) return;
    const newAsset: Asset = {
      id: Date.now().toString(),
      name: assetForm.name,
      category: assetForm.category as AssetCategory,
      value: Number(assetForm.value),
      currency: assetForm.currency as Currency,
      qty: assetForm.qty ? Number(assetForm.qty) : undefined,
      costBasis: assetForm.costBasis ? Number(assetForm.costBasis) : undefined,
      details: assetForm.details || '',
    };
    setAssets([...assets, newAsset]);
    setAssetForm({ category: AssetCategory.STOCK, currency: Currency.KRW, value: 0, name: '', qty: 0, details: '' });
  };

  const handleAddLiability = () => {
    if (!liabilityForm.name || !liabilityForm.amount) return;
    const newLiability: Liability = {
      id: Date.now().toString(),
      name: liabilityForm.name,
      category: liabilityForm.category as LiabilityCategory,
      amount: Number(liabilityForm.amount),
      interestRate: Number(liabilityForm.interestRate),
    };
    setLiabilities([...liabilities, newLiability]);
    setLiabilityForm({ category: LiabilityCategory.MORTGAGE, amount: 0, interestRate: 0, name: '' });
  };

  const removeAsset = (id: string) => setAssets(assets.filter(a => a.id !== id));
  const removeLiability = (id: string) => setLiabilities(liabilities.filter(l => l.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={() => setActiveTab('assets')}
          className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'assets' ? 'bg-prestige-gold text-prestige-dark' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          자산 (Assets)
        </button>
        <button 
          onClick={() => setActiveTab('liabilities')}
          className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'liabilities' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          부채 (Liabilities)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1 bg-prestige-card border border-slate-800 rounded-xl p-6 h-fit sticky top-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            {activeTab === 'assets' ? <Plus className="w-5 h-5 mr-2 text-prestige-gold" /> : <Plus className="w-5 h-5 mr-2 text-rose-500" />}
            {activeTab === 'assets' ? '자산 등록' : '부채 등록'}
          </h3>
          
          <div className="space-y-4">
            {activeTab === 'assets' ? (
              <>
                <select 
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-3 focus:border-prestige-gold outline-none"
                  value={assetForm.category}
                  onChange={e => setAssetForm({...assetForm, category: e.target.value as AssetCategory})}
                >
                  {Object.values(AssetCategory).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input 
                  type="text" 
                  placeholder="자산명 (예: 삼성전자, 강남 아파트)" 
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-3 focus:border-prestige-gold outline-none"
                  value={assetForm.name || ''}
                  onChange={e => setAssetForm({...assetForm, name: e.target.value})}
                />
                 <input 
                  type="text" 
                  placeholder="상세정보 (티커, 주소 등)" 
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-3 focus:border-prestige-gold outline-none"
                  value={assetForm.details || ''}
                  onChange={e => setAssetForm({...assetForm, details: e.target.value})}
                />
                {(assetForm.category === AssetCategory.STOCK || assetForm.category === AssetCategory.CRYPTO) && (
                   <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="number" 
                        placeholder="수량" 
                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-3 focus:border-prestige-gold outline-none"
                        value={assetForm.qty || ''}
                        onChange={e => setAssetForm({...assetForm, qty: Number(e.target.value)})}
                      />
                      <input 
                        type="number" 
                        placeholder="평단가" 
                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-3 focus:border-prestige-gold outline-none"
                        value={assetForm.costBasis || ''}
                        onChange={e => setAssetForm({...assetForm, costBasis: Number(e.target.value)})}
                      />
                   </div>
                )}
                <input 
                  type="number" 
                  placeholder="현재 총 평가금액 (KRW)" 
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-3 focus:border-prestige-gold outline-none"
                  value={assetForm.value || ''}
                  onChange={e => setAssetForm({...assetForm, value: Number(e.target.value)})}
                />
                <button 
                  onClick={handleAddAsset}
                  className="w-full bg-prestige-gold hover:bg-prestige-gold-dim text-prestige-dark font-bold py-3 rounded-lg transition-colors"
                >
                  자산 추가
                </button>
              </>
            ) : (
              <>
                 <select 
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-3 focus:border-rose-500 outline-none"
                  value={liabilityForm.category}
                  onChange={e => setLiabilityForm({...liabilityForm, category: e.target.value as LiabilityCategory})}
                >
                  {Object.values(LiabilityCategory).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input 
                  type="text" 
                  placeholder="부채명 (예: 주택담보대출)" 
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-3 focus:border-rose-500 outline-none"
                  value={liabilityForm.name || ''}
                  onChange={e => setLiabilityForm({...liabilityForm, name: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    placeholder="대출 잔액 (KRW)" 
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-3 focus:border-rose-500 outline-none"
                    value={liabilityForm.amount || ''}
                    onChange={e => setLiabilityForm({...liabilityForm, amount: Number(e.target.value)})}
                  />
                   <input 
                    type="number" 
                    placeholder="이자율 (%)" 
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-3 focus:border-rose-500 outline-none"
                    value={liabilityForm.interestRate || ''}
                    onChange={e => setLiabilityForm({...liabilityForm, interestRate: Number(e.target.value)})}
                  />
                </div>
                <button 
                  onClick={handleAddLiability}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  부채 추가
                </button>
              </>
            )}
          </div>
        </div>

        {/* List View */}
        <div className="lg:col-span-2 bg-prestige-card border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {activeTab === 'assets' ? '보유 자산 목록' : '부채 내역'}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900 text-slate-400 uppercase text-xs font-medium">
                  <tr>
                    <th className="p-4">구분</th>
                    <th className="p-4">이름</th>
                    {activeTab === 'assets' && <th className="p-4 text-right">평가 손익</th>}
                    <th className="p-4 text-right">금액</th>
                    <th className="p-4 text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {activeTab === 'assets' ? (
                    assets.length === 0 ? (
                      <tr><td colSpan={5} className="p-8 text-center text-slate-500">등록된 자산이 없습니다.</td></tr>
                    ) : (
                      assets.map(asset => {
                        const gain = (asset.costBasis && asset.qty) ? asset.value - (asset.costBasis * asset.qty) : 0;
                        const gainPercent = (asset.costBasis && asset.qty && asset.costBasis > 0) ? (gain / (asset.costBasis * asset.qty)) * 100 : 0;
                        
                        return (
                        <tr key={asset.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                              {asset.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-white">{asset.name}</div>
                            {asset.details && <div className="text-xs text-slate-500">{asset.details}</div>}
                          </td>
                          <td className="p-4 text-right">
                             {(asset.category === AssetCategory.STOCK || asset.category === AssetCategory.CRYPTO) && asset.costBasis ? (
                               <div className={gain >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                                 <div className="text-sm">{gain > 0 ? '+' : ''}{gain.toLocaleString()}</div>
                                 <div className="text-xs">({gainPercent.toFixed(2)}%)</div>
                               </div>
                             ) : (
                               <span className="text-slate-600">-</span>
                             )}
                          </td>
                          <td className="p-4 text-right font-mono font-medium text-slate-200">
                            {asset.value.toLocaleString()} KRW
                          </td>
                          <td className="p-4 text-center">
                            <button onClick={() => removeAsset(asset.id)} className="text-slate-500 hover:text-rose-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )})
                    )
                  ) : (
                    liabilities.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-slate-500">등록된 부채가 없습니다.</td></tr>
                    ) : (
                      liabilities.map(liability => (
                        <tr key={liability.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-4">
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-900/30 text-rose-200 border border-rose-800/50">
                              {liability.category}
                            </span>
                          </td>
                          <td className="p-4">
                             <div className="font-medium text-white">{liability.name}</div>
                             <div className="text-xs text-rose-400">연이자 {liability.interestRate}%</div>
                          </td>
                          <td className="p-4 text-right font-mono font-medium text-rose-300">
                            -{liability.amount.toLocaleString()} KRW
                          </td>
                          <td className="p-4 text-center">
                            <button onClick={() => removeLiability(liability.id)} className="text-slate-500 hover:text-rose-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AssetManager;
