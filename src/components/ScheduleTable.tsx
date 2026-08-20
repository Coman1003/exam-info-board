import { Subject } from '../types/exam';

interface ScheduleTableProps {
  subjects: Subject[];
  now: Date;
}

const timeToMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

const getStatus = (subject: Subject, now: Date) => {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const start = timeToMinutes(subject.startTime);
  const end = timeToMinutes(subject.endTime);

  if (currentMinutes > end) {
    return 'finished';
  }

  if (currentMinutes >= start && currentMinutes <= end) {
    return 'active';
  }

  return 'upcoming';
};

const statusClasses = {
  active: 'bg-pink font-semibold',
  finished: 'bg-border text-text-light',
  upcoming: 'bg-light-bg'
};

const statusText = {
  active: '進行中',
  finished: '已考完',
  upcoming: '未開始'
};

export function ScheduleTable({ subjects, now }: ScheduleTableProps) {
  const visibleSubjects = subjects.slice(0, 6);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft">
      <h2 className="mb-4 text-2xl font-semibold text-text">🗓️ 考程表</h2>
      <div className="space-y-3">
        {visibleSubjects.map((subject) => {
          const status = getStatus(subject, now);

          return (
            <div key={subject.id} className={`rounded-2xl px-4 py-3 transition-soft ${statusClasses[status]}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xl">{subject.name}</span>
                <span className="text-sm">{statusText[status]}</span>
              </div>
              <div className="text-sm text-text-light">
                {subject.startTime} - {subject.endTime}
              </div>
            </div>
          );
        })}
      </div>
      {subjects.length > 6 && <div className="mt-3 text-sm text-text-light">還有更多科目...</div>}
    </section>
  );
}
