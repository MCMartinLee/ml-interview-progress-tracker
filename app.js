const STORAGE_KEY = "mlSprintProgressV1";
const JOBS_KEY = "mlSprintJobsV1";

const state = loadJSON(STORAGE_KEY, { checks: {}, notes: {}, openDays: [] });
let jobs = loadJSON(JOBS_KEY, []);

const scheduleEl = document.getElementById("schedule");
const dayTemplate = document.getElementById("dayTemplate");
const weekFilter = document.getElementById("weekFilter");
const statusFilter = document.getElementById("statusFilter");
const searchInput = document.getElementById("searchInput");
const jobDialog = document.getElementById("jobDialog");
const jobForm = document.getElementById("jobForm");

function loadJSON(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateDashboard();
}

function saveJobs() {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  renderJobs();
  updateDashboard();
}

function taskKey(dayId, block, index) {
  return `d${dayId}-${block}-${index}`;
}

function getDayStats(item) {
  let checkedTasks = 0;
  let totalTasks = 0;
  let completedMinutes = 0;
  let totalMinutes = 0;

  Object.entries(item.tasks).forEach(([block, tasks]) => {
    totalTasks += tasks.length;
    const blockChecked = tasks.filter((_, index) => state.checks[taskKey(item.id, block, index)]).length;
    checkedTasks += blockChecked;
    totalMinutes += BLOCKS[block].minutes;
    completedMinutes += BLOCKS[block].minutes * (blockChecked / tasks.length);
  });

  return {
    checkedTasks,
    totalTasks,
    percent: totalTasks ? Math.round((checkedTasks / totalTasks) * 100) : 0,
    completedMinutes,
    totalMinutes,
    complete: checkedTasks === totalTasks
  };
}

function renderSchedule() {
  const week = weekFilter.value;
  const status = statusFilter.value;
  const query = searchInput.value.trim().toLowerCase();
  scheduleEl.innerHTML = "";

  PLAN.filter(item => {
    const stats = getDayStats(item);
    const weekMatch = week === "all" || String(item.week) === week;
    const statusMatch = status === "all" || (status === "complete" ? stats.complete : !stats.complete);
    const haystack = `${item.title} ${item.date} ${item.weekday} ${Object.values(item.tasks).flat().join(" ")}`.toLowerCase();
    return weekMatch && statusMatch && (!query || haystack.includes(query));
  }).forEach(item => scheduleEl.appendChild(renderDay(item)));

  if (!scheduleEl.children.length) {
    scheduleEl.innerHTML = '<p class="empty-state">No days match the current filters.</p>';
  }
}

function renderDay(item) {
  const node = dayTemplate.content.firstElementChild.cloneNode(true);
  const stats = getDayStats(item);
  const summary = node.querySelector(".day-card__summary");
  const body = node.querySelector(".day-card__body");
  const notes = node.querySelector(".day-notes");
  const isOpen = state.openDays.includes(item.id);
  const todayString = toLocalDateString(new Date());

  node.id = `day-${item.id}`;
  node.classList.toggle("is-complete", stats.complete);
  node.classList.toggle("is-open", isOpen);
  node.classList.toggle("is-today", item.date === todayString);
  summary.setAttribute("aria-expanded", String(isOpen));
  body.hidden = !isOpen;
  node.querySelector(".day-card__date").textContent = `${item.weekday}, ${formatDate(item.date)}`;
  node.querySelector(".day-card__title").textContent = `Day ${item.id}: ${item.title}`;
  node.querySelector(".day-card__meta").textContent = `Week ${item.week} · 5 hours`;
  node.querySelector(".day-card__percent").textContent = `${stats.percent}%`;
  node.querySelector(".day-progress span").style.width = `${stats.percent}%`;

  summary.addEventListener("click", () => {
    const currentlyOpen = !body.hidden;
    body.hidden = currentlyOpen;
    node.classList.toggle("is-open", !currentlyOpen);
    summary.setAttribute("aria-expanded", String(!currentlyOpen));
    state.openDays = currentlyOpen
      ? state.openDays.filter(id => id !== item.id)
      : [...new Set([...state.openDays, item.id])];
    saveState();
  });

  const blocksEl = node.querySelector(".blocks");
  Object.entries(item.tasks).forEach(([block, tasks]) => {
    const section = document.createElement("section");
    section.className = "block";
    section.innerHTML = `
      <div class="block__header">
        <span class="block__name"><span class="block__code">${block}</span>${BLOCKS[block].label}</span>
        <span class="block__time">${BLOCKS[block].minutes} min</span>
      </div>
      <ul class="task-list"></ul>`;
    const list = section.querySelector(".task-list");

    tasks.forEach((task, index) => {
      const key = taskKey(item.id, block, index);
      const li = document.createElement("li");
      li.className = "task";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = Boolean(state.checks[key]);
      checkbox.setAttribute("aria-label", task);
      const span = document.createElement("span");
      span.textContent = task;
      checkbox.addEventListener("change", () => {
        state.checks[key] = checkbox.checked;
        saveState();
        renderSchedule();
      });
      li.append(checkbox, span);
      list.appendChild(li);
    });
    blocksEl.appendChild(section);
  });

  notes.value = state.notes[item.id] || "";
  notes.addEventListener("input", () => {
    state.notes[item.id] = notes.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  });

  return node;
}

function updateDashboard() {
  const stats = PLAN.map(getDayStats);
  const completedMinutes = stats.reduce((sum, item) => sum + item.completedMinutes, 0);
  const totalMinutes = stats.reduce((sum, item) => sum + item.totalMinutes, 0);
  const totalChecked = stats.reduce((sum, item) => sum + item.checkedTasks, 0);
  const totalTasks = stats.reduce((sum, item) => sum + item.totalTasks, 0);
  const percent = totalTasks ? Math.round((totalChecked / totalTasks) * 100) : 0;

  document.getElementById("overallPercent").textContent = `${percent}%`;
  document.getElementById("overallBar").style.width = `${percent}%`;
  document.getElementById("hoursComplete").textContent = `${(completedMinutes / 60).toFixed(1)} / ${(totalMinutes / 60).toFixed(0)} h`;
  document.getElementById("daysComplete").textContent = `${stats.filter(item => item.complete).length} / ${PLAN.length}`;
  document.getElementById("applicationsCount").textContent = jobs.length;
}

function renderJobs() {
  const body = document.getElementById("jobTableBody");
  const empty = document.getElementById("emptyJobs");
  body.innerHTML = "";
  empty.hidden = jobs.length > 0;

  jobs.slice().sort((a, b) => b.date.localeCompare(a.date)).forEach(job => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHTML(job.date)}</td>
      <td>${escapeHTML(job.company)}</td>
      <td>${escapeHTML(job.role)}</td>
      <td>${escapeHTML(job.source || "")}</td>
      <td><span class="status-pill">${escapeHTML(job.status)}</span></td>
      <td>${escapeHTML(job.nextStep || "")}</td>
      <td><div class="row-actions"><button class="icon-button edit-job" aria-label="Edit">✎</button><button class="icon-button delete-job" aria-label="Delete">×</button></div></td>`;
    row.querySelector(".edit-job").addEventListener("click", () => openJobDialog(job));
    row.querySelector(".delete-job").addEventListener("click", () => {
      if (confirm(`Delete ${job.company} — ${job.role}?`)) {
        jobs = jobs.filter(item => item.id !== job.id);
        saveJobs();
      }
    });
    body.appendChild(row);
  });
}

function openJobDialog(job = null) {
  document.getElementById("jobDialogTitle").textContent = job ? "Edit application" : "Add application";
  document.getElementById("jobId").value = job?.id || "";
  document.getElementById("jobDate").value = job?.date || toLocalDateString(new Date());
  document.getElementById("jobCompany").value = job?.company || "";
  document.getElementById("jobRole").value = job?.role || "";
  document.getElementById("jobSource").value = job?.source || "";
  document.getElementById("jobStatus").value = job?.status || "Applied";
  document.getElementById("jobNextStep").value = job?.nextStep || "";
  jobDialog.showModal();
}

jobForm.addEventListener("submit", event => {
  event.preventDefault();
  const id = document.getElementById("jobId").value || crypto.randomUUID();
  const item = {
    id,
    date: document.getElementById("jobDate").value,
    company: document.getElementById("jobCompany").value.trim(),
    role: document.getElementById("jobRole").value.trim(),
    source: document.getElementById("jobSource").value.trim(),
    status: document.getElementById("jobStatus").value,
    nextStep: document.getElementById("jobNextStep").value.trim()
  };
  const index = jobs.findIndex(job => job.id === id);
  if (index >= 0) jobs[index] = item;
  else jobs.push(item);
  saveJobs();
  jobDialog.close();
});

document.getElementById("addJobBtn").addEventListener("click", () => openJobDialog());
document.getElementById("closeJobDialog").addEventListener("click", () => jobDialog.close());
document.getElementById("cancelJobBtn").addEventListener("click", () => jobDialog.close());

[weekFilter, statusFilter].forEach(element => element.addEventListener("change", renderSchedule));
searchInput.addEventListener("input", renderSchedule);

document.getElementById("expandAllBtn").addEventListener("click", () => {
  state.openDays = PLAN.map(item => item.id);
  saveState();
  renderSchedule();
});
document.getElementById("collapseAllBtn").addEventListener("click", () => {
  state.openDays = [];
  saveState();
  renderSchedule();
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const payload = { version: 1, exportedAt: new Date().toISOString(), progress: state, jobs };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `ml-sprint-progress-${toLocalDateString(new Date())}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
});

document.getElementById("importInput").addEventListener("change", async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const payload = JSON.parse(await file.text());
    Object.assign(state, payload.progress || {});
    jobs = Array.isArray(payload.jobs) ? payload.jobs : jobs;
    saveState();
    saveJobs();
    renderSchedule();
    alert("Progress imported.");
  } catch {
    alert("Could not import this file. Use a JSON export created by this tracker.");
  } finally {
    event.target.value = "";
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (!confirm("Reset all schedule progress, notes, and job applications?")) return;
  state.checks = {};
  state.notes = {};
  state.openDays = [];
  jobs = [];
  saveState();
  saveJobs();
  renderSchedule();
});

function setupToday() {
  const today = toLocalDateString(new Date());
  const item = PLAN.find(day => day.date === today);
  if (!item) return;
  const panel = document.getElementById("todayPanel");
  panel.hidden = false;
  document.getElementById("todayTitle").textContent = `Day ${item.id}: ${item.title}`;
  document.getElementById("jumpTodayBtn").addEventListener("click", () => {
    state.openDays = [...new Set([...state.openDays, item.id])];
    saveState();
    renderSchedule();
    document.getElementById(`day-${item.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })
    .format(new Date(`${dateString}T12:00:00`));
}

function toLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);
}

renderSchedule();
renderJobs();
updateDashboard();
setupToday();
