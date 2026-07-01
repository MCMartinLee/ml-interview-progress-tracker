const toastRoot = document.getElementById("toastRoot");

export function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.setAttribute("role", type === "error" ? "alert" : "status");
  toast.textContent = message;
  toastRoot.appendChild(toast);
  setTimeout(() => toast.remove(), 5200);
}

export function errorMessage(error) {
  const code = error?.code || "";
  if (code.includes("permission-denied")) return "Permission denied. Check your Firestore rules and sign in again.";
  if (code.includes("unauthenticated")) return "Your session expired. Please sign in again.";
  if (code.includes("resource-exhausted")) return "Firestore quota was exceeded. Try again later.";
  if (code.includes("unavailable")) return "Firestore is unavailable. Your offline changes will retry.";
  return error?.message || "Something went wrong.";
}

