import { useState } from 'react';
import { useMoneyMapStore } from '../store';
import type { CurrencyCode } from '../types';

const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'NGN', 'EGP', 'INR'];

export function SpendingsSection() {
  const { spendings, addSpending, removeSpending } = useMoneyMapStore();

  const [form, setForm] = useState({
    title: '',
    amountDeposited: 0,
    currency: 'USD' as CurrencyCode,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return;
    addSpending({
      title: form.title.trim(),
      amountDeposited: Number(form.amountDeposited),
      currency: form.currency,
    });
    setForm({ title: '', amountDeposited: 0, currency: form.currency });
  }

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h2 className="text-lg font-semibold mb-4">Spendings</h2>
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
            <label className="label">Amount Deposited</label>
            <input type="number" min={0} className="input" value={form.amountDeposited} onChange={(e) => setForm({ ...form, amountDeposited: Number(e.target.value) })} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button className="btn-primary" type="submit">Add Spending</button>
          </div>
        </form>
      </div>

      <div className="grid gap-3">
        {spendings.map((s) => (
          <div key={s.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{s.title}</div>
              <div className="text-sm text-white/70">{s.currency} {s.amountDeposited.toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn bg-white/10" onClick={() => removeSpending(s.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
