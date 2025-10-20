import { useState } from 'react';
import type { SectionKey } from './types';
import { BillingsSection } from './components/BillingsSection';
import { InvestmentsSection } from './components/InvestmentsSection';
import { SpendingsSection } from './components/SpendingsSection';
import { Summary3D } from './components/Summary3D';
import { InsightsPanel } from './components/InsightsPanel';

const sections: SectionKey[] = ['Billings', 'Investments', 'Spendings'];

export default function App() {
  const [active, setActive] = useState<SectionKey>('Billings');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 backdrop-blur bg-black/30 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-brand-500" />
            <h1 className="text-xl font-semibold">MoneyMap</h1>
          </div>
          <nav className="flex gap-2">
            {sections.map((s) => (
              <button
                key={s}
                className={`btn ${active === s ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10'}`}
                onClick={() => setActive(s)}
              >
                {s}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <section className="lg:col-span-2 space-y-6">
          {active === 'Billings' && <BillingsSection />}
          {active === 'Investments' && <InvestmentsSection />}
          {active === 'Spendings' && <SpendingsSection />}
        </section>
        <aside className="lg:col-span-1 space-y-6">
          <Summary3D />
          <InsightsPanel />
        </aside>
      </main>

      <footer className="border-t border-white/10 px-6 py-4 text-sm text-white/60 text-center">
        Built with React, Tailwind, and Three.js
      </footer>
    </div>
  );
}
