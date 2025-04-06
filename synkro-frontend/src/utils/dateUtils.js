export const getNextDays = (startDate, count = 7) => {
  const days = [];
  const baseDate = new Date(startDate);
  for (let i = 0; i < count; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    days.push(d);
  }
  return days;
};


export const formatDate = (date) =>
  date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
