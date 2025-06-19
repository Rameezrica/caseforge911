import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Firebase configuration from environment variables
let firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

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

console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? '***KEY_EXISTS***' : 'MISSING',
  appId: firebaseConfig.appId ? '***APP_ID_EXISTS***' : 'MISSING'
});

// Function to fetch Firebase config from backend if environment variables are missing
async function fetchFirebaseConfigFromBackend(): Promise<any> {
  try {
    console.log('🔄 Fetching Firebase config from backend...');
    const response = await fetch('/api/firebase/config');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Firebase config fetched from backend:', {
        ...data.config,
        apiKey: data.config.apiKey ? '***KEY_EXISTS***' : 'MISSING',
        appId: data.config.appId ? '***APP_ID_EXISTS***' : 'MISSING'
      });
      return data.config;
    } else {
      console.error('❌ Failed to fetch Firebase config from backend:', response.status);
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching Firebase config from backend:', error);
    return null;
  }
}

// Check if we have the required configuration
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

// Initialize Firebase
let firebaseApp: FirebaseApp;
let auth: Auth;

async function initializeFirebase() {
  try {
    console.log('Initializing Firebase...');
    
    // If environment variables are missing, try to fetch from backend
    if (missingFields.length > 0) {
      console.log('❌ Missing Firebase configuration fields from env:', missingFields);
      console.log('🔄 Attempting to fetch config from backend API...');
      
      const backendConfig = await fetchFirebaseConfigFromBackend();
      if (backendConfig) {
        firebaseConfig = backendConfig;
        console.log('✅ Using Firebase config from backend');
      } else {
        throw new Error(`Missing Firebase configuration: ${missingFields.join(', ')}`);
      }
    }

    // Final validation
    const finalMissingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
    if (finalMissingFields.length > 0) {
      throw new Error(`Missing Firebase configuration: ${finalMissingFields.join(', ')}`);
    }
    
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
}

// Initialize Firebase immediately
await initializeFirebase();

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