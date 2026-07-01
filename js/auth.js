import {
  GoogleAuthProvider,
  GithubAuthProvider,
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { auth, isFirebaseConfigured } from "./firebase.js";
import { showToast, errorMessage } from "./notifications.js";

const googleProvider = new GoogleAuthProvider();

export function watchAuth(callback) {
  if (!isFirebaseConfigured()) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function loginWithGoogle() {
  if (!isFirebaseConfigured()) {
    showToast("Fill firebase-config.js before signing in.", "error");
    return;
  }
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    showToast(errorMessage(error), "error");
  }
}

export async function logout() {
  if (!auth) return;
  await signOut(auth);
}

// GitHub login example:
// export async function loginWithGitHub() {
//   await signInWithPopup(auth, new GithubAuthProvider());
// }

// Email/password login examples:
// export async function createEmailAccount(email, password) {
//   return createUserWithEmailAndPassword(auth, email, password);
// }
// export async function loginWithEmail(email, password) {
//   return signInWithEmailAndPassword(auth, email, password);
// }

