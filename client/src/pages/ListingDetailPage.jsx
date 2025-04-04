import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ListingDetailPage = () => {
  const { id } = useParams(); // Get the listing ID from the URL parameter
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      setError(null);
      setLoading(true);
      try {
        // Fetch the specific listing using the ID
        const res = await axios.get(`/api/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error(`Error fetching listing ${id}:`, err.response?.data || err.message);
        setError(err.response?.data?.message || `Could not fetch listing ${id}.`);
        setListing(null);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]); // Re-run effect if the ID changes

  // Helper function to format dates nicely (optional)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div>Loading listing details...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!listing) {
    return <div>Listing not found.</div>; // Should be caught by error state, but good fallback
  }

  return (
    <div>
      <h2>{listing.title}</h2>
      <p><strong>Seller:</strong> {listing.seller_name}</p>
      <p><strong>Item Type:</strong> {listing.item_type}</p>
      <p><strong>Quantity:</strong> {listing.quantity}</p>
      <p><strong>Condition:</strong> {listing.condition?.replace('_', ' ')}</p>
      <p><strong>Location:</strong> {listing.location}</p>
      <p><strong>Description:</strong> {listing.description || 'No description provided.'}</p>
      <p><strong>Status:</strong> {listing.status}</p>
      <p><strong>Available From:</strong> {formatDate(listing.available_from)}</p>
      <p><strong>Available Until:</strong> {formatDate(listing.available_until)}</p>
      <p><strong>Listed On:</strong> {formatDate(listing.created_at)}</p>

      {/* TODO: Add buttons for Claim/Interest, Edit/Delete (conditional based on ownership/auth) */}

      <hr />
      <Link to="/listings">Back to Listings</Link>
    </div>
  );
};

export default ListingDetailPage;
