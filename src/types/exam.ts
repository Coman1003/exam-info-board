export interface Subject {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

export interface Statistics {
  totalStudents: number;
  classroomStudents: number;
  absentStudents: number;
  withdrawnStudents: number;
}

export interface ExamData {
  subjects: Subject[];
  statistics: Statistics;
  currentSubjectId: number;
}
