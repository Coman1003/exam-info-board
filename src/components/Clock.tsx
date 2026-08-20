import { useClock } from '../hooks/useClock';

export function Clock() {
  const { dateTimeText } = useClock();

  return (
    <div className="rounded-2xl bg-pink px-6 py-4 text-center shadow-soft transition-soft">
      <div className="text-2xl font-semibold text-text">🕐 {dateTimeText}</div>
    </div>
  );
}
