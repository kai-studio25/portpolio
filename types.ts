export enum AssetCategory {
  REAL_ESTATE = '부동산',
  STOCK = '주식',
  GOLD = '원자재/금',
  CRYPTO = '암호화폐',
  DEPOSIT = '예금/현금',
  INSURANCE = '보험/연금',
  OTHER = '기타',
}

export enum LiabilityCategory {
  MORTGAGE = '담보 대출',
  PERSONAL_LOAN = '신용 대출',
  BUSINESS_LOAN = '사업 대출',
  CREDIT_CARD = '카드 미결제',
}

export enum CashFlowType {
  INCOME = '수입',
  EXPENSE = '지출',
}

export enum Currency {
  KRW = 'KRW',
  USD = 'USD',
}

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  value: number;
  currency: Currency;
  purchaseDate?: string;
  details?: string; // E.g., Ticker symbol for stocks
  qty?: number; // For stocks/crypto
  costBasis?: number; // Per unit cost
}

export interface Liability {
  id: string;
  name: string;
  category: LiabilityCategory;
  amount: number;
  interestRate: number;
  maturityDate?: string;
}

export interface CashFlowItem {
  id: string;
  type: CashFlowType;
  category: string; // e.g., "Salary", "Dividends", "Rent"
  amount: number;
  frequency: 'Monthly' | 'Yearly';
}

export interface SimulationConfig {
  targetYear: number;
  targetAmount: number;
  expectedAnnualReturn: number; // Percentage
  annualInflation: number; // Percentage
}

export interface AIAnalysisResult {
  summary: string;
  recommendations: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  score: number; // 0-100
}
