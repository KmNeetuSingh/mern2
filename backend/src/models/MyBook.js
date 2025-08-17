const mongoose = require('mongoose');

const myBookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  status: {
    type: String,
    enum: ['Want to Read', 'Currently Reading', 'Read'],
    default: 'Want to Read'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  review: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date
  },
  finishDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can only add a book once
myBookSchema.index({ user: 1, bookId: 1 }, { unique: true });

// Method to update reading status
myBookSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  if (newStatus === 'Currently Reading' && !this.startDate) {
    this.startDate = new Date();
  } else if (newStatus === 'Read' && !this.finishDate) {
    this.finishDate = new Date();
  }
  
  return this.save();
};

// Method to update rating
myBookSchema.methods.updateRating = async function(newRating) {
  this.rating = newRating;
  await this.save();
  
  // Update the book's average rating
  const Book = mongoose.model('Book');
  const book = await Book.findById(this.bookId);
  if (book) {
    await book.updateAverageRating(newRating);
  }
  
  return this;
};

const MyBook = mongoose.model('MyBook', myBookSchema);

module.exports = MyBook; 