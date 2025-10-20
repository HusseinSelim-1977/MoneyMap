import { useMemo, useState } from 'react';
import { useMoneyMapStore } from '../store';

function calcInsights() {
  const { bills, investments, spendings, incomeMonthly, preferredInvestmentCategories } = useMoneyMapStore.getState();
  const sum = (n: number[]) => n.reduce((a, b) => a + b, 0);

  const billsNeeded = sum(bills.map((b) => b.amountNeeded ?? 0));
  const billsDeposited = sum(bills.map((b) => b.amountDeposited));
  const invNeeded = sum(investments.map((i) => i.amountNeeded ?? 0));
  const invDeposited = sum(investments.map((i) => i.amountDeposited));
  const spendTotal = sum(spendings.map((s) => s.amountDeposited));

  const totalDeposited = billsDeposited + invDeposited + spendTotal;
  const leftover = Math.max(incomeMonthly - totalDeposited, 0);

  const alerts: string[] = [];
  if (billsDeposited < billsNeeded) alerts.push("You're short on bills this month");
  if (invDeposited > invNeeded && invNeeded > 0) alerts.push('Great! You exceeded investment goals');

  const recommendations: string[] = [];
  if (leftover > 0) {
    if (preferredInvestmentCategories.length > 0) {
      const per = Math.floor(leftover / preferredInvestmentCategories.length);
      for (const cat of preferredInvestmentCategories) {
        recommendations.push(`Allocate ${per.toLocaleString()} to ${cat}`);
      }
    } else {
      recommendations.push(`Allocate leftover ${leftover.toLocaleString()} to investments`);
    }
  }

  return { alerts, recommendations, leftover };
}

export function InsightsPanel() {
  const [incomeInput, setIncomeInput] = useState('');
  const { setIncome, setPreferredInvestmentCategories } = useMoneyMapStore();
  const { alerts, recommendations, leftover } = useMemo(calcInsights, [useMoneyMapStore((s) => s.bills), useMoneyMapStore((s) => s.investments), useMoneyMapStore((s) => s.spendings), useMoneyMapStore((s) => s.incomeMonthly), useMoneyMapStore((s) => s.preferredInvestmentCategories)]);

  function setIncomeSafe() {
    const val = Number(incomeInput);
    if (!Number.isNaN(val)) setIncome(val);
  }

  function handleCategories(e: React.ChangeEvent<HTMLInputElement>) {
    const parts = e.target.value
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    setPreferredInvestmentCategories(parts);
  }

  return (
    <div className="card p-5 space-y-4">
      <h2 className="text-lg font-semibold">Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="label">Monthly Income</label>
          <div className="flex gap-2">
            <input className="input" placeholder="e.g. 5000" value={incomeInput} onChange={(e) => setIncomeInput(e.target.value)} />
            <button className="btn-primary" onClick={setIncomeSafe}>Set</button>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="label">Preferred Investment Categories (comma separated)</label>
          <input className="input" onChange={handleCategories} placeholder="e.g. Stocks, Bonds, Crypto" />
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-lg p-3">
          <ul className="list-disc list-inside">
            {alerts.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 rounded-lg p-3">
        <div className="font-medium">Leftover after deposits: {leftover.toLocaleString()}</div>
        {recommendations.length > 0 && (
          <ul className="list-disc list-inside mt-2">
            {recommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
