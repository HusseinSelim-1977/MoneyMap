import { Canvas } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Text } from '@react-three/drei';
import { useMemo } from 'react';
import { useMoneyMapStore } from '../store';

function Bars() {
  const { bills, investments, spendings } = useMoneyMapStore();

  const totals = useMemo(() => {
    const sum = (n: number[]) => n.reduce((a, b) => a + b, 0);
    const billsNeeded = sum(bills.map((b) => b.amountNeeded ?? 0));
    const billsDeposited = sum(bills.map((b) => b.amountDeposited));
    const invNeeded = sum(investments.map((i) => i.amountNeeded ?? 0));
    const invDeposited = sum(investments.map((i) => i.amountDeposited));
    const spendTotal = sum(spendings.map((s) => s.amountDeposited));
    return {
      billsShort: Math.max(billsNeeded - billsDeposited, 0),
      billsDeposited,
      invShort: Math.max(invNeeded - invDeposited, 0),
      invDeposited,
      spendTotal,
    };
  }, [bills, investments, spendings]);

  const scale = 0.0025; // adjust height scaling

  const items: Array<{ label: string; value: number; color: string; x: number }> = [
    { label: 'Bills Deposit', value: totals.billsDeposited, color: '#3c79ff', x: -2 },
    { label: 'Bills Short', value: totals.billsShort, color: '#ff6b6b', x: -1 },
    { label: 'Invest Deposit', value: totals.invDeposited, color: '#22c55e', x: 0 },
    { label: 'Invest Short', value: totals.invShort, color: '#f59e0b', x: 1 },
    { label: 'Spendings', value: totals.spendTotal, color: '#a855f7', x: 2 },
  ];

  return (
    <group>
      {items.map((it, idx) => (
        <group key={idx} position={[it.x, 0, 0]}>
          <RoundedBox args={[0.7, Math.max(it.value * scale, 0.05), 0.7]} radius={0.1} smoothness={4} position={[0, Math.max(it.value * scale, 0.05) / 2, 0]}>
            <meshStandardMaterial color={it.color} />
          </RoundedBox>
          <Text position={[0, -0.6, 0]} fontSize={0.18} color="white" anchorX="center" anchorY="middle">
            {it.label}
          </Text>
        </group>
      ))}
    </group>
  );
}

export function Summary3D() {
  return (
    <div className="card p-3">
      <div className="h-80 rounded-lg overflow-hidden">
        <Canvas camera={{ position: [2.5, 3, 6], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 5]} intensity={0.8} />
          <Bars />
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
    </div>
  );
}
