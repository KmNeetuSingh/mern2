const express = require('express');
const router = express.Router();
const MyBook = require('../models/MyBook');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

// @route   GET /api/mybooks
// @desc    Get user's books with filtering
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is authenticated and ID is available
    if (!req.user || !req.user._id) {
      console.error('GET /api/mybooks: User not authenticated or user ID missing.');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const status = req.query.status;
    const query = { user: req.user._id };
    if (status) query.status = status;

    // Populate book details and explicitly select necessary fields
    const myBooks = await MyBook.find(query)
      .populate('bookId', 'title author coverImage averageRating')
      .select('bookId status rating review notes user') // Select fields from MyBook document, including user
      .sort({ updatedAt: -1 });

    console.log('GET /api/mybooks: Fetched myBooks documents:', myBooks.map(book => ({ _id: book._id, user: book.user, bookId: book.bookId })));

    // Map to flatten the structure and ensure all fields are present
    const formattedMyBooks = myBooks.map(item => ({
      _id: item._id,
      status: item.status,
      rating: item.rating,
      review: item.review,
      notes: item.notes,
      ...item.bookId._doc // Spread book details from the populated bookId
    }));

    res.json(formattedMyBooks);
  } catch (error) {
    console.error('Get my books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/mybooks
// @desc    Add a book to user's collection
// @access  Private
router.post('/', auth, async (req, res) => {
   // Check if user is authenticated and ID is available
   if (!req.user || !req.user._id) {
    console.error('POST /api/mybooks: User not authenticated or user ID missing.');
    return res.status(401).json({ message: 'User not authenticated' });
  }
  try {
    const { bookId, status, rating, review, notes } = req.body;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if book is already in user's collection
    const existingMyBook = await MyBook.findOne({
      user: req.user._id,
      bookId
    });

    if (existingMyBook) {
      return res.status(400).json({ message: 'Book already in collection' });
    }

    const myBook = new MyBook({
      user: req.user._id,
      bookId,
      status,
      rating,
      review,
      notes
    });

    await myBook.save();

    // If rating is provided, update book's average rating
    if (rating) {
      // Assuming updateRating method exists on MyBook model and handles Book model update
      await myBook.updateRating(rating);
    }

    // Respond with the newly created MyBook document, populating book details
    const createdMyBook = await MyBook.findById(myBook._id)
      .populate('bookId', 'title author coverImage averageRating');

    // Format the response to include flattened book details
    const formattedCreatedMyBook = {
      _id: createdMyBook._id,
      status: createdMyBook.status,
      rating: createdMyBook.rating,
      review: createdMyBook.review,
      notes: createdMyBook.notes,
      ...createdMyBook.bookId._doc
    };

    res.status(201).json(formattedCreatedMyBook);
  } catch (error) {
    console.error('Add my book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/mybooks/:id
// @desc    Update user's book
// @access  Private
router.put('/:id', auth, async (req, res) => {
  // Check if user is authenticated and ID is available
  if (!req.user || !req.user._id) {
    console.error('PUT /api/mybooks/:id: User not authenticated or user ID missing.');
    return res.status(401).json({ message: 'User not authenticated' });
  }
  try {
    const { status, rating, review, notes } = req.body;
    const myBookId = req.params.id;
    const userId = req.user._id;

    console.log(`PUT /api/mybooks/${myBookId}: Received update request for myBookId: ${myBookId}, by user: ${userId}`);

    // Prepare update object
    const updateFields = {};
    if (status !== undefined) {
      updateFields.status = status;
      // Note: Dates related to status might be better handled in a model pre-save hook
    }
    if (rating !== undefined) updateFields.rating = rating;
    if (review !== undefined) updateFields.review = review;
    if (notes !== undefined) updateFields.notes = notes;

    console.log(`PUT /api/mybooks/${myBookId}: Attempting to find and update MyBook with query { _id: ${myBookId}, user: ${userId} } and fields:`, updateFields);

    // Find and update the document in one operation
    const myBook = await MyBook.findOneAndUpdate(
      { _id: myBookId, user: userId },
      { $set: updateFields },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    console.log(`PUT /api/mybooks/${myBookId}: findOneAndUpdate result:`, myBook ? 'Document found and updated' : 'Document not found');

    if (!myBook) {
      console.error(`PUT /api/mybooks/${myBookId}: MyBook document not found for ID ${myBookId} and user ${userId}.`);
      return res.status(404).json({ message: 'Book not found in collection' });
    }

    console.log(`PUT /api/mybooks/${myBookId}: MyBook found and updated.`);

     // If rating changed, update book's average rating
     // This logic might need refinement based on how average rating is calculated across all user books
     if (rating !== undefined && myBook.rating !== undefined) { 
        console.log(`PUT /api/mybooks/${myBookId}: Rating updated to ${myBook.rating}. Attempting to update average rating on Book model...`);
        const book = await Book.findById(myBook.bookId);
        if (book) {
          // Recalculate average rating based on all ratings for this book across all users
          const allRatingsForBook = await MyBook.find({ bookId: myBook.bookId, rating: { $ne: null } }).select('rating');
          const totalRatings = allRatingsForBook.length;
          const ratingSum = allRatingsForBook.reduce((sum, current) => sum + current.rating, 0);
          const newAverage = totalRatings > 0 ? ratingSum / totalRatings : 0;

          book.averageRating = parseFloat(newAverage.toFixed(1));
          // Note: Book model might need a totalRatings field if tracking separately
          await book.save();
          console.log(`PUT /api/mybooks/${myBookId}: Average rating on Book ${book._id} updated to ${book.averageRating}.`);
        } else {
          console.warn(`PUT /api/mybooks/${myBookId}: Could not find parent Book document ${myBook.bookId} to update average rating.`);
        }
     }

    // Respond with the updated MyBook document, populating book details
    // Since findOneAndUpdate with {new: true} returns the updated doc, we can use it directly
    // We still need to populate the book details before sending
    const updatedMyBook = await MyBook.findById(myBook._id)
      .populate('bookId', 'title author coverImage averageRating');

     // Format the response to include flattened book details
     const formattedUpdatedMyBook = {
      _id: updatedMyBook._id,
      status: updatedMyBook.status,
      rating: updatedMyBook.rating, // Use updatedMyBook.rating
      review: updatedMyBook.review,
      notes: updatedMyBook.notes,
      ...updatedMyBook.bookId._doc
    };

    console.log(`PUT /api/mybooks/${myBookId}: Responding with updated book data.`);
    res.json(formattedUpdatedMyBook);
  } catch (error) {
    console.error(`PUT /api/mybooks/:id Error:`, error);
    // Check for specific Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    // Handle other potential errors (e.g., database errors)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PATCH /api/mybooks/:id
// @desc    Update user's book (partial update)
// @access  Private
router.patch('/:id', auth, async (req, res) => {
  // Check if user is authenticated and ID is available
  if (!req.user || !req.user._id) {
    console.error('PATCH /api/mybooks/:id: User not authenticated or user ID missing.');
    return res.status(401).json({ message: 'User not authenticated' });
  }
  try {
    const { status, rating, review, notes } = req.body;
    const myBookId = req.params.id;
    const userId = req.user._id;

    console.log(`PATCH /api/mybooks/${myBookId}: Received update request for myBookId: ${myBookId}, by user: ${userId}`);

    // Prepare update object
    const updateFields = {};
    if (status !== undefined) {
      updateFields.status = status;
    }
    if (rating !== undefined) updateFields.rating = rating;
    if (review !== undefined) updateFields.review = review;
    if (notes !== undefined) updateFields.notes = notes;

    console.log(`PATCH /api/mybooks/${myBookId}: Attempting to find and update MyBook with query { _id: ${myBookId}, user: ${userId} } and fields:`, updateFields);

    // Find and update the document in one operation
    const myBook = await MyBook.findOneAndUpdate(
      { _id: myBookId, user: userId },
      { $set: updateFields },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    console.log(`PATCH /api/mybooks/${myBookId}: findOneAndUpdate result:`, myBook ? 'Document found and updated' : 'Document not found');

    if (!myBook) {
      console.error(`PATCH /api/mybooks/${myBookId}: MyBook document not found for ID ${myBookId} and user ${userId}.`);
      return res.status(404).json({ message: 'Book not found in collection' });
    }

    console.log(`PATCH /api/mybooks/${myBookId}: MyBook found and updated.`);

     // If rating changed, update book's average rating
     if (rating !== undefined && myBook.rating !== undefined) { 
        console.log(`PATCH /api/mybooks/${myBookId}: Rating updated to ${myBook.rating}. Attempting to update average rating on Book model...`);
        const book = await Book.findById(myBook.bookId);
        if (book) {
          // Recalculate average rating based on all ratings for this book across all users
          const allRatingsForBook = await MyBook.find({ bookId: myBook.bookId, rating: { $ne: null } }).select('rating');
          const totalRatings = allRatingsForBook.length;
          const ratingSum = allRatingsForBook.reduce((sum, current) => sum + current.rating, 0);
          const newAverage = totalRatings > 0 ? ratingSum / totalRatings : 0;

          book.averageRating = parseFloat(newAverage.toFixed(1));
          await book.save();
          console.log(`PATCH /api/mybooks/${myBookId}: Average rating on Book ${book._id} updated to ${book.averageRating}.`);
        } else {
          console.warn(`PATCH /api/mybooks/${myBookId}: Could not find parent Book document ${myBook.bookId} to update average rating.`);
        }
     }

    // Respond with the updated MyBook document, populating book details
    const updatedMyBook = await MyBook.findById(myBook._id)
      .populate('bookId', 'title author coverImage averageRating');

     // Format the response to include flattened book details
     const formattedUpdatedMyBook = {
      _id: updatedMyBook._id,
      status: updatedMyBook.status,
      rating: updatedMyBook.rating,
      review: updatedMyBook.review,
      notes: updatedMyBook.notes,
      ...updatedMyBook.bookId._doc
    };

    console.log(`PATCH /api/mybooks/${myBookId}: Responding with updated book data.`);
    res.json(formattedUpdatedMyBook);
  } catch (error) {
    console.error(`PATCH /api/mybooks/:id Error:`, error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/mybooks/:id
// @desc    Remove book from user's collection
// @access  Private
router.delete('/:id', auth, async (req, res) => {
   // Check if user is authenticated and ID is available
   if (!req.user || !req.user._id) {
    console.error('DELETE /api/mybooks/:id: User not authenticated or user ID missing.');
    return res.status(401).json({ message: 'User not authenticated' });
  }
  try {
    const myBookId = req.params.id;
    const userId = req.user._id;

    console.log(`DELETE /api/mybooks/${myBookId}: Received delete request for myBookId: ${myBookId}, by user: ${userId}`);

     console.log(`DELETE /api/mybooks/${myBookId}: Attempting to find and delete MyBook with query { _id: ${myBookId}, user: ${userId} }`);
    // Find and delete the document in one operation
    const myBook = await MyBook.findOneAndDelete({
      _id: myBookId,
      user: userId
    });

    console.log(`DELETE /api/mybooks/${myBookId}: findOneAndDelete result:`, myBook ? 'Document found and deleted' : 'Document not found');

    if (!myBook) {
      console.error(`DELETE /api/mybooks/${myBookId}: MyBook document not found for ID ${myBookId} and user ${userId}.`);
      return res.status(404).json({ message: 'Book not found in collection' });
    }

    console.log(`DELETE /api/mybooks/${myBookId}: MyBook found and deleted.`);

    // You might want to update the average rating on the Book model after deletion
    // This would require recalculating the average rating based on remaining user ratings
     if (myBook.rating !== undefined && myBook.rating !== null) { 
        console.log(`DELETE /api/mybooks/${myBookId}: Deleted a book with rating ${myBook.rating}. Attempting to recalculate average rating on Book model...`);
        const book = await Book.findById(myBook.bookId);
        if (book) {
          // Recalculate average rating based on all *remaining* ratings for this book across all users
          const allRatingsForBook = await MyBook.find({ bookId: myBook.bookId, rating: { $ne: null } }).select('rating');
          const totalRatings = allRatingsForBook.length;
          const ratingSum = allRatingsForBook.reduce((sum, current) => sum + current.rating, 0);
          const newAverage = totalRatings > 0 ? ratingSum / totalRatings : 0;

          book.averageRating = parseFloat(newAverage.toFixed(1));
          await book.save();
           console.log(`DELETE /api/mybooks/${myBookId}: Average rating on Book ${book._id} recalculated to ${book.averageRating}.`);
        } else {
          console.warn(`DELETE /api/mybooks/${myBookId}: Could not find parent Book document ${myBook.bookId} to recalculate average rating.`);
        }
     }

    res.json({ message: 'Book removed from collection' });
  } catch (error) {
    console.error(`DELETE /api/mybooks/:id Error:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 