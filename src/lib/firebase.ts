import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA221PgciN3w-oG_zh3-mUStnqTAT9-RTA",
  authDomain: "caseforge911-ace0e.firebaseapp.com",
  projectId: "caseforge911-ace0e",
  storageBucket: "caseforge911-ace0e.firebasestorage.app",
  messagingSenderId: "802491517741",
  appId: "1:802491517741:web:78313cebbffeed805721a4"
};

// Initialize Firebase
let firebaseApp: FirebaseApp;
let auth: Auth;

if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

auth = getAuth(firebaseApp);

export { firebaseApp, auth };
export default firebaseApp;