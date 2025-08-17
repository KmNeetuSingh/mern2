import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { FaSun, FaMoon, FaBookOpen } from 'react-icons/fa';
import { useTheme } from '../ThemeContext';

const navigation = [
  { name: 'My Books', href: '/my-books' },
  { name: 'Add Book', href: '/add-book' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 fixed w-full z-50 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-white dark:text-gray-100 text-2xl font-bold flex items-center">
              <FaBookOpen className="mr-2 text-blue-400 dark:text-blue-300" />
              My Library
            </Link>
            {user && (
              <div className="hidden md:block ml-10 space-x-4">
                {navigation
                  .map((item) => (
                <Link
                      key={item.name}
                      to={item.href}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                      {item.name}
                </Link>
                  ))}
              </div>
            )}
          </div>
          <div className="flex items-center">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full bg-gray-800 dark:bg-gray-700 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-offset-gray-700 mr-4"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FaSun className="h-6 w-6" aria-hidden="true" />
              ) : (
                <FaMoon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>

            {user ? (
                <button
                onClick={handleLogout}
                className="text-gray-300 hover:bg-gray-700 hover:text-white dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                Sign out
                </button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 