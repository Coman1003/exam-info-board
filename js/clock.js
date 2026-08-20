const pad = (value) => String(value).padStart(2, '0');

export function formatDateTime(date) {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function startClock(onTick) {
  onTick(new Date());
  const timer = window.setInterval(() => onTick(new Date()), 1000);
  return () => window.clearInterval(timer);
}

export function timeToMinutes(value) {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}
