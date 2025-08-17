import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { FaBookOpen } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Login successful! 🎉');
      navigate('/');
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [isAuthenticated, error, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900">
        {/* Left Section: Intro */}
        <div className="flex-1 flex flex-col justify-center items-center px-12 py-20 bg-white dark:bg-gray-800 lg:px-32 lg:py-32">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center lg:text-left w-full">
            Welcome Back!
          </h1>
          <p className="text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-10 text-center lg:text-left w-full">
            Log in to access your personal library and track your reading journey.
          </p>
          <FaBookOpen size={80} className="text-blue-600 dark:text-blue-400 mb-8 animate-bounce hidden lg:block" />
        </div>
        {/* Right Section: Login Form */}
        <div className="flex-1 flex flex-col justify-center items-center px-12 py-20 bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900 min-h-[400px] w-full lg:px-32 lg:py-32">
          <div className="w-full max-w-md bg-white bg-opacity-90 dark:bg-gray-700 dark:bg-opacity-90 rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-600"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-600"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white ${
                  loading
                    ? 'bg-blue-400 cursor-not-allowed dark:bg-blue-500 dark:cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                }`}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
