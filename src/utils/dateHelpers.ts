export function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function toTimeString(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function generateTimeSlots(
  start: string,
  end: string,
  duration: number
) {
  const startM = toMinutes(start);
  const endM = toMinutes(end);
  const result: string[] = [];
  for (let t = startM; t + duration <= endM; t += duration) {
    result.push(toTimeString(t));
  }
  return result;
}

export function getNextDates(days = 60) {
  const today = new Date();
  return Array.from({ length: days }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return d;
  });
}
