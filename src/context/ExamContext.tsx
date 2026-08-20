import { createContext, ReactNode, useContext } from 'react';
import { useExamData } from '../hooks/useExamData';
import { Statistics, Subject } from '../types/exam';

interface ExamContextValue {
  subjects: Subject[];
  statistics: Statistics;
  currentSubjectId: number;
  updateSubjects: (subjects: Subject[]) => void;
  updateStatistics: (statistics: Statistics) => void;
  updateCurrentSubject: (subjectId: number) => void;
}

const ExamContext = createContext<ExamContextValue | null>(null);

export function ExamProvider({ children }: { children: ReactNode }) {
  const examData = useExamData();

  return <ExamContext.Provider value={examData}>{children}</ExamContext.Provider>;
}

export function useExamContext() {
  const context = useContext(ExamContext);

  if (!context) {
    throw new Error('useExamContext must be used within an ExamProvider');
  }

  return context;
}
