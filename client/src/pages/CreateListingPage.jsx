import React, { useState, useEffect } from 'react'; // Add useEffect
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const CreateListingPage = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth(); // Get auth state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    item_type: '',
    quantity: 1,
    condition: 'good', // Default condition
    location: '',
    available_from: '',
    available_until: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    title,
    description,
    item_type,
    quantity,
    condition,
    location,
    available_from,
    available_until
  } = formData;

  // Defined conditions based on the backend enum
  const conditionOptions = ['new', 'like_new', 'good', 'fair', 'poor'];

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error on change
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Check authentication status from context
    if (!isAuthenticated) {
      setError('You must be logged in to create a listing.');
      setLoading(false);
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    // Prepare data, ensure quantity is a number, handle optional dates
    const listingData = {
      ...formData,
      quantity: parseInt(quantity, 10) || 1,
      available_from: available_from || null, // Send null if empty
      available_until: available_until || null, // Send null if empty
    };

    try {
      // Use default axios instance which has the token header set by AuthContext
      const res = await axios.post('/api/listings', listingData);
      console.log('Listing created:', res.data);
      // Redirect to listings page after successful creation
      navigate('/listings');
    } catch (err) {
      console.error('Create listing failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Basic Tailwind form styling classes
  const formGroupStyle = "mb-4";
  const labelStyle = "block text-gray-700 text-sm font-bold mb-2";
  const inputStyle = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
  const selectStyle = `${inputStyle} bg-white`; // Add bg-white for select
  const buttonStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"; // Add disabled style

  return (
    <div className="max-w-lg mx-auto mt-8"> {/* Wider form */}
      <h2 className="text-2xl font-semibold mb-4 text-center">Create New Listing</h2>
      {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
      {/* Prevent rendering form until auth state is loaded */}
      {authLoading ? <p className="text-center text-gray-500">Loading...</p> : (
        <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className={formGroupStyle}>
            <label htmlFor="title" className={labelStyle}>Title:</label>
            <input type="text" id="title" name="title" value={title} onChange={onChange} required className={inputStyle} />
          </div>
          <div className={formGroupStyle}>
            <label htmlFor="item_type" className={labelStyle}>Item Type (e.g., Desk, Chair):</label>
            <input type="text" id="item_type" name="item_type" value={item_type} onChange={onChange} required className={inputStyle} />
          </div>
          <div className={formGroupStyle}>
            <label htmlFor="description" className={labelStyle}>Description:</label>
            <textarea id="description" name="description" value={description} onChange={onChange} className={inputStyle} rows="3"></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4"> {/* Grid for quantity and condition */}
            <div className={formGroupStyle}>
              <label htmlFor="quantity" className={labelStyle}>Quantity:</label>
              <input type="number" id="quantity" name="quantity" value={quantity} onChange={onChange} min="1" required className={inputStyle} />
            </div>
            <div className={formGroupStyle}>
              <label htmlFor="condition" className={labelStyle}>Condition:</label>
              <select id="condition" name="condition" value={condition} onChange={onChange} className={selectStyle}>
                {conditionOptions.map(opt => (
                  <option key={opt} value={opt} className="capitalize">{opt.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={formGroupStyle}>
            <label htmlFor="location" className={labelStyle}>Location:</label>
            <input type="text" id="location" name="location" value={location} onChange={onChange} required className={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-4"> {/* Grid for dates */}
            <div className={formGroupStyle}>
              <label htmlFor="available_from" className={labelStyle}>Available From (Optional):</label>
              <input type="date" id="available_from" name="available_from" value={available_from} onChange={onChange} className={inputStyle} />
            </div>
            <div className={formGroupStyle}>
              <label htmlFor="available_until" className={labelStyle}>Available Until (Optional):</label>
              <input type="date" id="available_until" name="available_until" value={available_until} onChange={onChange} className={inputStyle} />
            </div>
          </div>

          <div className="flex items-center justify-center mt-6"> {/* Center button */}
            <button type="submit" disabled={loading || authLoading} className={buttonStyle}>
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateListingPage;
