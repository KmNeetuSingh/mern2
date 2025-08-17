import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log(import.meta.env.VITE_API_URL);

// Async thunks
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/books`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMyBooks = createAsyncThunk(
  'books/fetchMyBooks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/mybooks`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addToMyBooks = createAsyncThunk(
  'books/addToMyBooks',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseURL}/mybooks`,
        { bookId },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateMyBook = createAsyncThunk(
  'books/updateMyBook',
  async ({ bookId, status, rating, review, notes }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${baseURL}/mybooks/${bookId}`,
        { status, rating, review, notes },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeFromMyBooks = createAsyncThunk(
  'books/removeFromMyBooks',
  async (bookId, { rejectWithValue }) => {
    try {
      await axios.delete(`${baseURL}/mybooks/${bookId}`, { withCredentials: true });
      return bookId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addBook = createAsyncThunk(
  'books/addBook',
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseURL}/books`, bookData, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  books: [],
  myBooks: [],
  loading: false,
  error: null,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.books;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch books';
      })
      .addCase(fetchMyBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.myBooks = action.payload;
      })
      .addCase(fetchMyBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch your books';
      })
      .addCase(addToMyBooks.fulfilled, (state, action) => {
        state.myBooks.push(action.payload);
      })
      .addCase(updateMyBook.fulfilled, (state, action) => {
        const index = state.myBooks.findIndex(
          (book) => book._id === action.payload._id
        );
        if (index !== -1) {
          state.myBooks[index] = action.payload;
        }
      })
      .addCase(removeFromMyBooks.fulfilled, (state, action) => {
        state.myBooks = state.myBooks.filter(book => book._id !== action.payload);
      })
      .addCase(addBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add book';
      });
  },
});

export const { clearError } = booksSlice.actions;
export default booksSlice.reducer;
