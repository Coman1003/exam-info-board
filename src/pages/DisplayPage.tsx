import { useState } from 'react';
import { Clock } from '../components/Clock';
import { CurrentSubject } from '../components/CurrentSubject';
import { EditPanel } from '../components/EditPanel';
import { ScheduleTable } from '../components/ScheduleTable';
import { StatisticsPanel } from '../components/StatisticsPanel';
import { useExamContext } from '../context/ExamContext';
import { useClock } from '../hooks/useClock';

export function DisplayPage() {
  const { subjects, statistics, currentSubjectId } = useExamContext();
  const { currentTime } = useClock();
  const [isEditing, setIsEditing] = useState(false);

  const currentSubject = subjects.find((subject) => subject.id === currentSubjectId);

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Clock />
        <button type="button" className="btn-primary" onClick={() => setIsEditing(true)}>
          ⚙️ 編輯
        </button>
      </div>

      <CurrentSubject subjectName={currentSubject?.name || '尚未設定科目'} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ScheduleTable subjects={subjects} now={currentTime} />
        <StatisticsPanel statistics={statistics} />
      </div>

      <EditPanel isOpen={isEditing} onClose={() => setIsEditing(false)} />
    </main>
  );
}
