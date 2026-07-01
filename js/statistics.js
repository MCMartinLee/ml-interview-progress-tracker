/** Computes current and longest active-day streaks from day statistics. */
export function getStreaks(dayStats) {
  let longest = 0;
  let current = 0;
  let run = 0;
  dayStats.forEach(stat => {
    run = stat.percent > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  });
  for (let index = dayStats.length - 1; index >= 0; index--) {
    if (dayStats[index].percent > 0) current += 1;
    else if (current) break;
  }
  return { current, longest };
}

