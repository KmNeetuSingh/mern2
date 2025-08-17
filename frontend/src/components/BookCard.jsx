import { useDispatch, useSelector } from 'react-redux';
import { addToMyBooks } from '../store/slices/booksSlice';
import { FaStar, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleAddToMyBooks = () => {
    if (user) {
      dispatch(addToMyBooks(book._id));
    } else {
      alert('Please log in to add books to your collection.');
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] w-full">
        <motion.img
          src={book.coverImage}
          alt={book.title}
          loading="lazy"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out rounded-t-xl"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Rating Badge */}
        {book.averageRating > 0 && (
          <div className="absolute top-2 left-2 bg-white/90 dark:bg-gray-700 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-blue-600 dark:text-blue-400">
            ★ {book.averageRating.toFixed(1)}
          </div>
        )}

        {/* Add Button */}
        <motion.button
          onClick={handleAddToMyBooks}
          whileTap={{ scale: 0.9 }}
          className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-opacity opacity-0 group-hover:opacity-100"
          aria-label="Add to my books"
        >
          <FaPlus />
        </motion.button>
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5 md:p-6 space-y-3">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-1 text-sm sm:text-base">
            {book.author}
          </p>
        </div>

        {book.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
            {book.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {book.genre && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
              {book.genre}
            </span>
          )}
          {book.publishedYear && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
              {book.publishedYear}
            </span>
          )}
        </div>

        {book.averageRating > 0 && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <span className="mr-1">Average Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`w-4 h-4 ${book.averageRating >= star ? 'text-blue-500 dark:text-blue-400' : 'text-gray-300 dark:text-gray-600'}`}
              />
            ))}
            <span className="ml-2">{book.averageRating.toFixed(1)}/5</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BookCard;
