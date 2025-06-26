import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Hardcoded Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjJTOdsvjaa90z53RYkFB-wVyzPz-9sG4",
  authDomain: "scenariocat-fb81d.firebaseapp.com",
  projectId: "scenariocat-fb81d",
  storageBucket: "scenariocat-fb81d.firebasestorage.app",
  messagingSenderId: "142415481422",
  appId: "1:142415481422:web:4d1673fbe3e38014fe911f"
};

console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? '***KEY_EXISTS***' : 'MISSING',
  appId: firebaseConfig.appId ? '***APP_ID_EXISTS***' : 'MISSING'
});

// Validate configuration
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