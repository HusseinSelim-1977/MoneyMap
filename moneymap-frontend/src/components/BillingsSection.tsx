import { useState } from 'react';
import { useMoneyMapStore } from '../store';
import type { CurrencyCode } from '../types';
import { format } from 'date-fns';
import { requestNotificationPermission, scheduleBillNotifications } from '../notifications';

const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'NGN', 'EGP', 'INR'];

export function BillingsSection() {
  const { bills, addBill, removeBill } = useMoneyMapStore();

  const [form, setForm] = useState({
    title: '',
    amountNeeded: 0,
    amountDeposited: 0,
    currency: 'USD' as CurrencyCode,
    dueDate: '',
    notifyBeforeHours: 24,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.dueDate) return;

    addBill({
      title: form.title.trim(),
      amountNeeded: Number(form.amountNeeded),
      amountDeposited: Number(form.amountDeposited),
      currency: form.currency,
      dueDate: new Date(form.dueDate).toISOString(),
      notifyBeforeHours: Number(form.notifyBeforeHours),
    });

    setForm({ title: '', amountNeeded: 0, amountDeposited: 0, currency: form.currency, dueDate: '', notifyBeforeHours: 24 });
    requestNotificationPermission().then((p) => {
      if (p === 'granted') scheduleBillNotifications();
    });
  }

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h2 className="text-lg font-semibold mb-4">Billings</h2>
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
          <div>
            <label className="label">Due Date</label>
            <input type="date" className="input" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <div>
            <label className="label">Notify Before (hours)</label>
            <input type="number" min={0} className="input" value={form.notifyBeforeHours} onChange={(e) => setForm({ ...form, notifyBeforeHours: Number(e.target.value) })} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button className="btn-primary" type="submit">Add Bill</button>
          </div>
        </form>
      </div>

      <div className="grid gap-3">
        {bills.map((b) => {
          const shortage = (b.amountNeeded ?? 0) > b.amountDeposited;
          return (
            <div key={b.id} className="card p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{b.title}</div>
                <div className="text-sm text-white/70">
                  {b.currency} {b.amountDeposited.toLocaleString()} / {b.amountNeeded?.toLocaleString()} — Due {format(new Date(b.dueDate), 'PP')}
                </div>
                {shortage && (
                  <div className="text-amber-300 text-sm mt-1">You're short this month</div>
                )}
              </div>
              <div className="flex gap-2">
                <button className="btn bg-white/10" onClick={() => removeBill(b.id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
