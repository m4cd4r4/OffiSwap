const pool = require('../config/db'); // Import the database connection pool

// Create a new listing
const createListing = async (req, res) => {
  // User ID is available from the authMiddleware (req.user.id)
  const sellerId = req.user.id;
  const {
    title,
    description,
    item_type,
    quantity,
    condition,
    location,
    available_from,
    available_until
  } = req.body;

  // Basic validation
  if (!title || !item_type || !location) {
    return res.status(400).json({ message: 'Title, item type, and location are required.' });
  }

  // Validate condition enum if provided
  const validConditions = ['new', 'like_new', 'good', 'fair', 'poor'];
  if (condition && !validConditions.includes(condition)) {
      return res.status(400).json({ message: 'Invalid condition value.' });
  }

  try {
    const newList = await pool.query(
      `INSERT INTO Listings (seller_id, title, description, item_type, quantity, condition, location, available_from, available_until)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`, // Return the newly created listing
      [
        sellerId,
        title,
        description,
        item_type,
        quantity || 1, // Default quantity to 1 if not provided
        condition,
        location,
        available_from, // Can be null
        available_until // Can be null
      ]
    );

    res.status(201).json(newList.rows[0]);

  } catch (error) {
    console.error('Error creating listing:', error);
    // Check for specific errors like foreign key violation if needed
    res.status(500).json({ message: 'Server error while creating listing.' });
  }
};

// Get all available listings (Public)
const getListings = async (req, res) => {
  try {
    // Select listings that are currently available
    // Optionally join with Users table to get seller name, or handle on frontend
    const listings = await pool.query(
      `SELECT l.*, u.name as seller_name
       FROM Listings l
       JOIN Users u ON l.seller_id = u.id
       WHERE l.status = 'available'
       ORDER BY l.created_at DESC` // Show newest first
    );

    res.json(listings.rows);

  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Server error while fetching listings.' });
  }
};

// Get single listing by ID (Public)
const getListingById = async (req, res) => {
  const { id } = req.params; // Get listing ID from URL parameters

  try {
    const listingResult = await pool.query(
      `SELECT l.*, u.name as seller_name
       FROM Listings l
       JOIN Users u ON l.seller_id = u.id
       WHERE l.id = $1`,
      [id]
    );

    if (listingResult.rows.length === 0) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    res.json(listingResult.rows[0]);

  } catch (error) {
    console.error(`Error fetching listing ${id}:`, error);
    // Handle potential error if id is not a valid integer format for the query
    if (error.code === '22P02') { // Invalid input syntax for type integer
        return res.status(400).json({ message: 'Invalid listing ID format.' });
    }
    res.status(500).json({ message: 'Server error while fetching listing.' });
  }
};

// Get listings for the currently authenticated user
const getUserListings = async (req, res) => {
  const userId = req.user.id; // Get user ID from auth middleware

  try {
    const listings = await pool.query(
      `SELECT * FROM Listings WHERE seller_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.json(listings.rows);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ message: 'Server error while fetching user listings.' });
  }
};

// Update a listing owned by the authenticated user
const updateListing = async (req, res) => {
  const { id } = req.params; // Listing ID from URL
  const userId = req.user.id; // User ID from auth middleware
  const {
    title,
    description,
    item_type,
    quantity,
    condition,
    location,
    available_from,
    available_until,
    status // Allow updating status too (e.g., to 'claimed', 'exchanged')
  } = req.body;

  // Validate status enum if provided
  const validStatuses = ['available', 'claimed', 'exchanged'];
   if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
  }
  // Validate condition enum if provided
  const validConditions = ['new', 'like_new', 'good', 'fair', 'poor'];
  if (condition && !validConditions.includes(condition)) {
      return res.status(400).json({ message: 'Invalid condition value.' });
  }

  try {
    // First, verify the listing exists and belongs to the user
    const listingCheck = await pool.query(
      'SELECT seller_id FROM Listings WHERE id = $1',
      [id]
    );

    if (listingCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    if (listingCheck.rows[0].seller_id !== userId) {
      return res.status(403).json({ message: 'User not authorized to update this listing.' });
    }

    // Build the update query dynamically based on provided fields
    // Note: This is a simplified example. A more robust solution might use a query builder
    // or explicitly handle each field to avoid updating with undefined values.
    // We also update the 'updated_at' timestamp automatically via the trigger.
    const updatedListing = await pool.query(
      `UPDATE Listings
       SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         item_type = COALESCE($3, item_type),
         quantity = COALESCE($4, quantity),
         condition = COALESCE($5, condition),
         location = COALESCE($6, location),
         available_from = COALESCE($7, available_from),
         available_until = COALESCE($8, available_until),
         status = COALESCE($9, status)
       WHERE id = $10 AND seller_id = $11
       RETURNING *`,
      [
        title,
        description,
        item_type,
        quantity ? parseInt(quantity, 10) : undefined, // Ensure quantity is integer or undefined
        condition,
        location,
        available_from || null,
        available_until || null,
        status,
        id,
        userId
      ]
    );

     if (updatedListing.rows.length === 0) {
       // Should not happen if the initial check passed, but good practice
       return res.status(404).json({ message: 'Listing not found or update failed.' });
     }

    res.json(updatedListing.rows[0]);

  } catch (error) {
    console.error(`Error updating listing ${id}:`, error);
     if (error.code === '22P02') { // Invalid input syntax for type integer (e.g., for quantity)
        return res.status(400).json({ message: 'Invalid data format for update.' });
    }
    res.status(500).json({ message: 'Server error while updating listing.' });
  }
};

// Delete a listing owned by the authenticated user
const deleteListing = async (req, res) => {
  const { id } = req.params; // Listing ID from URL
  const userId = req.user.id; // User ID from auth middleware

  try {
    // Verify the listing exists and belongs to the user before deleting
    const listingCheck = await pool.query(
      'SELECT seller_id FROM Listings WHERE id = $1',
      [id]
    );

    if (listingCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    if (listingCheck.rows[0].seller_id !== userId) {
      return res.status(403).json({ message: 'User not authorized to delete this listing.' });
    }

    // Perform the deletion
    const deleteResult = await pool.query(
      'DELETE FROM Listings WHERE id = $1 AND seller_id = $2 RETURNING id',
      [id, userId]
    );

     if (deleteResult.rowCount === 0) {
        // Should not happen if checks above passed, but good practice
       return res.status(404).json({ message: 'Listing not found or delete failed.' });
     }

    res.json({ message: `Listing ${id} deleted successfully.` });

  } catch (error) {
    console.error(`Error deleting listing ${id}:`, error);
     if (error.code === '22P02') { // Invalid input syntax for type integer
        return res.status(400).json({ message: 'Invalid listing ID format.' });
    }
    res.status(500).json({ message: 'Server error while deleting listing.' });
  }
};


module.exports = {
  createListing,
  getListings,
  getListingById,
  getUserListings,
  updateListing,
  deleteListing
};
