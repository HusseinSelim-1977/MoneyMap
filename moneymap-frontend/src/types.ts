export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'NGN' | 'EGP' | 'INR';

export interface BaseItem {
  id: string;
  title: string;
  amountNeeded?: number; // Spending doesn't require amountNeeded
  amountDeposited: number;
  currency: CurrencyCode;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface BillItem extends BaseItem {
  dueDate: string; // ISO date
  notifyBeforeHours: number; // lead time for notifications in hours
}

export interface InvestmentItem extends BaseItem {}

export interface SpendingItem extends Omit<BaseItem, 'amountNeeded'> {}

export interface MoneyMapState {
  bills: BillItem[];
  investments: InvestmentItem[];
  spendings: SpendingItem[];
  incomeMonthly: number;
  preferredInvestmentCategories: string[];
}

export type SectionKey = 'Billings' | 'Investments' | 'Spendings';
