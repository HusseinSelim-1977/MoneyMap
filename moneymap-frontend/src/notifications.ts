export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  return await Notification.requestPermission();
}

export function scheduleBillNotifications() {
  // This is a simple in-tab scheduler; for production, use a Service Worker + Push
  if (!('Notification' in window)) return;
  // Clear previous interval if any
  const existing = (window as any).__moneymap_notifier as number | undefined;
  if (existing) clearInterval(existing);

  const intervalId = window.setInterval(() => {
    // dynamically import to read latest state
    import('./store').then(({ useMoneyMapStore }) => {
      const { bills } = useMoneyMapStore.getState();
      const now = Date.now();

      for (const b of bills) {
        const due = new Date(b.dueDate).getTime();
        const notifyAt = due - b.notifyBeforeHours * 60 * 60 * 1000;
        const delta = notifyAt - now;
        if (delta < 0 && now - notifyAt < 60 * 1000) {
          // within 1 minute after notify time
          try {
            new Notification('MoneyMap bill reminder', {
              body: `${b.title} due on ${new Date(b.dueDate).toDateString()}`,
              tag: `bill-${b.id}-${b.dueDate}`,
            });
          } catch {}
        }
      }
    });
  }, 30 * 1000);

  (window as any).__moneymap_notifier = intervalId;
}
