import React from 'react' // Import React
import { createRoot } from 'react-dom/client'
// CSS import removed, will be imported in App.jsx
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx' // Import AuthProvider

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
