import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app, auth, db;
const isConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_firebase_key_here';

try {
  if (isConfigured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app);
  } else {
    console.warn("Firebase is not configured. Falling back to local/mock mode.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Auth Methods
export const signInAnonymousUser = async () => {
  if (!isConfigured) return { uid: 'mock-user-123' };
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Auth Error:", error);
    throw error;
  }
};

export const subscribeToAuthChanges = (callback) => {
  if (!isConfigured) {
    callback({ uid: 'mock-user-123' });
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export const logOut = async () => {
  if (!isConfigured) return;
  return signOut(auth);
};

// DB Methods
export const saveQuizScore = async (userId, score, total) => {
  if (!isConfigured) {
    console.log(`[Mock DB] Saved score ${score}/${total} for user ${userId}`);
    return;
  }
  try {
    const scoreRef = ref(db, `users/${userId}/quiz`);
    await set(scoreRef, {
      lastScore: score,
      total: total,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
};

export const getUserProgress = async (userId) => {
  if (!isConfigured) {
    return { quiz: { lastScore: 8, total: 10 } }; // mock data
  }
  try {
    const progressRef = ref(db, `users/${userId}`);
    const snapshot = await get(progressRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
};
