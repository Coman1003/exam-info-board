import { formatDateTime, startClock } from './clock.js';
import { loadData, saveData } from './storage.js';
import { normalizeNumber, normalizeSubjects, validateStatistics } from './validator.js';
import { fillCurrentSubjectOptions, renderSchedule, renderStatistics } from './ui.js';

const clone = (value) => JSON.parse(JSON.stringify(value));

function getCurrentSubjectName(data) {
  const currentSubject = data.subjects.find((subject) => subject.id === data.currentSubjectId);
  return currentSubject?.name || '尚未設定科目';
}

function renderPreview(data, now = new Date()) {
  const clockEl = document.querySelector('[data-role="clock"]');
  const currentSubjectEl = document.querySelector('[data-role="current-subject"]');
  const scheduleEl = document.querySelector('[data-role="schedule"]');
  const statsEl = document.querySelector('[data-role="statistics"]');

  if (clockEl) {
    clockEl.textContent = `🕐 ${formatDateTime(now)}`;
  }

  if (currentSubjectEl) {
    currentSubjectEl.textContent = getCurrentSubjectName(data);
  }

  if (scheduleEl) {
    renderSchedule(scheduleEl, data.subjects, now);
  }

  if (statsEl) {
    renderStatistics(statsEl, data.statistics);
  }
}

function createSubjectEditorRow(subject, selectedIds, onToggle, onChange) {
  const row = document.createElement('tr');

  const checkCell = document.createElement('td');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = selectedIds.has(subject.id);
  checkbox.addEventListener('change', () => onToggle(subject.id));
  checkCell.appendChild(checkbox);

  const nameCell = document.createElement('td');
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.value = subject.name;
  nameInput.placeholder = '科目名稱';
  nameInput.addEventListener('input', (event) => onChange(subject.id, 'name', event.target.value));
  nameCell.appendChild(nameInput);

  const startCell = document.createElement('td');
  const startInput = document.createElement('input');
  startInput.type = 'time';
  startInput.value = subject.startTime;
  startInput.addEventListener('input', (event) => onChange(subject.id, 'startTime', event.target.value));
  startCell.appendChild(startInput);

  const endCell = document.createElement('td');
  const endInput = document.createElement('input');
  endInput.type = 'time';
  endInput.value = subject.endTime;
  endInput.addEventListener('input', (event) => onChange(subject.id, 'endTime', event.target.value));
  endCell.appendChild(endInput);

  row.append(checkCell, nameCell, startCell, endCell);
  return row;
}

function setupEditor(root, data, options = {}) {
  const subjectRowsEl = root.querySelector('[data-editor="subject-rows"]');
  const addRowButton = root.querySelector('[data-action="add-row"]');
  const removeRowButton = root.querySelector('[data-action="remove-rows"]');
  const saveButton = root.querySelector('[data-action="save"]');
  const cancelButton = root.querySelector('[data-action="cancel"]');
  const warningEl = root.querySelector('[data-role="validation-warning"]');
  const currentSubjectSelect = root.querySelector('[data-editor="current-subject"]');
  const previewEl = root.querySelector('[data-role="subject-preview"]');

  const statInputs = {
    totalStudents: root.querySelector('[name="totalStudents"]'),
    classroomStudents: root.querySelector('[name="classroomStudents"]'),
    absentStudents: root.querySelector('[name="absentStudents"]'),
    withdrawnStudents: root.querySelector('[name="withdrawnStudents"]')
  };

  let draft = clone(data);
  let selectedIds = new Set();

  const render = () => {
    if (!subjectRowsEl) {
      return;
    }

    subjectRowsEl.innerHTML = '';
    draft.subjects.forEach((subject) => {
      const row = createSubjectEditorRow(
        subject,
        selectedIds,
        (subjectId) => {
          if (selectedIds.has(subjectId)) {
            selectedIds.delete(subjectId);
          } else {
            selectedIds.add(subjectId);
          }
          render();
        },
        (subjectId, field, value) => {
          draft.subjects = draft.subjects.map((subject) =>
            subject.id === subjectId ? { ...subject, [field]: value } : subject
          );
          updateCurrentSubjectSection();
        }
      );
      subjectRowsEl.appendChild(row);
    });

    Object.entries(statInputs).forEach(([key, input]) => {
      if (input) {
        input.value = String(draft.statistics[key]);
      }
    });

    fillCurrentSubjectOptions(currentSubjectSelect, draft.subjects, draft.currentSubjectId);
    updateCurrentSubjectSection();
    const valid = validateStatistics(draft.statistics);
    if (warningEl) {
      warningEl.hidden = valid;
    }
    if (saveButton) {
      saveButton.disabled = false;
    }
  };

  const updateCurrentSubjectSection = () => {
    const selected = draft.subjects.find((subject) => subject.id === draft.currentSubjectId);
    if (previewEl) {
      previewEl.textContent = selected
        ? `預覽：${selected.name || '未命名科目'} (${selected.startTime} - ${selected.endTime})`
        : '尚未選擇科目';
    }
  };

  const reset = (nextData = data) => {
    draft = clone(nextData);
    selectedIds = new Set();
    render();
  };

  addRowButton?.addEventListener('click', () => {
    const nextId = draft.subjects.length ? Math.max(...draft.subjects.map((subject) => subject.id)) + 1 : 1;
    draft.subjects.push({ id: nextId, name: '', startTime: '09:00', endTime: '10:00' });
    render();
  });

  removeRowButton?.addEventListener('click', () => {
    if (!selectedIds.size) {
      return;
    }

    draft.subjects = draft.subjects.filter((subject) => !selectedIds.has(subject.id));
    selectedIds = new Set();

    if (!draft.subjects.length) {
      const fallbackId = 1;
      draft.subjects = [{ id: fallbackId, name: '', startTime: '09:00', endTime: '10:00' }];
      draft.currentSubjectId = fallbackId;
    }

    if (!draft.subjects.some((subject) => subject.id === draft.currentSubjectId)) {
      draft.currentSubjectId = draft.subjects[0].id;
    }

    render();
  });

  Object.entries(statInputs).forEach(([key, input]) => {
    input?.addEventListener('input', (event) => {
      draft.statistics[key] = normalizeNumber(event.target.value);
      const valid = validateStatistics(draft.statistics);
      if (warningEl) {
        warningEl.hidden = valid;
      }
    });
  });

  currentSubjectSelect?.addEventListener('change', (event) => {
    draft.currentSubjectId = Number(event.target.value);
    updateCurrentSubjectSection();
  });

  saveButton?.addEventListener('click', () => {
    draft.subjects = normalizeSubjects(draft.subjects).map((subject, index) => ({
      ...subject,
      id: index + 1
    }));

    if (!draft.subjects.length) {
      draft.subjects = [{ id: 1, name: '未命名科目', startTime: '09:00', endTime: '10:00' }];
    }

    if (!draft.subjects.some((subject) => subject.id === draft.currentSubjectId)) {
      draft.currentSubjectId = draft.subjects[0].id;
    }

    options.onSave?.(clone(draft));
  });

  cancelButton?.addEventListener('click', () => {
    options.onCancel?.();
  });

  render();

  return {
    reset
  };
}

function initDisplayPage() {
  const modal = document.querySelector('[data-role="edit-modal"]');
  const openButton = document.querySelector('[data-action="open-editor"]');
  const closeButton = modal?.querySelector('[data-action="close-modal"]');
  let data = loadData();

  const editor = setupEditor(modal, data, {
    onSave(nextData) {
      data = nextData;
      saveData(data);
      editor.reset(data);
      modal.hidden = true;
      renderPreview(data);
    },
    onCancel() {
      modal.hidden = true;
      editor.reset(data);
    }
  });

  openButton?.addEventListener('click', () => {
    editor.reset(data);
    modal.hidden = false;
  });

  closeButton?.addEventListener('click', () => {
    modal.hidden = true;
    editor.reset(data);
  });

  modal?.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.hidden = true;
      editor.reset(data);
    }
  });

  startClock((now) => {
    renderPreview(data, now);
  });

  renderPreview(data);
}

function initAdminPage() {
  const editorRoot = document.querySelector('[data-role="admin-editor"]');
  let data = loadData();

  setupEditor(editorRoot, data, {
    onSave(nextData) {
      data = nextData;
      saveData(data);
      renderPreview(data);
    }
  });

  startClock((now) => {
    renderPreview(data, now);
  });

  renderPreview(data);
}

function init() {
  const page = document.body.dataset.page;

  if (page === 'admin') {
    initAdminPage();
  } else {
    initDisplayPage();
  }
}

init();
