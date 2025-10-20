import { useState } from 'react';
import { useMoneyMapStore } from '../store';
import type { CurrencyCode } from '../types';

const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'NGN', 'EGP', 'INR'];

export function InvestmentsSection() {
  const { investments, addInvestment, removeInvestment } = useMoneyMapStore();

  const [form, setForm] = useState({
    title: '',
    amountNeeded: 0,
    amountDeposited: 0,
    currency: 'USD' as CurrencyCode,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return;
    addInvestment({
      title: form.title.trim(),
      amountNeeded: Number(form.amountNeeded),
      amountDeposited: Number(form.amountDeposited),
      currency: form.currency,
    });
    setForm({ title: '', amountNeeded: 0, amountDeposited: 0, currency: form.currency });
  }

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h2 className="text-lg font-semibold mb-4">Investments</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={submit}>
          <div>
            <label className="label">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Currency</label>
            <select className="input" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as CurrencyCode })}>
              {currencies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Amount Needed</label>
            <input type="number" min={0} className="input" value={form.amountNeeded} onChange={(e) => setForm({ ...form, amountNeeded: Number(e.target.value) })} />
          </div>
          <div>
            <label className="label">Amount Deposited</label>
            <input type="number" min={0} className="input" value={form.amountDeposited} onChange={(e) => setForm({ ...form, amountDeposited: Number(e.target.value) })} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button className="btn-primary" type="submit">Add Investment</button>
          </div>
        </form>
      </div>

      <div className="grid gap-3">
        {investments.map((i) => (
          <div key={i.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{i.title}</div>
              <div className="text-sm text-white/70">{i.currency} {i.amountDeposited.toLocaleString()} / {i.amountNeeded?.toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn bg-white/10" onClick={() => removeInvestment(i.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
