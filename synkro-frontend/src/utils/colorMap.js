const dayColors = ['#CD7B60', '#569CD6', '#B388EB', '#F2C94C', '#6FCF97', '#F2994A', '#EB5757'];

function hashDateToColorIndex(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % dayColors.length;
}

export const getColorForDate = (dateStr) => {
  return dayColors[hashDateToColorIndex(dateStr)];
};
