// overlapUtils.js
// Algorithm to determine columns for overlapping events

export const computeEventPositions = (events) => {
  // Sort events by start time. If same, put longest first.
  const sorted = [...events].sort((a, b) => {
    const aStart = new Date(a.start).getTime();
    const bStart = new Date(b.start).getTime();
    if (aStart !== bStart) return aStart - bStart;
    
    const aEnd = new Date(a.end).getTime();
    const bEnd = new Date(b.end).getTime();
    return (bEnd - bStart) - (aEnd - aStart);
  });

  const columns = [];
  
  // Assign columns
  sorted.forEach(evt => {
    let placed = false;
    for (let i = 0; i < columns.length; i++) {
      const lastEventInColumn = columns[i][columns[i].length - 1];
      if (new Date(lastEventInColumn.end).getTime() <= new Date(evt.start).getTime()) {
        columns[i].push(evt);
        evt._column = i;
        placed = true;
        break;
      }
    }
    if (!placed) {
      evt._column = columns.length;
      columns.push([evt]);
    }
  });

  // Calculate widths and offsets
  const numColumns = columns.length;
  sorted.forEach(evt => {
    // Basic standard width sharing
    evt._width = 100 / numColumns;
    evt._left = evt._column * evt._width;
  });

  return sorted;
};
