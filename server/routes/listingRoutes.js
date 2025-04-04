const express = require('express');
const {
  createListing,
  getListings,
  getListingById,
  getUserListings,
  updateListing,
  deleteListing
} = require('../controllers/listingController'); // Import all controller functions
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

const router = express.Router();

// Define routes

// @route   POST api/listings
// @desc    Create a new listing
// @access  Private (requires authentication)
router.post('/', authMiddleware, createListing);

// @route   GET api/listings
// @desc    Get all available listings
// @access  Public
router.get('/', getListings);

// @route   GET api/listings/my
// @desc    Get listings for the logged-in user
// @access  Private
router.get('/my', authMiddleware, getUserListings);

// @route   GET api/listings/:id
// @desc    Get a single listing by ID
// @access  Public
router.get('/:id', getListingById);

// @route   PUT api/listings/:id
// @desc    Update a listing
// @access  Private
router.put('/:id', authMiddleware, updateListing);

// @route   DELETE api/listings/:id
// @desc    Delete a listing
// @access  Private
router.delete('/:id', authMiddleware, deleteListing);


module.exports = router; // Export the router
