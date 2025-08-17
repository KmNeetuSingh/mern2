import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateMyBook, removeFromMyBooks } from '../store/slices/booksSlice';
import { FaStar, FaTrash } from 'react-icons/fa';

const MyBookCard = ({ book }) => {
  const dispatch = useDispatch();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleStatusChange = (newStatus) => {
    if (!book || !book._id) return;
    dispatch(updateMyBook({ bookId: book._id, status: newStatus }));
    setShowStatusMenu(false);
  };

  const handleRatingChange = (newRating) => {
    if (!book || !book._id) return;
    dispatch(updateMyBook({ bookId: book._id, rating: newRating }));
  };

  const handleRemove = () => {
    if (!book || !book._id) return;
    if (window.confirm('Are you sure you want to remove this book from your collection?')) {
      dispatch(removeFromMyBooks(book._id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Want to Read':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'Currently Reading':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'Read':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row w-full sm:max-w-[700px] mx-auto border border-gray-200 rounded-xl shadow-md mb-4 dark:border-gray-700 dark:bg-gray-800 overflow-hidden transition-transform hover:scale-105">
      
      <div className="relative w-full sm:w-1/3 aspect-[3/4] sm:aspect-auto sm:h-auto">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'placeholder.jpg';
          }}
        />
        {book.averageRating > 0 && (
          <div className="absolute top-2 left-2 bg-white/90 dark:bg-gray-700 px-2 py-1 rounded-full text-sm font-medium text-blue-600 dark:text-blue-400">
            ★ {book.averageRating.toFixed(1)}
          </div>
        )}
        <div className="absolute top-2 right-2">
          <button
            onClick={handleRemove}
            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-colors"
            aria-label="Remove from collection"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between w-full sm:w-2/3 dark:text-gray-300">
        <div>
          <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white truncate">
            {book.title}
          </h5>
          <p className="mb-3 font-medium text-gray-700 dark:text-gray-400">{book.author}</p>
        </div>

        <div className="space-y-3 mt-2">
          <div className="relative">
            <div
              className="flex items-center justify-between"
              onMouseEnter={() => setShowStatusMenu(true)}
              onMouseLeave={() => setShowStatusMenu(false)}
              onClick={() => setShowStatusMenu(!showStatusMenu)}
            >
              <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(book.status)}`}>
                {book.status}
              </span>
              <button
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                aria-label="Change status"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
              </button>
            </div>

            {showStatusMenu && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-1 z-20 border border-gray-200 dark:border-gray-600"
                onMouseEnter={() => setShowStatusMenu(true)}
                onMouseLeave={() => setShowStatusMenu(false)}
              >
                {['Want to Read', 'Currently Reading', 'Read'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {book.review && (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">"{book.review}"</p>
          )}

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <span className="mr-1">Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer transition-colors duration-200 ${
                  book.rating >= star || hoveredRating >= star
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
                onClick={() => handleRatingChange(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              />
            ))}
            {book.rating > 0 && <span className="ml-2">{book.rating}/5</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookCard;
