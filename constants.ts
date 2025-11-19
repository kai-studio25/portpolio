import { Asset, AssetCategory, Liability, LiabilityCategory, Currency } from './types';

export const INITIAL_ASSETS: Asset[] = [
  { id: '1', name: '삼성전자', category: AssetCategory.STOCK, value: 150000000, currency: Currency.KRW, qty: 2000, costBasis: 65000, details: '005930.KS' },
  { id: '2', name: 'Tesla', category: AssetCategory.STOCK, value: 85000000, currency: Currency.USD, qty: 300, costBasis: 180, details: 'TSLA' },
  { id: '3', name: '한남 더힐', category: AssetCategory.REAL_ESTATE, value: 8500000000, currency: Currency.KRW, details: '서울 용산구' },
  { id: '4', name: 'Bitcoin', category: AssetCategory.CRYPTO, value: 120000000, currency: Currency.USD, qty: 1.5, costBasis: 45000000, details: 'BTC' },
  { id: '5', name: '골드바', category: AssetCategory.GOLD, value: 50000000, currency: Currency.KRW },
];

export const INITIAL_LIABILITIES: Liability[] = [
  { id: '1', name: '주택담보대출', category: LiabilityCategory.MORTGAGE, amount: 3000000000, interestRate: 3.5 },
  { id: '2', name: '신용대출', category: LiabilityCategory.PERSONAL_LOAN, amount: 100000000, interestRate: 5.2 },
];
