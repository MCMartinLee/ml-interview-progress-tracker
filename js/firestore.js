import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { errorMessage, showToast } from "./notifications.js";

const LOCAL_PROGRESS_KEY = "mlSprintProgressV1";
const LOCAL_JOBS_KEY = "mlSprintJobsV1";

let currentUid = null;
let unsubscribeAll = [];
let saveTimer = null;
let syncing = false;
let syncingCallback = () => {};

export const cloudState = {
  progress: { checks: {}, notes: {}, openDays: [] },
  applications: [],
  interviews: [],
  settings: { theme: "system" },
  statistics: {}
};

export function setSyncingCallback(callback) {
  syncingCallback = callback;
}

function setSyncing(value) {
  syncing = value;
  syncingCallback(syncing);
}

export function readLocalData() {
  return {
    progress: readJSON(LOCAL_PROGRESS_KEY, null),
    applications: readJSON(LOCAL_JOBS_KEY, null)
  };
}

export function hasLocalData() {
  const local = readLocalData();
  return Boolean(local.progress || (Array.isArray(local.applications) && local.applications.length));
}

export function clearLocalData() {
  localStorage.removeItem(LOCAL_PROGRESS_KEY);
  localStorage.removeItem(LOCAL_JOBS_KEY);
}

export async function importLocalData(uid) {
  const local = readLocalData();
  const batch = writeBatch(db);
  if (local.progress) {
    batch.set(doc(db, "users", uid, "progress", "day-plan"), {
      checks: local.progress.checks || {},
      notes: local.progress.notes || {},
      openDays: local.progress.openDays || [],
      updatedAt: serverTimestamp()
    }, { merge: true });
  }
  (local.applications || []).forEach(application => {
    const id = application.id || crypto.randomUUID();
    batch.set(doc(db, "users", uid, "applications", id), normalizeApplication({ ...application, id }), { merge: true });
  });
  await batch.commit();
  clearLocalData();
}

export async function startUserData(uid, onChange) {
  stopUserData();
  currentUid = uid;
  await ensureUserDocuments(uid);
  await createWeeklyBackup(uid);

  unsubscribeAll = [
    onSnapshot(doc(db, "users", uid, "progress", "day-plan"), snapshot => {
      cloudState.progress = snapshot.exists() ? snapshot.data() : { checks: {}, notes: {}, openDays: [] };
      onChange();
    }, handleSnapshotError),
    onSnapshot(collection(db, "users", uid, "applications"), snapshot => {
      cloudState.applications = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
      onChange();
    }, handleSnapshotError),
    onSnapshot(collection(db, "users", uid, "notes"), snapshot => {
      cloudState.notes = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
      onChange();
    }, handleSnapshotError),
    onSnapshot(collection(db, "users", uid, "interviews"), snapshot => {
      cloudState.interviews = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
      onChange();
    }, handleSnapshotError),
    onSnapshot(doc(db, "users", uid, "settings", "preferences"), snapshot => {
      cloudState.settings = snapshot.exists() ? snapshot.data() : { theme: "system" };
      onChange();
    }, handleSnapshotError)
  ];
}

export function stopUserData() {
  unsubscribeAll.forEach(unsubscribe => unsubscribe());
  unsubscribeAll = [];
  currentUid = null;
}

export function saveProgressDebounced(progress) {
  debounceSave(() => setDoc(doc(db, "users", currentUid, "progress", "day-plan"), {
    checks: progress.checks || {},
    notes: progress.notes || {},
    openDays: progress.openDays || [],
    updatedAt: serverTimestamp()
  }, { merge: true }));
}

export function saveSettings(settings) {
  return setDoc(doc(db, "users", currentUid, "settings", "preferences"), {
    ...settings,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export function upsertApplication(application) {
  const id = application.id || crypto.randomUUID();
  return runWrite(() => setDoc(doc(db, "users", currentUid, "applications", id), normalizeApplication({ ...application, id }), { merge: true }));
}

export function deleteApplication(id) {
  return runWrite(() => deleteDoc(doc(db, "users", currentUid, "applications", id)));
}

export function upsertInterview(interview) {
  const id = interview.id || crypto.randomUUID();
  return runWrite(() => setDoc(doc(db, "users", currentUid, "interviews", id), {
    ...interview,
    id,
    updatedAt: serverTimestamp()
  }, { merge: true }));
}

export function deleteInterview(id) {
  return runWrite(() => deleteDoc(doc(db, "users", currentUid, "interviews", id)));
}

export async function exportAllData(uid) {
  const [progress, applications, interviews, settings] = await Promise.all([
    getDoc(doc(db, "users", uid, "progress", "day-plan")),
    getDocs(collection(db, "users", uid, "applications")),
    getDocs(collection(db, "users", uid, "interviews")),
    getDoc(doc(db, "users", uid, "settings", "preferences"))
  ]);
  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    progress: progress.exists() ? progress.data() : {},
    applications: applications.docs.map(item => ({ id: item.id, ...item.data() })),
    interviews: interviews.docs.map(item => ({ id: item.id, ...item.data() })),
    settings: settings.exists() ? settings.data() : {}
  };
}

export async function importCloudJSON(uid, payload) {
  const batch = writeBatch(db);
  if (payload.progress) {
    batch.set(doc(db, "users", uid, "progress", "day-plan"), { ...payload.progress, updatedAt: serverTimestamp() }, { merge: true });
  }
  (payload.applications || payload.jobs || []).forEach(item => {
    const id = item.id || crypto.randomUUID();
    batch.set(doc(db, "users", uid, "applications", id), normalizeApplication({ ...item, id }), { merge: true });
  });
  (payload.interviews || []).forEach(item => {
    const id = item.id || crypto.randomUUID();
    batch.set(doc(db, "users", uid, "interviews", id), { ...item, id, updatedAt: serverTimestamp() }, { merge: true });
  });
  if (payload.settings) {
    batch.set(doc(db, "users", uid, "settings", "preferences"), { ...payload.settings, updatedAt: serverTimestamp() }, { merge: true });
  }
  await batch.commit();
}

async function ensureUserDocuments(uid) {
  await Promise.all([
    setDoc(doc(db, "users", uid, "profile", "main"), { updatedAt: serverTimestamp() }, { merge: true }),
    setDoc(doc(db, "users", uid, "progress", "day-plan"), { checks: {}, notes: {}, openDays: [], updatedAt: serverTimestamp() }, { merge: true }),
    setDoc(doc(db, "users", uid, "statistics", "summary"), { updatedAt: serverTimestamp() }, { merge: true }),
    setDoc(doc(db, "users", uid, "settings", "preferences"), { theme: "system", updatedAt: serverTimestamp() }, { merge: true })
  ]);
}

async function createWeeklyBackup(uid) {
  const today = new Date();
  if (today.getDay() !== 0) return;
  const key = today.toISOString().slice(0, 10);
  const backupRef = doc(db, "users", uid, "backups", key);
  if ((await getDoc(backupRef)).exists()) return;
  const data = await exportAllData(uid);
  await setDoc(backupRef, { ...data, createdAt: serverTimestamp() });
  const backups = await getDocs(query(collection(db, "users", uid, "backups"), orderBy("createdAt", "desc"), limit(20)));
  await Promise.all(backups.docs.slice(10).map(item => deleteDoc(item.ref)));
}

function debounceSave(operation) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => runWrite(operation), 1000);
}

async function runWrite(operation) {
  if (!currentUid) return;
  setSyncing(true);
  try {
    await operation();
  } catch (error) {
    showToast(errorMessage(error), "error");
  } finally {
    setSyncing(false);
  }
}

function normalizeApplication(application) {
  return {
    company: application.company || "",
    role: application.role || "",
    source: application.source || "",
    status: application.status || "Applied",
    appliedDate: application.appliedDate || application.date || "",
    nextStep: application.nextStep || "",
    salary: application.salary || "",
    location: application.location || "",
    notes: application.notes || "",
    id: application.id,
    updatedAt: serverTimestamp()
  };
}

function handleSnapshotError(error) {
  showToast(errorMessage(error), "error");
}

function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

