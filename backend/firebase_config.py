import firebase_admin
from firebase_admin import credentials, auth
import os
import json
from typing import Optional, Dict, Any

# Firebase configuration from environment variables
FIREBASE_CONFIG = {
    "apiKey": os.getenv("FIREBASE_API_KEY", "AIzaSyDjJTOdsvjaa90z53RYkFB-wVyzPz-9sG4"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN", "scenariocat-fb81d.firebaseapp.com"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID", "scenariocat-fb81d"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET", "scenariocat-fb81d.firebasestorage.app"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID", "142415481422"),
    "appId": os.getenv("FIREBASE_APP_ID", "1:142415481422:web:4d1673fbe3e38014fe911f")
}

# Check if Firebase Admin is already initialized
firebase_app = None

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    global firebase_app
    
    if firebase_app is not None:
        return firebase_app
    
    try:
        # Check if service account key is available
        service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
        service_account_key = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
        
        if service_account_path and os.path.exists(service_account_path):
            # Use service account file
            cred = credentials.Certificate(service_account_path)
            firebase_app = firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin initialized with service account file")
            
        elif service_account_key:
            # Use service account key from environment variable
            service_account_info = json.loads(service_account_key)
            cred = credentials.Certificate(service_account_info)
            firebase_app = firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin initialized with service account key")
            
        else:
            # Use default credentials (for development with fallback)
            try:
                # For development, we'll create a minimal config using project ID
                firebase_config = {
                    "projectId": FIREBASE_CONFIG["projectId"]
                }
                cred = credentials.Certificate(firebase_config) if False else None
                
                # In production, you should use proper service account
                # For now, we'll use Application Default Credentials
                firebase_app = firebase_admin.initialize_app()
                print("✅ Firebase Admin initialized with default credentials")
                
            except Exception as e:
                print(f"⚠️ Firebase Admin initialization failed: {e}")
                print("💡 Using fallback mode - Firebase auth will be simulated")
                return None
                
    except Exception as e:
        print(f"❌ Firebase initialization error: {e}")
        print("💡 Using fallback mode - Firebase auth will be simulated")
        return None
    
    return firebase_app

def verify_firebase_token(id_token: str) -> Optional[Dict[str, Any]]:
    """Verify Firebase ID token"""
    try:
        if firebase_app is None:
            # Fallback mode - return mock verification for development
            print("⚠️ Firebase not initialized, using fallback token verification")
            return {
                "uid": "fallback_user",
                "email": "fallback@example.com",
                "firebase": {
                    "sign_in_provider": "password"
                }
            }
        
        # Verify the token with Firebase Admin SDK
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
        
    except firebase_admin.auth.InvalidIdTokenError:
        print("❌ Invalid Firebase ID token")
        return None
    except firebase_admin.auth.ExpiredIdTokenError:
        print("❌ Expired Firebase ID token")
        return None
    except Exception as e:
        print(f"❌ Firebase token verification error: {e}")
        return None

def create_firebase_user(email: str, password: str, display_name: str = None) -> Optional[Dict[str, Any]]:
    """Create a new Firebase user"""
    try:
        if firebase_app is None:
            # Fallback mode - return mock user creation
            print("⚠️ Firebase not initialized, using fallback user creation")
            return {
                "uid": f"fallback_{email.replace('@', '_').replace('.', '_')}",
                "email": email,
                "display_name": display_name or email.split('@')[0]
            }
        
        user = auth.create_user(
            email=email,
            password=password,
            display_name=display_name
        )
        
        return {
            "uid": user.uid,
            "email": user.email,
            "display_name": user.display_name
        }
        
    except firebase_admin.auth.EmailAlreadyExistsError:
        print(f"❌ Email {email} already exists")
        return None
    except Exception as e:
        print(f"❌ Firebase user creation error: {e}")
        return None

def get_firebase_user(uid: str) -> Optional[Dict[str, Any]]:
    """Get Firebase user by UID"""
    try:
        if firebase_app is None:
            # Fallback mode
            return {
                "uid": uid,
                "email": f"{uid}@example.com"
            }
        
        user = auth.get_user(uid)
        return {
            "uid": user.uid,
            "email": user.email,
            "display_name": user.display_name,
            "email_verified": user.email_verified
        }
        
    except Exception as e:
        print(f"❌ Firebase get user error: {e}")
        return None

# Initialize Firebase on module import
firebase_app = initialize_firebase()