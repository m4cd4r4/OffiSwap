import React, { Fragment } from 'react'; // Import Fragment
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from './context/AuthContext'; // Import useAuth
import './index.css'; // Import Tailwind CSS directives here

// Import Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage'; // Import ListingDetailPage
import CreateListingPage from './pages/CreateListingPage';
import ProtectedRoute from './components/routing/ProtectedRoute';
// TODO: Import other pages as needed (e.g., Dashboard)

// Navbar Component using AuthContext & Tailwind
const Navbar = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  // Basic Tailwind classes for links and buttons
  const linkStyle = "mr-4 text-blue-600 hover:text-blue-800 hover:underline";
  const buttonStyle = "mr-4 bg-transparent border-none text-blue-600 hover:text-blue-800 underline cursor-pointer p-0";

  // Links for authenticated users
  const authLinks = (
    <Fragment>
      <span className="mr-4">Welcome, {user?.name}!</span>
      <Link to="/create-listing" className={linkStyle}>Create Listing</Link>
      {/* Add Dashboard link later */}
      {/* <Link to="/dashboard" className={linkStyle}>Dashboard</Link> */}
      <button onClick={onLogout} className={buttonStyle}>
        Logout
      </button>
    </Fragment>
  );

  // Links for guest users
  const guestLinks = (
    <Fragment>
      <Link to="/login" className={linkStyle}>Login</Link>
      {/* Use static string for Register link */}
      <Link to="/register" className="text-blue-600 hover:text-blue-800 hover:underline">Register</Link>
    </Fragment>
  );

  return (
    <nav className="mb-5 border-b border-gray-200 pb-3 flex items-center">
      {/* Use static string for Home link */}
      <Link to="/" className="mr-4 text-blue-600 hover:text-blue-800 hover:underline font-bold">Home</Link>
      <Link to="/listings" className={linkStyle}>Listings</Link>
      <div className="ml-auto"> {/* Push auth links to the right */}
        {!isLoading && (isAuthenticated ? authLinks : guestLinks)} {/* Show links based on auth state */}
      </div>
    </nav>
  );
};


function App() {
  // Use context here if needed, or rely on Navbar and Pages to use it
  const { isLoading } = useAuth();

  // Optional: Show a global loading indicator while auth state initializes
  if (isLoading) {
      return <div>Loading Application...</div>;
  }

  return (
    <Router>
      {/* Apply container, centering, and padding */}
      <div className="container mx-auto p-4">
        {/* Style the main title */}
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">OffiSwap</h1>
        <Navbar />
        <main> {/* Wrap routes in main for semantic structure */}
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/listings" element={<ListingsPage />} />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/create-listing" element={<CreateListingPage />} />
            {/* Add other protected routes here, e.g., Dashboard */}
            {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
          </Route>
          <Route path="/listings/:id" element={<ListingDetailPage />} /> {/* Add route for listing details */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
