import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Fetch listings from the API (GET /api/listings)
    const fetchListings = async () => {
      setError(null); // Clear previous errors
      setLoading(true);
      try {
        // Use relative path '/api/listings' - Vite proxy handles redirection
        const res = await axios.get('/api/listings');
        setListings(res.data); // Set listings from API response
      } catch (err) {
        console.error("Error fetching listings:", err.response?.data || err.message);
        setError(err.message || 'Could not fetch listings.');
        setListings([]); // Clear listings on error
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Available Listings</h2>
      {loading && <p className="text-gray-500">Loading listings...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <div>
          {listings.length === 0 ? (
            <p className="text-gray-600">No listings available right now.</p>
          ) : (
            <ul className="space-y-4"> {/* Add vertical space between items */}
              {listings.map((listing) => (
                <li key={listing.id} className="border border-gray-300 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  {/* Link the title to the detail page */}
                  <h3 className="text-xl font-semibold mb-2">
                    <Link to={`/listings/${listing.id}`} className="text-blue-600 hover:underline">
                      {listing.title} ({listing.quantity})
                    </Link>
                  </h3>
                  <p><strong className="font-medium">Type:</strong> {listing.item_type}</p>
                  <p><strong className="font-medium">Condition:</strong> <span className="capitalize">{listing.condition?.replace('_', ' ')}</span></p> {/* Capitalize condition */}
                  <p><strong className="font-medium">Location:</strong> {listing.location}</p>
                  <p><strong className="font-medium">Seller:</strong> {listing.seller_name}</p>
                  {listing.description && <p className="mt-2 text-gray-700"><strong className="font-medium">Description:</strong> {listing.description}</p>}
                  {/* TODO: Add button to view details or express interest */}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
