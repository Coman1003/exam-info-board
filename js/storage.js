const STORAGE_KEY = 'exam-info-board-data';

const DEFAULT_DATA = {
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

const clone = (value) => JSON.parse(JSON.stringify(value));

export function getDefaultData() {
  return clone(DEFAULT_DATA);
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getDefaultData();
    }

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.subjects) || !parsed.statistics) {
      return getDefaultData();
    }

    return {
      ...getDefaultData(),
      ...parsed,
      statistics: {
        ...getDefaultData().statistics,
        ...parsed.statistics
      }
    };
  } catch (error) {
    console.warn('Failed to load data from localStorage:', error);
    return getDefaultData();
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
