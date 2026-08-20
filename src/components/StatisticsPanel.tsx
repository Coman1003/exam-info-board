import { Statistics } from '../types/exam';

interface StatisticsPanelProps {
  statistics: Statistics;
}

const cards = [
  { key: 'totalStudents', label: '全班總人數', emoji: '📊', color: 'bg-pink' },
  { key: 'classroomStudents', label: '教室人數', emoji: '🏫', color: 'bg-mint' },
  { key: 'absentStudents', label: '缺席人數', emoji: '❌', color: 'bg-sky' },
  { key: 'withdrawnStudents', label: '抽離人數', emoji: '🔄', color: 'bg-lavender' }
] as const;

export function StatisticsPanel({ statistics }: StatisticsPanelProps) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft">
      <h2 className="mb-4 text-2xl font-semibold text-text">👥 考場人數統計</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.key} className={`${card.color} rounded-2xl p-4 text-center shadow-soft transition-soft hover:card-hover`}>
            <div className="text-sm text-text-light">{card.emoji} {card.label}</div>
            <div className="mt-2 text-4xl font-bold text-text">{statistics[card.key]}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
