import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../store/slices/booksSlice";
import { FaBookOpen } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

// Modal Component
const Modal = ({ title, message, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <p className="mb-6 text-gray-700 dark:text-gray-300">{message}</p>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Close
      </button>
    </div>
  </div>
);

// Reusable BookCard Component
const BookCard = ({ book, onClick }) => (
  <motion.div
    onClick={onClick}
    className="cursor-pointer rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800"
    initial={{ scale: 1 }}
    whileHover={{ scale: 1.05, y: -10 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    style={{ minWidth: "260px", maxWidth: "280px" }}
  >
    <div className="w-full h-64 overflow-hidden relative">
      <img
        src={book.coverImage}
        alt={book.title}
        className="w-full h-64 object-cover animate-marquee-img"
        loading="lazy"
      />
    </div>
    <div className="p-4 text-gray-900 dark:text-gray-100">
      <div className="relative overflow-hidden whitespace-nowrap h-8">
        <p className="text-xl font-semibold inline-block">{book.title}</p>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">{book.author}</p>
    </div>
  </motion.div>
);

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { books, loading, error } = useSelector((state) => state.books);
  const isSignedIn = useSelector((state) => state.auth.isAuthenticated);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleCardClick = () => {
    if (!isSignedIn) {
      setModalOpen(true);
    } else {
      navigate("/my-books");
    }
  };

  // Close modal and redirect to sign-in page
  const handleModalClose = () => {
    setModalOpen(false);
    navigate("/sign-in");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto dark:border-purple-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading books...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-lg mb-4">
            Error loading books
          </div>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Home | Your Library App</title>
        <meta
          name="description"
          content="Discover, track, and manage your personal book collection with ease."
        />
        <meta
          name="keywords"
          content="books, library, personal collection, React, reading tracker"
        />
        <meta 
          name="author"
          content="Neetu Singh" />
      </Helmet>
      <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900">
        {/* Left Section */}
        <div className="flex-1 flex flex-col justify-center items-center px-12 py-20 bg-white dark:bg-gray-800 lg:px-32 lg:py-32">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center lg:text-left w-full"
          >
            Welcome to Your Library
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-10 text-center lg:text-left w-full"
          >
            Discover, track, and manage your personal book collection with ease.
          </motion.p>
          <FaBookOpen
            size={80}
            className="text-blue-600 dark:text-blue-400 mb-8 animate-bounce hidden lg:block transform lg:-translate-x-12"
          />
        </div>

        {/* Right Section */}
        <div className="flex-1 flex flex-col justify-center items-center px-12 py-20 bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900 min-h-[400px] w-full lg:px-32 lg:py-32">
          {books.length > 0 ? (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-center">
              {books.map((book, index) => (
                <motion.div
                  key={book._id || index}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <BookCard book={book} onClick={handleCardClick} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <FaBookOpen
                size={80}
                className="text-blue-300 dark:text-blue-200 mb-8 opacity-80"
              />
              <h2 className="text-3xl font-semibold mb-4 text-white">
                Explore and Organize
              </h2>
              <p className="text-xl text-blue-100 dark:text-blue-50 opacity-90 mb-4">
                Keep track of what you're reading, want to read, and have
                finished.
              </p>
              <button
                onClick={handleCardClick}
                className="px-5 py-2 bg-white text-blue-800 rounded shadow hover:bg-blue-50 transition"
              >
                Start Exploring
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal
          title="Bro, sign in!"
          message="You need to sign in to access this feature."
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default Home;
