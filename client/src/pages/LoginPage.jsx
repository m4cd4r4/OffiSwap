import React, { useState } from 'react';
// No longer need axios here directly, context handles it
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, error: authError, isLoading } = useAuth(); // Get login function and context state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // Use authError from context instead of local error state for login errors

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Error state is now managed by AuthContext for login attempts
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password); // Call login from context
    if (success) {
      // Redirect on successful login (e.g., to dashboard or listings)
      console.log("Login successful, navigating...");
      navigate('/listings'); // Redirect to listings for now
    }
    // Error handling is done within the login function and exposed via authError
  };

  // Basic Tailwind form styling classes
  const formGroupStyle = "mb-4";
  const labelStyle = "block text-gray-700 text-sm font-bold mb-2";
  const inputStyle = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
  const buttonStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline";

  return (
    <div className="max-w-md mx-auto mt-8"> {/* Center form and add margin */}
      <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
      {authError && <p className="text-red-500 text-xs italic mb-4">{authError}</p>} {/* Style error */}
      <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className={formGroupStyle}>
          <label htmlFor="email" className={labelStyle}>Email:</label>
          <input
            type="email"
            className={inputStyle}
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className={formGroupStyle}>
          <label htmlFor="password" className={labelStyle}>Password:</label>
          <input
            type="password"
            className={inputStyle}
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" disabled={isLoading} className={buttonStyle}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
      <p className="text-center text-gray-500 text-xs">
        Don't have an account? <Link to="/register" className="text-blue-500 hover:text-blue-800">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;
