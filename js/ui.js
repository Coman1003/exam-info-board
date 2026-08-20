import { timeToMinutes } from './clock.js';

export function getSubjectStatus(subject, now) {
  const current = now.getHours() * 60 + now.getMinutes();
  const start = timeToMinutes(subject.startTime);
  const end = timeToMinutes(subject.endTime);

  if (current > end) {
    return 'finished';
  }

  if (current >= start && current <= end) {
    return 'active';
  }

  return 'upcoming';
}

const statusMeta = {
  active: {
    className: 'status-active',
    text: '✓ 進行中'
  },
  finished: {
    className: 'status-finished',
    text: '✕ 已考完'
  },
  upcoming: {
    className: 'status-upcoming',
    text: '⏰ 未開始'
  }
};

export function renderSchedule(container, subjects, now) {
  container.innerHTML = '';
  const visibleSubjects = subjects.slice(0, 6);

  visibleSubjects.forEach((subject) => {
    const card = document.createElement('article');
    card.className = 'schedule-item';

    const titleRow = document.createElement('div');
    titleRow.className = 'schedule-item-title';

    const title = document.createElement('strong');
    title.textContent = subject.name || '未命名科目';

    const status = getSubjectStatus(subject, now);
    const statusBadge = document.createElement('span');
    statusBadge.className = `schedule-status ${statusMeta[status].className}`;
    statusBadge.textContent = statusMeta[status].text;

    const time = document.createElement('div');
    time.className = 'schedule-time';
    time.textContent = `${subject.startTime} - ${subject.endTime}`;

    titleRow.append(title, statusBadge);
    card.append(titleRow, time);
    container.appendChild(card);
  });

  if (subjects.length > 6) {
    const more = document.createElement('div');
    more.className = 'schedule-more';
    more.textContent = '還有更多科目...';
    container.appendChild(more);
  }
}

const statCards = [
  { key: 'totalStudents', label: '全班總人數', icon: '📊', className: 'stat-card-pink' },
  { key: 'classroomStudents', label: '教室人數', icon: '🏫', className: 'stat-card-mint' },
  { key: 'absentStudents', label: '缺席人數', icon: '❌', className: 'stat-card-sky' },
  { key: 'withdrawnStudents', label: '抽離人數', icon: '🔄', className: 'stat-card-lavender' }
];

export function renderStatistics(container, statistics) {
  container.innerHTML = '';

  statCards.forEach((card) => {
    const article = document.createElement('article');
    article.className = `stat-card ${card.className}`;

    const label = document.createElement('div');
    label.className = 'stat-label';
    label.textContent = `${card.icon} ${card.label}`;

    const value = document.createElement('div');
    value.className = 'stat-value';
    value.textContent = String(statistics[card.key]);

    article.append(label, value);
    container.appendChild(article);
  });
}

export function fillCurrentSubjectOptions(select, subjects, currentSubjectId) {
  select.innerHTML = '';

  subjects.forEach((subject) => {
    const option = document.createElement('option');
    option.value = String(subject.id);
    option.textContent = subject.name || `科目 ${subject.id}`;
    option.selected = subject.id === currentSubjectId;
    select.appendChild(option);
  });
}
