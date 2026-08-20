import { useCallback } from 'react';
import { ExamData, Statistics, Subject } from '../types/exam';
import { useLocalStorage } from './useLocalStorage';

const DEFAULT_EXAM_DATA: ExamData = {
  subjects: [
    { id: 1, name: '數學', startTime: '09:00', endTime: '10:30' },
    { id: 2, name: '英文', startTime: '10:45', endTime: '12:00' },
    { id: 3, name: '國文', startTime: '13:00', endTime: '14:30' }
  ],
  statistics: {
    totalStudents: 45,
    classroomStudents: 42,
    absentStudents: 2,
    withdrawnStudents: 1
  },
  currentSubjectId: 1
};

export function useExamData() {
  const [examData, setExamData] = useLocalStorage<ExamData>('exam-info-board-data', DEFAULT_EXAM_DATA);

  const updateSubjects = useCallback((subjects: Subject[]) => {
    setExamData((previous) => ({
      ...previous,
      subjects
    }));
  }, [setExamData]);

  const updateStatistics = useCallback((statistics: Statistics) => {
    setExamData((previous) => ({
      ...previous,
      statistics
    }));
  }, [setExamData]);

  const updateCurrentSubject = useCallback((currentSubjectId: number) => {
    setExamData((previous) => ({
      ...previous,
      currentSubjectId
    }));
  }, [setExamData]);

  return {
    ...examData,
    updateSubjects,
    updateStatistics,
    updateCurrentSubject
  };
}
