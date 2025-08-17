import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyBooks, updateMyBook, removeFromMyBooks, fetchBooks } from '../store/slices/booksSlice';
import MyBookCard from '../components/MyBookCard';
import BookCard from '../components/BookCard';
import { FaBookOpen } from 'react-icons/fa';

const MyBooks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { books, myBooks, loading, error } = useSelector((state) => state.books);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [viewMode, setViewMode] = useState('myBooks');
  const [selectedStatus, setSelectedStatus] = useState('All Books');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/register');
    } else {
      dispatch(fetchMyBooks());
      dispatch(fetchBooks());
    }
  }, [isAuthenticated, dispatch, navigate]);

  const displayedBooks = useMemo(() => (viewMode === 'myBooks' ? myBooks : books), [viewMode, myBooks, books]);

  const filteredBooksByStatus = useMemo(() => {
    if (viewMode === 'myBooks' && selectedStatus !== 'All Books') {
      return displayedBooks.filter(book => book.status === selectedStatus);
    }
    return displayedBooks;
  }, [viewMode, selectedStatus, displayedBooks]);

  const BookComponent = viewMode === 'myBooks' ? MyBookCard : BookCard;

  const handleStatusChange = async (bookId, newStatus) => {
    try {
      await dispatch(updateMyBook({ bookId, status: newStatus })).unwrap();
      dispatch(fetchMyBooks());
    } catch (err) {
      console.error('Failed to update book status:', err);
    }
  };

  const handleRemoveBook = async (bookId) => {
    if (window.confirm('Are you sure you want to remove this book from your collection?')) {
      try {
        await dispatch(removeFromMyBooks(bookId)).unwrap();
        dispatch(fetchMyBooks());
      } catch (err) {
        console.error('Failed to remove book:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-lg mb-4">Error loading books</div>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  const myBooksFilterOptions = ['All Books', 'Want to Read', 'Currently Reading', 'Read'];

  return (
    <div className="min-h-screen py-10 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {viewMode === 'myBooks' ? 'My Books' : 'All Books'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {viewMode === 'myBooks'
              ? 'View and manage your personal book collection.'
              : 'Browse the complete library collection.'}
          </p>
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            <button
              onClick={() => setViewMode('myBooks')}
              className={`px-6 py-3 rounded-full text-lg font-medium transition-colors ${
                viewMode === 'myBooks'
                  ? 'bg-blue-600 text-white dark:bg-blue-700 dark:text-gray-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              My Books
            </button>
            <button
              onClick={() => setViewMode('allBooks')}
              className={`px-6 py-3 rounded-full text-lg font-medium transition-colors ${
                viewMode === 'allBooks'
                  ? 'bg-blue-600 text-white dark:bg-blue-700 dark:text-gray-200'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All Books
            </button>
          </div>
          {viewMode === 'myBooks' && (
            <div className="flex flex-wrap gap-2 mb-6 w-full justify-center lg:justify-start">
              {myBooksFilterOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? 'bg-blue-600 text-white dark:bg-blue-700 dark:text-gray-200'
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
          <p className="text-gray-600 dark:text-gray-300 mb-6 w-full text-center lg:text-left">
            {filteredBooksByStatus.length} {filteredBooksByStatus.length === 1 ? 'book' : 'books'} found
          </p>
          <FaBookOpen size={80} className="text-blue-600 dark:text-blue-400 mb-8 animate-bounce hidden lg:block" />

          {filteredBooksByStatus.length > 0 ? (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filteredBooksByStatus.map((book) => (
                <BookComponent
                  key={book._id}
                  book={book}
                  {...(viewMode === 'myBooks' && { onStatusChange: handleStatusChange, onRemove: handleRemoveBook })}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 rounded-lg bg-white dark:bg-gray-800 bg-opacity-20 dark:bg-opacity-20">
              <FaBookOpen size={60} className="text-blue-400 dark:text-blue-300 mb-6" />
              <p className="text-gray-700 dark:text-gray-100 text-2xl sm:text-3xl font-semibold mb-3">
                {viewMode === 'myBooks' ? 'No books found in this category' : 'No public books found'}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl">
                {viewMode === 'myBooks' ? 'Try adding or changing your filter!' : 'The library is currently empty.'}
              </p>
              {viewMode === 'allBooks' && isAuthenticated && (
                <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl mt-2">How about adding one?</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBooks;
