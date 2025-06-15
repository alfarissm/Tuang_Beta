// Helper untuk 7 hari terakhir
export function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  }
  return days;
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}