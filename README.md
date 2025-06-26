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
- **FastAPI** - Modern Python web framework
- **MongoDB** - Document database for flexible data storage
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation and settings management
- **uvicorn** - ASGI server

### Frontend  
- **React** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication

### Development & Deployment
- **Supervisor** - Process management
- **Yarn** - Package management
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB
- Yarn

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

4. **Set up environment variables**
   
   Backend (`.env` in `/backend`):
   ```env
   MONGO_URL=mongodb://localhost:27017/
   DATABASE_NAME=caseforge
   FRONTEND_URLS=http://localhost:3000,http://localhost:5173
   JWT_SECRET_KEY=your-secret-key-here
   ```
   
   Frontend (`.env` in root):
   ```env
   VITE_API_BASE_URL=http://localhost:8001/api
   ```

5. **Start the services**
   ```bash
   # Start all services with supervisor
   sudo supervisorctl start all
   
   # Or manually:
   # Backend
   cd backend && uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   
   # Frontend  
   yarn dev --host 0.0.0.0 --port 3000
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001/api
   - API Documentation: http://localhost:8001/docs

## 📁 Project Structure

```
caseforge/
├── backend/                 # FastAPI backend
│   ├── server.py           # Main application file
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Backend environment variables
├── src/                    # React frontend source
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   ├── context/          # React context providers
│   └── constants/        # Application constants
├── public/                # Static assets
├── package.json          # Frontend dependencies
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md            # Project documentation
```

## 🧪 API Endpoints

### Problems
- `GET /api/problems` - Get all problems with optional filtering
- `GET /api/problems/{id}` - Get specific problem by ID
- `GET /api/categories` - Get available categories and domains

### Platform
- `GET /api/health` - Health check
- `GET /api/stats` - Platform statistics
- `GET /api/daily-challenge` - Today's daily challenge

### Solutions
- `POST /api/solutions` - Submit a solution for a problem

## 🎨 Styling

The application uses a custom dark theme with Tailwind CSS. The color palette includes:

- **Dark 900-50**: Primary dark theme colors
- **Emerald**: Primary accent color
- **Blue, Purple, Orange, Cyan**: Domain-specific accent colors

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **Live Demo**: [CaseForge Platform](https://caseforge911.vercel.app)
- **Documentation**: [API Docs](http://localhost:8001/docs)

---

Built with ❤️ for the next generation of business leaders.