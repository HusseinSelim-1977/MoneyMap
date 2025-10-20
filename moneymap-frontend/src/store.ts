import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type { BillItem, InvestmentItem, MoneyMapState, SpendingItem } from './types';

interface MoneyMapActions {
  addBill: (partial: Omit<BillItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBill: (id: string, updates: Partial<BillItem>) => void;
  removeBill: (id: string) => void;

  addInvestment: (partial: Omit<InvestmentItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInvestment: (id: string, updates: Partial<InvestmentItem>) => void;
  removeInvestment: (id: string) => void;

  addSpending: (partial: Omit<SpendingItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSpending: (id: string, updates: Partial<SpendingItem>) => void;
  removeSpending: (id: string) => void;

  setIncome: (amount: number) => void;
  setPreferredInvestmentCategories: (categories: string[]) => void;
}

export type MoneyMapStore = MoneyMapState & MoneyMapActions;

const nowIso = () => new Date().toISOString();

export const useMoneyMapStore = create<MoneyMapStore>()(
  persist(
    (set) => ({
      bills: [],
      investments: [],
      spendings: [],
      incomeMonthly: 0,
      preferredInvestmentCategories: [],

      addBill: (partial) =>
        set((state) => ({
          bills: [
            ...state.bills,
            { ...partial, id: uuid(), createdAt: nowIso(), updatedAt: nowIso() },
          ],
        })),
      updateBill: (id, updates) =>
        set((state) => ({
          bills: state.bills.map((b) =>
            b.id === id ? { ...b, ...updates, updatedAt: nowIso() } : b,
          ),
        })),
      removeBill: (id) => set((state) => ({ bills: state.bills.filter((b) => b.id !== id) })),

      addInvestment: (partial) =>
        set((state) => ({
          investments: [
            ...state.investments,
            { ...partial, id: uuid(), createdAt: nowIso(), updatedAt: nowIso() },
          ],
        })),
      updateInvestment: (id, updates) =>
        set((state) => ({
          investments: state.investments.map((i) =>
            i.id === id ? { ...i, ...updates, updatedAt: nowIso() } : i,
          ),
        })),
      removeInvestment: (id) =>
        set((state) => ({ investments: state.investments.filter((i) => i.id !== id) })),

      addSpending: (partial) =>
        set((state) => ({
          spendings: [
            ...state.spendings,
            { ...partial, id: uuid(), createdAt: nowIso(), updatedAt: nowIso() },
          ],
        })),
      updateSpending: (id, updates) =>
        set((state) => ({
          spendings: state.spendings.map((s) =>
            s.id === id ? { ...s, ...updates, updatedAt: nowIso() } : s,
          ),
        })),
      removeSpending: (id) =>
        set((state) => ({ spendings: state.spendings.filter((s) => s.id !== id) })),

      setIncome: (amount) => set(() => ({ incomeMonthly: amount })),
      setPreferredInvestmentCategories: (categories) =>
        set(() => ({ preferredInvestmentCategories: categories })),
    }),
    {
      name: 'moneymap-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => state,
    },
  ),
);
