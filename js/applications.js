export const KANBAN_COLUMNS = ["Saved", "Applied", "Recruiter", "OA", "Interview", "Offer", "Rejected"];

/** Maps legacy application statuses into the current Kanban board columns. */
export function normalizeStatus(status = "Applied") {
  if (status === "Recruiter Contact") return "Recruiter";
  if (status === "Assessment") return "OA";
  return KANBAN_COLUMNS.includes(status) ? status : "Applied";
}

