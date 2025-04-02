export const getNextDays = (startDate, count = 7) => {
    const days = [];
    for (let i = 0; i < count; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };
  
  export const formatDate = (date) =>
    date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  