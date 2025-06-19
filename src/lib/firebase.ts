import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Debug logging for environment variables
console.log('Firebase Config Debug:');
console.log('Environment vars:', {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? '***KEY_EXISTS***' : 'MISSING',
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID ? '***APP_ID_EXISTS***' : 'MISSING'
});

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? '***KEY_EXISTS***' : 'MISSING',
  appId: firebaseConfig.appId ? '***APP_ID_EXISTS***' : 'MISSING'
});

// Validate required configuration
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

if (missingFields.length > 0) {
  console.error('❌ Missing Firebase configuration fields:', missingFields);
  throw new Error(`Missing Firebase configuration: ${missingFields.join(', ')}`);
}

// Initialize Firebase
let firebaseApp: FirebaseApp;
let auth: Auth;

try {
  console.log('Initializing Firebase...');
  
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
  } else {
    firebaseApp = getApps()[0];
    console.log('✅ Firebase already initialized, using existing app');
  }

  auth = getAuth(firebaseApp);
  console.log('✅ Firebase Auth initialized successfully');
  
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}

// Global check for Firebase availability
if (typeof window !== 'undefined') {
  (window as any).firebaseApp = firebaseApp;
  (window as any).firebaseAuth = auth;
  
  if (firebaseApp) {
    console.log('✅ Firebase is available globally');
  } else {
    console.error('❌ Firebase is NOT defined');
  }
}

export { firebaseApp, auth };
export default firebaseApp;