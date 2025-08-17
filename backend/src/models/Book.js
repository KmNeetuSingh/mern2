const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required']
  },
  publishedYear: {
    type: Number
  },
  pages: {
    type: Number
  },
  genre: {
    type: String,
    trim: true
  },
  isbn: {
    type: String,
    trim: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  availability: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for book URL
bookSchema.virtual('url').get(function() {
  return `/api/books/${this._id}`;
});

// Method to update average rating
bookSchema.methods.updateAverageRating = function(newRating) {
  const totalRatings = this.totalRatings + 1;
  const newAverage = ((this.averageRating * this.totalRatings) + newRating) / totalRatings;
  
  this.averageRating = parseFloat(newAverage.toFixed(1));
  this.totalRatings = totalRatings;
  
  return this.save();
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book; 