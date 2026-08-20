import { useEffect, useMemo, useState } from 'react';
import { useExamContext } from '../context/ExamContext';
import { Statistics, Subject } from '../types/exam';

interface EditPanelProps {
  isOpen: boolean;
  onClose: () => void;
  inline?: boolean;
}

const emptySubject = (id: number): Subject => ({
  id,
  name: '',
  startTime: '09:00',
  endTime: '10:00'
});

export function EditPanel({ isOpen, onClose, inline = false }: EditPanelProps) {
  const {
    subjects,
    statistics,
    currentSubjectId,
    updateSubjects,
    updateStatistics,
    updateCurrentSubject
  } = useExamContext();

  const [draftSubjects, setDraftSubjects] = useState<Subject[]>(subjects);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [draftStatistics, setDraftStatistics] = useState<Statistics>(statistics);
  const [draftCurrentSubjectId, setDraftCurrentSubjectId] = useState<number>(currentSubjectId);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setDraftSubjects(subjects);
    setDraftStatistics(statistics);
    setDraftCurrentSubjectId(currentSubjectId);
    setSelectedIds([]);
    setSaveMessage('');
  }, [isOpen, subjects, statistics, currentSubjectId]);

  const isStatisticsValid = useMemo(
    () =>
      draftStatistics.classroomStudents +
        draftStatistics.absentStudents +
        draftStatistics.withdrawnStudents ===
      draftStatistics.totalStudents,
    [draftStatistics]
  );

  const selectedSubject = draftSubjects.find((subject) => subject.id === draftCurrentSubjectId);

  if (!isOpen) {
    return null;
  }

  const updateSubjectField = (id: number, field: keyof Subject, value: string) => {
    setDraftSubjects((prev) =>
      prev.map((subject) =>
        subject.id === id ? { ...subject, [field]: field === 'id' ? Number(value) : value } : subject
      )
    );
  };

  const addSubject = () => {
    const nextId = draftSubjects.length ? Math.max(...draftSubjects.map((subject) => subject.id)) + 1 : 1;
    setDraftSubjects((prev) => [...prev, emptySubject(nextId)]);
  };

  const removeSelectedSubjects = () => {
    if (!selectedIds.length) {
      return;
    }

    const remaining = draftSubjects.filter((subject) => !selectedIds.includes(subject.id));
    setDraftSubjects(remaining);
    setSelectedIds([]);

    if (!remaining.some((subject) => subject.id === draftCurrentSubjectId) && remaining.length > 0) {
      setDraftCurrentSubjectId(remaining[0].id);
    }
  };

  const toggleSelected = (subjectId: number) => {
    setSelectedIds((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]
    );
  };

  const save = () => {
    updateSubjects(draftSubjects);
    updateStatistics(draftStatistics);
    updateCurrentSubject(draftCurrentSubjectId);
    setSaveMessage('✅ 儲存成功！');
    window.setTimeout(() => {
      setSaveMessage('');
      onClose();
    }, 800);
  };

  const handleStatisticChange = (field: keyof Statistics, value: number) => {
    setDraftStatistics((prev) => ({
      ...prev,
      [field]: Number.isNaN(value) ? 0 : value
    }));
  };

  const content = (
    <div className={`${inline ? 'h-full' : 'max-h-[90vh]'} w-full ${inline ? '' : 'max-w-5xl'} overflow-y-auto rounded-3xl bg-white p-6 shadow-soft`}>
        <h2 className="mb-4 text-3xl font-bold text-text">⚙️ 編輯資訊</h2>

        <section className="mb-6">
          <h3 className="mb-3 text-xl font-semibold text-text">1. 科目管理</h3>
          <div className="space-y-2">
            {draftSubjects.map((subject) => (
              <div key={subject.id} className="grid grid-cols-12 gap-2 rounded-xl bg-light-bg p-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(subject.id)}
                  onChange={() => toggleSelected(subject.id)}
                  className="col-span-1"
                />
                <input
                  value={subject.name}
                  onChange={(event) => updateSubjectField(subject.id, 'name', event.target.value)}
                  placeholder="科目名稱"
                  className="col-span-5 rounded-lg border border-border px-2 py-1"
                />
                <input
                  type="time"
                  value={subject.startTime}
                  onChange={(event) => updateSubjectField(subject.id, 'startTime', event.target.value)}
                  className="col-span-3 rounded-lg border border-border px-2 py-1"
                />
                <input
                  type="time"
                  value={subject.endTime}
                  onChange={(event) => updateSubjectField(subject.id, 'endTime', event.target.value)}
                  className="col-span-3 rounded-lg border border-border px-2 py-1"
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={addSubject} className="btn-primary">+ 新增行</button>
            <button type="button" onClick={removeSelectedSubjects} className="btn-secondary">刪除選中</button>
          </div>
        </section>

        <section className="mb-6">
          <h3 className="mb-3 text-xl font-semibold text-text">2. 人數設定</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="form-field">
              全班總人數
              <input
                type="number"
                value={draftStatistics.totalStudents}
                onChange={(event) => handleStatisticChange('totalStudents', Number(event.target.value))}
              />
            </label>
            <label className="form-field">
              教室人數
              <input
                type="number"
                value={draftStatistics.classroomStudents}
                onChange={(event) => handleStatisticChange('classroomStudents', Number(event.target.value))}
              />
            </label>
            <label className="form-field">
              缺席人數
              <input
                type="number"
                value={draftStatistics.absentStudents}
                onChange={(event) => handleStatisticChange('absentStudents', Number(event.target.value))}
              />
            </label>
            <label className="form-field">
              抽離人數
              <input
                type="number"
                value={draftStatistics.withdrawnStudents}
                onChange={(event) => handleStatisticChange('withdrawnStudents', Number(event.target.value))}
              />
            </label>
          </div>
          {!isStatisticsValid && (
            <p className="mt-2 text-sm font-semibold text-red-500">
              ⚠️ 教室 + 缺席 + 抽離 必須等於全班總人數
            </p>
          )}
        </section>

        <section className="mb-6">
          <h3 className="mb-3 text-xl font-semibold text-text">3. 當前科目</h3>
          <select
            value={draftCurrentSubjectId}
            onChange={(event) => setDraftCurrentSubjectId(Number(event.target.value))}
            className="w-full rounded-lg border border-border px-3 py-2"
          >
            {draftSubjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name || `科目 ${subject.id}`}
              </option>
            ))}
          </select>
          {selectedSubject && (
            <p className="mt-2 text-sm text-text-light">
              預覽：{selectedSubject.name || '未命名科目'} ({selectedSubject.startTime} - {selectedSubject.endTime})
            </p>
          )}
        </section>

        <div className="flex items-center justify-end gap-3">
          {saveMessage && <span className="text-sm text-green-600">{saveMessage}</span>}
          <button type="button" onClick={onClose} className="btn-secondary">取消</button>
          <button type="button" onClick={save} className="btn-primary">保存</button>
        </div>
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      {content}
    </div>
  );
}
