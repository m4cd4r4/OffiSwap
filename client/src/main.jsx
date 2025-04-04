import React from 'react' // Import React
import { createRoot } from 'react-dom/client'
import './index.css' // Import Tailwind CSS directives
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx' // Import AuthProvider

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
