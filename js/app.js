import { BLOCKS, PLAN } from "./data.js";
import { loginWithGoogle, logout, watchAuth } from "./auth.js";
import { isFirebaseConfigured } from "./firebase.js";
import {
  cloudState,
  deleteApplication,
  deleteInterview,
  exportAllData,
  hasLocalData,
  importCloudJSON,
  importLocalData,
  saveProgressDebounced,
  saveSettings,
  setSyncingCallback,
  startUserData,
  stopUserData,
  upsertApplication,
  upsertInterview
} from "./firestore.js";
import { showToast } from "./notifications.js";
import { KANBAN_COLUMNS, normalizeStatus } from "./applications.js";
import { normalizeProgress, taskKey } from "./progress.js";
import { getResourceUrl } from "./resources.js";
import { getStreaks } from "./statistics.js";
import { escapeHTML, formatDate, toLocalDateString } from "./tracker.js";

const CATEGORIES = {
  ML: ["R", "C"],
  LLM: ["R", "C"],
  "System Design": ["I"],
  Behavioral: ["I"],
  LeetCode: ["I"],
  Applications: ["J"]
};
const KANBAN = KANBAN_COLUMNS;

let user = null;
let progress = { checks: {}, notes: {}, openDays: [] };
let deferredInstallPrompt = null;

const $ = selector => document.querySelector(selector);

setSyncingCallback(syncing => updateSyncStatus(syncing ? "Syncing..." : navigator.onLine ? "Online" : "Offline"));

$("#loginBtn").addEventListener("click", loginWithGoogle);
$("#logoutBtn").addEventListener("click", logout);
$("#themeBtn").addEventListener("click", toggleTheme);
$("#addJobBtn").addEventListener("click", () => openJobDialog());
$("#addInterviewBtn").addEventListener("click", () => openInterviewDialog());
$("#exportJsonBtn").addEventListener("click", exportJSON);
$("#exportCsvBtn").addEventListener("click", exportCSV);
$("#exportMarkdownBtn").addEventListener("click", exportMarkdown);
$("#importInput").addEventListener("change", importJSON);
$("#expandAllBtn").addEventListener("click", () => updateProgress({ openDays: PLAN.map(day => day.id) }));
$("#collapseAllBtn").addEventListener("click", () => updateProgress({ openDays: [] }));
["#weekFilter", "#statusFilter", "#searchInput"].forEach(selector => $(selector).addEventListener("input", renderSchedule));
window.addEventListener("online", () => updateSyncStatus("Online"));
window.addEventListener("offline", () => updateSyncStatus("Offline"));
window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  $("#installBtn").hidden = false;
});
$("#installBtn").addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  $("#installBtn").hidden = true;
});

watchAuth(async authUser => {
  user = authUser;
  renderAuth();
  if (!authUser) {
    stopUserData();
    progress = { checks: {}, notes: {}, openDays: [] };
    renderAll();
    return;
  }
  if (hasLocalData() && confirm("Import existing local progress into cloud?")) {
    await importLocalData(authUser.uid);
    showToast("Local progress imported into Firestore.", "success");
  }
  await startUserData(authUser.uid, () => {
    progress = normalizeProgress(cloudState.progress);
    applyTheme(cloudState.settings.theme || "system");
    renderAll();
  });
});

function renderAll() {
  renderSchedule();
  renderDashboard();
  renderKanban();
  renderInterviews();
  setupToday();
}

function renderAuth() {
  $("#appRoot").classList.toggle("app-disabled", !user);
  $("#signinNotice").hidden = Boolean(user);
  $("#loginBtn").hidden = Boolean(user);
  $("#logoutBtn").hidden = !user;
  $("#userName").textContent = user?.displayName || user?.email || (isFirebaseConfigured() ? "Please sign in" : "Configure Firebase");
  $("#userAvatar").hidden = !user?.photoURL;
  if (user?.photoURL) $("#userAvatar").src = user.photoURL;
}

function renderSchedule() {
  const schedule = $("#schedule");
  const week = $("#weekFilter").value;
  const status = $("#statusFilter").value;
  const query = $("#searchInput").value.trim().toLowerCase();
  schedule.innerHTML = "";
  PLAN.filter(day => {
    const stats = getDayStats(day);
    const haystack = `${day.title} ${day.date} ${day.weekday} ${Object.values(day.tasks).flat().join(" ")}`.toLowerCase();
    return (week === "all" || String(day.week) === week)
      && (status === "all" || (status === "complete" ? stats.complete : !stats.complete))
      && (!query || haystack.includes(query));
  }).forEach(day => schedule.appendChild(renderDay(day)));
  if (!schedule.children.length) schedule.innerHTML = '<p class="empty-state">No days match the current filters.</p>';
}

function renderDay(day) {
  const node = $("#dayTemplate").content.firstElementChild.cloneNode(true);
  const stats = getDayStats(day);
  const body = node.querySelector(".day-card__body");
  const summary = node.querySelector(".day-card__summary");
  const isOpen = progress.openDays.includes(day.id);
  node.id = `day-${day.id}`;
  node.classList.toggle("is-complete", stats.complete);
  node.classList.toggle("is-open", isOpen);
  node.classList.toggle("is-today", day.date === toLocalDateString(new Date()));
  body.hidden = !isOpen;
  summary.setAttribute("aria-expanded", String(isOpen));
  node.querySelector(".day-card__date").textContent = `${day.weekday}, ${formatDate(day.date)}`;
  node.querySelector(".day-card__title").textContent = `Day ${day.id}: ${day.title}`;
  node.querySelector(".day-card__meta").textContent = `Week ${day.week} - 5 hours`;
  node.querySelector(".day-card__percent").textContent = `${stats.percent}%`;
  node.querySelector(".day-progress span").style.width = `${stats.percent}%`;
  summary.addEventListener("click", () => {
    const openDays = isOpen ? progress.openDays.filter(id => id !== day.id) : [...new Set([...progress.openDays, day.id])];
    updateProgress({ openDays });
  });

  Object.entries(day.tasks).forEach(([block, tasks]) => {
    const blockResourceUrl = tasks.map(task => getResourceUrl(task)).find(Boolean) || getDayResourceUrl(day, block);
    const section = document.createElement("section");
    section.className = "block";
    section.innerHTML = `<div class="block__header"><span class="block__name"><span class="block__code">${block}</span>${BLOCKS[block].label}</span><span>${BLOCKS[block].minutes} min</span></div><ul class="task-list"></ul>`;
    const list = section.querySelector(".task-list");
    tasks.forEach((task, index) => {
      const key = taskKey(day.id, block, index);
      const resourceUrl = getResourceUrl(task) || blockResourceUrl;
      const item = document.createElement("li");
      item.className = "task";
      item.innerHTML = `<input type="checkbox" aria-label="${escapeHTML(task)}"><span>${renderTaskText(task, resourceUrl)}</span>`;
      const checkbox = item.querySelector("input");
      checkbox.checked = Boolean(progress.checks[key]);
      checkbox.disabled = !user;
      checkbox.addEventListener("change", () => updateProgress({ checks: { ...progress.checks, [key]: checkbox.checked } }));
      list.appendChild(item);
    });
    node.querySelector(".blocks").appendChild(section);
  });
  const notes = node.querySelector(".day-notes");
  notes.value = progress.notes[day.id] || "";
  notes.disabled = !user;
  notes.addEventListener("input", () => updateProgress({ notes: { ...progress.notes, [day.id]: notes.value } }, false));
  return node;
}

function renderDashboard() {
  const stats = PLAN.map(getDayStats);
  const completedMinutes = stats.reduce((sum, item) => sum + item.completedMinutes, 0);
  const totalMinutes = stats.reduce((sum, item) => sum + item.totalMinutes, 0);
  const percent = totalMinutes ? Math.round((completedMinutes / totalMinutes) * 100) : 0;
  const applications = cloudState.applications;
  const interviews = cloudState.interviews;
  $("#overallPercent").textContent = `${percent}%`;
  $("#overallBar").style.width = `${percent}%`;
  $("#hoursComplete").textContent = (completedMinutes / 60).toFixed(1);
  $("#hoursRemaining").textContent = Math.max(0, (totalMinutes - completedMinutes) / 60).toFixed(1);
  $("#daysComplete").textContent = `${stats.filter(item => item.complete).length} / ${PLAN.length}`;
  $("#applicationsCount").textContent = applications.length;
  $("#interviewsCount").textContent = interviews.length;
  $("#offersCount").textContent = applications.filter(item => item.status === "Offer").length;
  $("#leetcodeCount").textContent = countCheckedTasks("LeetCode");
  $("#flashcardsCount").textContent = estimateFlashcards();
  const streaks = getStreaks(stats);
  $("#currentStreak").textContent = streaks.current;
  $("#longestStreak").textContent = streaks.longest;
  renderCategoryStats();
  renderWeeklyChart(stats);
  renderHeatmap(stats);
}

function renderCategoryStats() {
  const root = $("#categoryStats");
  root.innerHTML = "";
  Object.keys(CATEGORIES).forEach(name => {
    const value = categoryPercent(name);
    root.insertAdjacentHTML("beforeend", `<div class="category-row"><span>${name}</span><div class="progress"><span style="width:${value}%"></span></div><strong>${value}%</strong></div>`);
  });
  root.insertAdjacentHTML("beforeend", `<div class="category-row"><span>Overall</span><div class="progress"><span style="width:${$("#overallPercent").textContent}"></span></div><strong>${$("#overallPercent").textContent}</strong></div>`);
}

function renderWeeklyChart(stats) {
  const root = $("#weeklyChart");
  root.innerHTML = "";
  [1, 2, 3, 4].forEach(week => {
    const weekDays = PLAN.map((day, index) => ({ day, stat: stats[index] })).filter(item => item.day.week === week);
    const percent = Math.round(weekDays.reduce((sum, item) => sum + item.stat.percent, 0) / weekDays.length);
    root.insertAdjacentHTML("beforeend", `<div class="bar-row"><span>Week ${week}</span><div class="progress"><span style="width:${percent}%"></span></div><strong>${percent}%</strong></div>`);
  });
}

function renderHeatmap(stats) {
  const root = $("#heatmap");
  root.innerHTML = "";
  PLAN.forEach((day, index) => {
    const percent = stats[index].percent;
    root.insertAdjacentHTML("beforeend", `<div class="heat-cell" title="Day ${day.id}: ${percent}%" style="--level:${Math.max(8, percent)}%">${day.id}</div>`);
  });
}

function renderKanban() {
  const root = $("#kanban");
  root.innerHTML = "";
  KANBAN.forEach(status => {
    const column = document.createElement("section");
    column.className = "kanban-column";
    column.dataset.status = status;
    column.innerHTML = `<h3>${status}</h3>`;
    column.addEventListener("dragover", event => event.preventDefault());
    column.addEventListener("drop", event => {
      event.preventDefault();
      const id = event.dataTransfer.getData("text/plain");
      const app = cloudState.applications.find(item => item.id === id);
      if (app) upsertApplication({ ...app, status });
    });
    cloudState.applications.filter(item => normalizeStatus(item.status) === status).forEach(item => column.appendChild(renderJobCard(item)));
    root.appendChild(column);
  });
}

function renderJobCard(application) {
  const card = document.createElement("article");
  card.className = "job-card";
  card.draggable = Boolean(user);
  card.addEventListener("dragstart", event => event.dataTransfer.setData("text/plain", application.id));
  card.innerHTML = `<strong>${escapeHTML(application.company || "Untitled company")}</strong><span>${escapeHTML(application.role || "")}</span><small>${escapeHTML(application.appliedDate || "")} ${escapeHTML(application.location || "")}</small><div class="card-actions"><button class="icon-button">Edit</button><button class="icon-button">Delete</button></div>`;
  card.querySelectorAll("button")[0].addEventListener("click", () => openJobDialog(application));
  card.querySelectorAll("button")[1].addEventListener("click", () => confirm("Delete this application?") && deleteApplication(application.id));
  return card;
}

function renderInterviews() {
  const root = $("#interviewList");
  root.innerHTML = "";
  if (!cloudState.interviews.length) {
    root.innerHTML = '<p class="empty-state">No interviews logged yet.</p>';
    return;
  }
  cloudState.interviews.sort((a, b) => (b.date || "").localeCompare(a.date || "")).forEach(interview => {
    const card = document.createElement("article");
    card.className = "interview-card";
    card.innerHTML = `<strong>${escapeHTML(interview.company)} - ${escapeHTML(interview.role)}</strong><span>${escapeHTML(interview.date || "")} - ${escapeHTML(interview.rounds || "")}</span><p>${escapeHTML(interview.result || "Pending")}</p><small>Weak areas: ${escapeHTML(interview.weakAreas || "")}</small><div class="card-actions"><button class="icon-button">Edit</button><button class="icon-button">Delete</button></div>`;
    card.querySelectorAll("button")[0].addEventListener("click", () => openInterviewDialog(interview));
    card.querySelectorAll("button")[1].addEventListener("click", () => confirm("Delete this interview?") && deleteInterview(interview.id));
    root.appendChild(card);
  });
}

function openJobDialog(application = {}) {
  const dialog = $("#jobDialog");
  dialog.innerHTML = `<form class="dialog-form" method="dialog"><div class="dialog-heading"><h2>${application.id ? "Edit" : "Add"} application</h2><button class="icon-button" value="cancel" type="button">Close</button></div><div class="form-grid">
    ${field("Company", "company", application.company, "required")}
    ${field("Role", "role", application.role, "required")}
    ${field("Source", "source", application.source)}
    ${selectField("Status", "status", normalizeStatus(application.status))}
    ${field("Applied Date", "appliedDate", application.appliedDate || application.date, "", "date")}
    ${field("Next Step", "nextStep", application.nextStep)}
    ${field("Salary", "salary", application.salary)}
    ${field("Location", "location", application.location)}
    ${field("Notes", "notes", application.notes, "", "textarea full")}
  </div><div class="dialog-actions"><button type="button" class="button button--secondary">Cancel</button><button class="button" type="submit">Save</button></div></form>`;
  dialog.querySelector(".icon-button").addEventListener("click", () => dialog.close());
  dialog.querySelector(".button--secondary").addEventListener("click", () => dialog.close());
  dialog.querySelector("form").addEventListener("submit", event => {
    event.preventDefault();
    upsertApplication({ ...application, ...formData(event.currentTarget) });
    dialog.close();
  });
  dialog.showModal();
}

function openInterviewDialog(interview = {}) {
  const dialog = $("#interviewDialog");
  dialog.innerHTML = `<form class="dialog-form" method="dialog"><div class="dialog-heading"><h2>${interview.id ? "Edit" : "Add"} interview</h2><button class="icon-button" type="button">Close</button></div><div class="form-grid">
    ${field("Company", "company", interview.company, "required")}
    ${field("Role", "role", interview.role, "required")}
    ${field("Date", "date", interview.date, "", "date")}
    ${field("Rounds", "rounds", interview.rounds)}
    ${field("Questions Asked", "questionsAsked", interview.questionsAsked, "", "textarea full")}
    ${field("Behavioral Notes", "behavioralNotes", interview.behavioralNotes, "", "textarea full")}
    ${field("Coding Questions", "codingQuestions", interview.codingQuestions, "", "textarea full")}
    ${field("Weak Areas", "weakAreas", interview.weakAreas, "", "textarea full")}
    ${field("Next Follow-up", "nextFollowUp", interview.nextFollowUp)}
    ${field("Result", "result", interview.result)}
  </div><div class="dialog-actions"><button type="button" class="button button--secondary">Cancel</button><button class="button" type="submit">Save</button></div></form>`;
  dialog.querySelector(".icon-button").addEventListener("click", () => dialog.close());
  dialog.querySelector(".button--secondary").addEventListener("click", () => dialog.close());
  dialog.querySelector("form").addEventListener("submit", event => {
    event.preventDefault();
    upsertInterview({ ...interview, ...formData(event.currentTarget) });
    dialog.close();
  });
  dialog.showModal();
}

function updateProgress(patch, rerender = true) {
  if (!user) return showToast("Please sign in to edit.", "warning");
  progress = normalizeProgress({ ...progress, ...patch });
  saveProgressDebounced(progress);
  if (rerender) renderAll();
  else renderDashboard();
}

function getDayStats(day) {
  let checkedTasks = 0, totalTasks = 0, completedMinutes = 0, totalMinutes = 0;
  Object.entries(day.tasks).forEach(([block, tasks]) => {
    const checked = tasks.filter((_, index) => progress.checks[taskKey(day.id, block, index)]).length;
    checkedTasks += checked;
    totalTasks += tasks.length;
    totalMinutes += BLOCKS[block].minutes;
    completedMinutes += BLOCKS[block].minutes * (checked / tasks.length);
  });
  return { checkedTasks, totalTasks, percent: totalTasks ? Math.round((checkedTasks / totalTasks) * 100) : 0, completedMinutes, totalMinutes, complete: checkedTasks === totalTasks };
}

function categoryPercent(name) {
  let done = 0, total = 0;
  PLAN.forEach(day => Object.entries(day.tasks).forEach(([block, tasks]) => {
    const text = `${day.title} ${tasks.join(" ")}`;
    const include = name === "Overall" || (name === "LLM" ? /LLM|GPT|token|attention|transformer|SFT/i.test(text) : name === "ML" ? day.week <= 2 : name === "LeetCode" ? /LeetCode/i.test(text) : name === "Behavioral" ? /behavior|STAR|Tell me/i.test(text) : name === "System Design" ? /System design|Design a|crawler|URL/i.test(text) : CATEGORIES[name]?.includes(block));
    if (!include) return;
    total += tasks.length;
    done += tasks.filter((_, index) => progress.checks[taskKey(day.id, block, index)]).length;
  }));
  return total ? Math.round((done / total) * 100) : 0;
}

function countCheckedTasks(pattern) {
  return PLAN.reduce((sum, day) => sum + Object.entries(day.tasks).reduce((blockSum, [block, tasks]) => blockSum + tasks.filter((task, index) => new RegExp(pattern, "i").test(task) && progress.checks[taskKey(day.id, block, index)]).length, 0), 0);
}

function estimateFlashcards() {
  return PLAN.reduce((sum, day) => sum + (day.tasks.Q || []).filter((_, index) => progress.checks[taskKey(day.id, "Q", index)]).length * 8, 0);
}

async function exportJSON() {
  if (!user) return;
  download(`ml-tracker-${toLocalDateString(new Date())}.json`, JSON.stringify(await exportAllData(user.uid), null, 2), "application/json");
}

function exportCSV() {
  const rows = [["company", "role", "source", "status", "appliedDate", "nextStep", "salary", "location", "notes"], ...cloudState.applications.map(item => ["company", "role", "source", "status", "appliedDate", "nextStep", "salary", "location", "notes"].map(key => csv(item[key] || "")))];
  download("applications.csv", rows.map(row => row.join(",")).join("\n"), "text/csv");
}

function exportMarkdown() {
  const summary = `# ML Interview Tracker Summary\n\nOverall progress: ${$("#overallPercent").textContent}\nApplications: ${cloudState.applications.length}\nInterviews: ${cloudState.interviews.length}\nOffers: ${$("#offersCount").textContent}\nLeetCode solved: ${$("#leetcodeCount").textContent}\nFlashcards created: ${$("#flashcardsCount").textContent}\n`;
  download("ml-tracker-summary.md", summary, "text/markdown");
}

async function importJSON(event) {
  const file = event.target.files[0];
  if (!file || !user) return;
  try {
    await importCloudJSON(user.uid, JSON.parse(await file.text()));
    showToast("Import complete.", "success");
  } catch {
    showToast("Could not import that JSON file.", "error");
  } finally {
    event.target.value = "";
  }
}

function setupToday() {
  const today = PLAN.find(day => day.date === toLocalDateString(new Date()));
  $("#todayPanel").hidden = !today;
  if (!today) return;
  $("#todayTitle").textContent = `Day ${today.id}: ${today.title}`;
  $("#jumpTodayBtn").onclick = () => {
    updateProgress({ openDays: [...new Set([...progress.openDays, today.id])] });
    $(`#day-${today.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  if (user) saveSettings({ ...cloudState.settings, theme: next });
}

function applyTheme(theme) {
  const resolved = theme === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme;
  document.documentElement.dataset.theme = resolved;
}

function updateSyncStatus(text) {
  $("#syncStatus").textContent = text;
}

function field(label, name, value = "", attrs = "", type = "text") {
  const full = attrs.includes("full") ? " class=\"full\"" : "";
  if (type.includes("textarea")) return `<label${full}>${label}<textarea name="${name}" rows="3">${escapeHTML(value || "")}</textarea></label>`;
  return `<label${full}>${label}<input name="${name}" type="${type}" value="${escapeHTML(value || "")}" ${attrs}></label>`;
}

function selectField(label, name, value) {
  return `<label>${label}<select name="${name}">${KANBAN.map(item => `<option ${item === value ? "selected" : ""}>${item}</option>`).join("")}</select></label>`;
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function renderTaskText(task, resourceUrl) {
  if (!resourceUrl) return escapeHTML(task);
  return `<a class="resource-link" href="${escapeHTML(resourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(task)}</a>`;
}

function getDayResourceUrl(day, block) {
  if (block === "J") return "https://www.linkedin.com/jobs/";
  if (block === "Q") return getStudyResourceUrl(day);
  if (block === "LOG") return getStudyResourceUrl(day);
  if (block === "R" || block === "C") return getStudyResourceUrl(day);
  if (block === "I" && day.week <= 2) return "https://leetcode.com";
  if (block === "I" && day.week === 3) return "https://github.com/rasbt/LLMs-from-scratch";
  if (block === "I" && day.week === 4 && /system|design|crawler|agent/i.test(day.title)) return "https://github.com/donnemartin/system-design-primer";
  if (block === "I" && day.week === 4) return "https://leetcode.com";
  return "";
}

function getStudyResourceUrl(day) {
  if (day.week <= 2) return "https://github.com/ageron/handson-mlp";
  if (day.week === 3) return "https://github.com/rasbt/LLMs-from-scratch";
  if (day.week === 4) return "https://github.com/microsoft/ai-agents-for-beginners";
  return "https://github.com/ageron/handson-mlp";
}

function csv(value) { return `"${String(value).replaceAll('"', '""')}"`; }
function download(name, content, type) { const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([content], { type })); link.download = name; link.click(); URL.revokeObjectURL(link.href); }

if ("serviceWorker" in navigator) navigator.serviceWorker.register("service-worker.js");
applyTheme("system");
renderAuth();
renderAll();
