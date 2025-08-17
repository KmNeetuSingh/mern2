import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from './store/slices/authSlice';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBooks from './pages/MyBooks';
import AddBook from './pages/AddBook';

// ThemeProvider
import { ThemeProvider } from './ThemeContext';

function App() {
  const dispatch = useDispatch();

  // Dispatch loadUser on app mount to check session
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/my-books"
                element={
                  <PrivateRoute>
                    <MyBooks />
                  </PrivateRoute>
                }
              />
              <Route
                path="/add-book"
                element={
                  <PrivateRoute>
                    <AddBook />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
