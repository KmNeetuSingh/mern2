import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addBook, addToMyBooks, fetchMyBooks } from '../store/slices/booksSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../ThemeContext';
import { FaBookOpen } from 'react-icons/fa';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    publishedYear: '',
    pages: '',
    genre: '',
    coverImage: '',
  });

  const [fadeIn, setFadeIn] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.books);
  const { theme } = useTheme();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();

    const bookData = { ...formData };

    try {
      const resultAction = await dispatch(addBook(bookData));

      if (addBook.fulfilled.match(resultAction)) {
        toast.success('🎉 Book added successfully!');
        const newBookId = resultAction.payload._id;

        const addToMyBooksResult = await dispatch(addToMyBooks(newBookId));

        if (addToMyBooks.fulfilled.match(addToMyBooksResult)) {
          toast.info('📚 Book added to your collection.');
          dispatch(fetchMyBooks());
          setFormData({
            title: '',
            author: '',
            description: '',
            publishedYear: '',
            pages: '',
            genre: '',
            coverImage: '',
          });
          setShowSuccessModal(true);
        } else {
          toast.warn('Book created, but failed to add to your collection.');
        }
      } else {
        const error = resultAction.payload?.message || 'Failed to add book.';
        toast.error(error);
      }
    } catch (error) {
      console.error('Error saving book:', error);
      toast.error('An unexpected error occurred while saving the book.');
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col lg:flex-row ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`flex-1 flex flex-col justify-center items-center px-12 py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} lg:px-32 lg:py-32`}>
        <h1 className={`text-5xl lg:text-6xl font-bold mb-8 text-center lg:text-left w-full ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          Add a New Book
        </h1>
        <p className={`text-2xl lg:text-3xl mb-10 text-center lg:text-left w-full ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Expand your library by adding a new book to your collection.
        </p>
        <FaBookOpen size={80} className={`mb-8 animate-bounce hidden lg:block ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-12 py-20 bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900 min-h-[400px] w-full lg:px-32 lg:py-32">
        <div className={`w-full bg-white dark:bg-gray-700 rounded-xl shadow-lg p-8 space-y-6 max-w-2xl bg-opacity-90 dark:bg-opacity-90 transition-opacity duration-700 ease-in-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className={`text-3xl font-bold text-center ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Book Details</h1>
          <form onSubmit={handleSaveBook} className="space-y-6">
            <div>
              <label htmlFor="title" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
            </div>
            <div>
              <label htmlFor="author" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Author</label>
              <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} required
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
            </div>
            <div>
              <label htmlFor="description" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
              <textarea id="description" name="description" rows="3" value={formData.description} onChange={handleChange}
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}></textarea>
            </div>
            <div>
              <label htmlFor="coverImage" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Cover Image URL</label>
              <input type="text" id="coverImage" name="coverImage" value={formData.coverImage} onChange={handleChange}
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="publishedYear" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Published Year</label>
                <input type="number" id="publishedYear" name="publishedYear" value={formData.publishedYear} onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
              </div>
              <div>
                <label htmlFor="pages" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Pages</label>
                <input type="number" id="pages" name="pages" value={formData.pages} onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
              </div>
              <div>
                <label htmlFor="genre" className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Genre</label>
                <input type="text" id="genre" name="genre" value={formData.genre} onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${loading
                ? 'bg-gray-400 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg dark:bg-blue-700 dark:hover:bg-blue-800'
              }`}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white dark:text-gray-200" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Adding Book...
                </span>
              ) : (
                'Add Book'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">🎉 Book Added!</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Your book has been successfully added to your collection.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBook;
