# Velocity Frontend 🚗

> **React + Vite frontend for Velocity car rental platform**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend running at `http://localhost:8000` (see Backend/README.md)

### Installation

1. **Navigate to Frontend folder**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - The app will automatically open at: **http://localhost:3000**
   - Or manually visit: http://localhost:3000

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── CarCard.jsx
│   │   ├── LoadingSkeleton.jsx
│   │   └── Navbar.jsx
│   ├── context/          # React Context providers
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components
│   │   └── Home.jsx
│   ├── utils/            # Utility functions
│   │   └── api.js        # Axios instance for backend API
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles + Tailwind
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # This file
```

## 🔧 Available Scripts

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌐 Localhost URL

**Development Server:** http://localhost:3000

The Vite dev server is configured to:
- Run on port 3000
- Automatically open browser on start
- Hot reload on file changes

## 🔌 Backend Connection

The frontend is configured to connect to the backend at:
- **Backend URL:** http://localhost:8000
- **API Base:** http://localhost:8000/api

Make sure your backend is running before starting the frontend!

## 📦 Dependencies

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Tailwind CSS** - Styling
- **date-fns** - Date utilities

## 🎨 Features

- ✅ Home page with hero section
- ✅ Search form for cars
- ✅ Featured cars section
- ✅ Responsive design
- ✅ Authentication context
- ✅ API integration with backend
- ✅ Loading states
- ✅ Smooth animations

## 🛠️ Development

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `src/App.jsx`:
   ```jsx
   <Route path="/new-page" element={<NewPage />} />
   ```

### API Calls

Use the `api` utility from `src/utils/api.js`:
```jsx
import api from '../utils/api';

const response = await api.get('/api/cars/featured');
```

### Styling

- Uses Tailwind CSS
- Custom utilities in `src/index.css`
- Color scheme: Red primary (#EF4444)

## 📝 Notes

- Backend must be running on port 8000
- CORS is configured in backend to allow requests from http://localhost:3000
- JWT tokens are stored in localStorage
- Images should be placed in `public/images/` folder

## 🐛 Troubleshooting

**Port 3000 already in use?**
- Change port in `vite.config.js`:
  ```js
  server: {
    port: 3001, // or any other port
  }
  ```

**Backend connection errors?**
- Ensure backend is running: `cd Backend && uvicorn app.main:app --reload`
- Check backend is on http://localhost:8000
- Verify CORS settings in backend

**Dependencies not installing?**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

---

**Built with ❤️ for Velocity Team**

