export function validateStatistics(statistics) {
  const sum =
    Number(statistics.classroomStudents) +
    Number(statistics.absentStudents) +
    Number(statistics.withdrawnStudents);

  return sum === Number(statistics.totalStudents);
}

export function normalizeNumber(value) {
  const number = Number(value);
  return Number.isNaN(number) || number < 0 ? 0 : number;
}

export function normalizeSubjects(subjects) {
  return subjects
    .map((subject) => ({
      ...subject,
      name: String(subject.name || '').trim(),
      startTime: subject.startTime || '09:00',
      endTime: subject.endTime || '10:00'
    }))
    .filter((subject) => subject.name || subject.startTime || subject.endTime);
}
