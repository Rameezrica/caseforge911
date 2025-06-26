# 🧠 CaseForge

**CaseForge** is a comprehensive business education platform that democratizes access to practical, case-based learning. Whether you're a student aiming for top internships, a career switcher building practical skills, or a company looking for high-signal talent — CaseForge puts real-world decision-making at the heart of learning.

## 🎯 Mission

> You shouldn't need to go to an elite B-school to solve real business problems.

CaseForge provides access to practical, case-based learning across domains like:

- 📊 **Finance** - Financial modeling, valuation analysis, investment strategies
- 📈 **Marketing** - Customer acquisition, brand strategy, digital marketing
- 🧠 **Strategy** - Market entry, competitive analysis, strategic planning  
- 🏭 **Operations** - Supply chain optimization, process improvement
- 📦 **Supply Chain** - Logistics, vendor management, inventory optimization
- 💼 **General Management** - Leadership decisions, organizational strategy

## ⚙️ Features

- **📝 Solve Case Problems**: Tackle realistic, data-backed business challenges from top companies
- **🔐 User Authentication**: Secure Firebase-based authentication system
- **👑 Admin Panel**: Comprehensive admin dashboard for content management
- **📊 Progress Tracking**: Monitor your progress across difficulty levels and domains
- **💡 Solution Submission**: Submit and track your case study solutions
- **🎯 Daily Challenges**: Fresh problems every day to maintain your practice streak
- **🌟 Community Features**: Connect with other learners and share insights
- **📈 Analytics Dashboard**: Detailed insights for both users and administrators

## 🔧 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework with automatic API documentation
- **Firebase Admin SDK** - Authentication and user management
- **Supabase** - PostgreSQL database with real-time capabilities
- **Pydantic** - Data validation and settings management
- **uvicorn** - ASGI server for production-ready deployment

### Frontend  
- **React 18** - Component-based UI library with hooks
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **React Router** - Declarative client-side routing
- **Firebase SDK** - Client-side authentication integration

### Authentication & Database
- **Firebase Authentication** - Secure user authentication with email/password
- **Supabase Database** - PostgreSQL database for data persistence
- **Protected Routes** - Role-based access control for users and admins

### Development & Deployment
- **Supervisor** - Process management for production deployment
- **Yarn** - Fast and reliable package management
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Yarn
- Firebase project (for authentication)
- Supabase project (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd caseforge
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies**
   ```bash
   cd ..
   yarn install
   ```

4. **Configuration**
   
   The application uses hardcoded API keys for Firebase and Supabase as specified in the requirements. The configuration is already set up in:
   - Backend: `/backend/server.py` (lines 17-32)
   - Frontend: `/src/lib/firebase.ts` (lines 5-12)

5. **Start the services**
   ```bash
   # Start all services with supervisor (recommended)
   sudo supervisorctl restart all
   
   # Or manually:
   # Backend
   cd backend && uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   
   # Frontend  
   yarn dev --host 0.0.0.0 --port 3000
   ```

6. **Access the application**
   - Frontend: http://localhost:3000 (or the port shown in terminal)
   - Backend API: http://localhost:8001
   - API Documentation: http://localhost:8001/docs
   - Admin Panel: http://localhost:3000/admin/login

### Admin Access
- **Email**: `rameezuddinmohammed61@gmail.com`
- **Password**: `Qwerty9061#`

## 📁 Project Structure

```
caseforge/
├── backend/                 # FastAPI backend
│   ├── server.py           # Main application file with hardcoded config
│   ├── requirements.txt    # Python dependencies
│   ├── firebase_config.py  # Firebase admin configuration
│   ├── create_admin_user.py # Admin user creation script
│   └── init_supabase.py    # Supabase initialization
├── src/                    # React frontend source
│   ├── components/        # Reusable UI components
│   │   ├── auth/         # Authentication components
│   │   ├── admin/        # Admin panel components
│   │   └── layout/       # Layout components
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   └── admin/        # Admin pages
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   ├── context/          # React context providers
│   │   ├── AuthContext.tsx      # User authentication context
│   │   └── AdminAuthContext.tsx # Admin authentication context
│   ├── lib/              # Utility libraries
│   │   └── firebase.ts   # Firebase client configuration
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── package.json         # Frontend dependencies
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md           # Project documentation
```

## 🧪 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check and service status
- `GET /api/firebase/config` - Firebase configuration for frontend
- `GET /api/problems` - Get all problems with optional filtering
- `GET /api/problems/{id}` - Get specific problem by ID
- `GET /api/categories` - Get available categories, domains, and difficulties
- `GET /api/stats` - Platform statistics
- `GET /api/daily-challenge` - Today's daily challenge

### Protected User Endpoints
- `GET /api/auth/me` - Get current user profile
- `GET /api/user/progress` - Get user progress and statistics
- `GET /api/user/solutions` - Get user's submitted solutions
- `POST /api/solutions` - Submit a solution for a problem

### Admin Endpoints (Requires Admin Access)
- `GET /api/admin/dashboard` - Admin dashboard statistics
- `GET /api/admin/users` - Get all users with pagination
- `GET /api/admin/problems` - Get all problems for management
- `POST /api/admin/problems` - Create a new problem
- `PUT /api/admin/problems/{id}` - Update an existing problem
- `DELETE /api/admin/problems/{id}` - Delete a problem
- `GET /api/admin/solutions` - Get all submitted solutions
- `GET /api/admin/solutions/{problem_id}` - Get solutions for specific problem

### Authentication
All protected endpoints require a valid Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

## 🔐 Authentication System

### User Authentication
- **Registration**: New users can register with email and password
- **Login**: Existing users can log in using Firebase authentication
- **Protected Routes**: User dashboard and problem-solving features require authentication
- **Profile Management**: Users can view and manage their profiles

### Admin Authentication
- **Admin Login**: Dedicated admin login at `/admin/login`
- **Admin Email**: `rameezuddinmohammed61@gmail.com`
- **Admin Panel**: Full content management system for problems, users, and solutions
- **Role-based Access**: Admin routes are protected and only accessible to verified admin users

### Security Features
- Firebase ID token verification on backend
- Automatic token refresh handling
- Protected API endpoints with role-based access control
- Secure session management with local storage fallback

## 📊 Current Data

The platform currently includes:
- **3 Problems**: Sample business case studies across different domains
- **11 Users**: Registered user accounts in the system
- **Categories**: Strategy, Marketing, Operations
- **Domains**: Technology, Automotive, Manufacturing
- **Difficulties**: Medium, Hard

## 🎨 Styling

The application uses a modern dark theme with Tailwind CSS featuring:

- **Dark Theme**: Professional dark color scheme optimized for extended use
- **Responsive Design**: Mobile-first responsive layout
- **Component Library**: Custom UI components with consistent styling
- **Color Palette**: 
  - Primary: Dark grays (900-50)
  - Accent: Emerald for primary actions
  - Domain Colors: Blue, Purple, Orange, Cyan for categorization

## 🛠️ Development

### Running in Development Mode
```bash
# Backend with hot reload
cd backend && uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Frontend with hot reload
yarn dev --host 0.0.0.0 --port 3000
```

### Testing
```bash
# Test admin authentication
python test_admin.py

# Test API endpoints
curl http://localhost:8001/api/health
```

### Common Issues & Solutions

1. **Frontend won't start**: Ensure all dependencies are installed with `yarn install`
2. **Backend errors**: Check that all Python packages are installed with `pip install -r requirements.txt`
3. **Authentication issues**: Verify Firebase configuration in both frontend and backend
4. **Port conflicts**: The frontend may start on port 3001, 3002, or 3003 if 3000 is occupied

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **API Documentation**: http://localhost:8001/docs (when running locally)
- **Admin Panel**: http://localhost:3000/admin/login
- **Frontend**: http://localhost:3000

---

Built with ❤️ for the next generation of business leaders.