import { CurrentSubject } from '../components/CurrentSubject';
import { Clock } from '../components/Clock';
import { EditPanel } from '../components/EditPanel';
import { ScheduleTable } from '../components/ScheduleTable';
import { StatisticsPanel } from '../components/StatisticsPanel';
import { useExamContext } from '../context/ExamContext';
import { useClock } from '../hooks/useClock';

export function AdminPage() {
  const { subjects, statistics, currentSubjectId } = useExamContext();
  const { currentTime } = useClock();

  const currentSubject = subjects.find((subject) => subject.id === currentSubjectId);

  return (
    <main className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <section className="rounded-3xl bg-light-bg p-4 shadow-soft">
        <h1 className="mb-4 text-2xl font-semibold text-text">🛠️ 管理後台</h1>
        <EditPanel isOpen onClose={() => undefined} inline />
      </section>

      <section className="space-y-6">
        <Clock />
        <CurrentSubject subjectName={currentSubject?.name || '尚未設定科目'} />
        <ScheduleTable subjects={subjects} now={currentTime} />
        <StatisticsPanel statistics={statistics} />
      </section>
    </main>
  );
}
