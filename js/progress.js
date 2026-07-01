/** Returns the stable checkbox key used for a plan task. */
export function taskKey(dayId, block, index) {
  return `d${dayId}-${block}-${index}`;
}

/** Normalizes possibly partial progress data from Firestore or imports. */
export function normalizeProgress(value = {}) {
  return {
    checks: value.checks || {},
    notes: value.notes || {},
    openDays: value.openDays || []
  };
}

