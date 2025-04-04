import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import { useNavigate, Link } from 'react-router-dom'; // Import for redirection and Link

const RegisterPage = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '', // For confirmation
    location: '',
  });
  const [error, setError] = useState(null); // State for error messages

  const { name, email, password, password2, location } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error on input change
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }

    const newUser = {
      name,
      email,
      password,
      location,
    };

    try {
      // Use relative path '/api/auth/register' - Vite proxy handles redirection
      const res = await axios.post('/api/auth/register', newUser);
      console.log('Registration successful:', res.data);
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
      // Set error message from backend response if available, otherwise generic error
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  // Basic Tailwind form styling classes
  const formGroupStyle = "mb-4";
  const labelStyle = "block text-gray-700 text-sm font-bold mb-2";
  const inputStyle = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
  const buttonStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline";

  return (
    <div className="max-w-md mx-auto mt-8"> {/* Center form and add margin */}
      <h2 className="text-2xl font-semibold mb-4 text-center">Register Company</h2>
      {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>} {/* Style error */}
      <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className={formGroupStyle}>
          <label htmlFor="name" className={labelStyle}>Company Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            className={inputStyle}
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className={formGroupStyle}>
          <label htmlFor="email" className={labelStyle}>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className={inputStyle}
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className={formGroupStyle}>
          <label htmlFor="password" className={labelStyle}>Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            className={inputStyle}
            value={password}
            onChange={onChange}
            required
            minLength="6" // Basic validation
          />
        </div>
        <div className={formGroupStyle}>
          <label htmlFor="password2" className={labelStyle}>Confirm Password:</label>
          <input
            type="password"
            id="password2"
            name="password2"
            className={inputStyle}
            value={password2}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
         <div className={formGroupStyle}>
          <label htmlFor="location" className={labelStyle}>Location (e.g., City, Address):</label>
          <input
            type="text"
            id="location"
            name="location"
            className={inputStyle}
            value={location}
            onChange={onChange}
          />
        </div>
        <div className="flex items-center justify-between">
            <button type="submit" className={buttonStyle}>Register</button>
        </div>
      </form>
      <p className="text-center text-gray-500 text-xs">
        Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-800">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
