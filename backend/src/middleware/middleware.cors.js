// middlewares/cors.js
const cors = require('cors');

// ✅ Whitelisted origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://library-app-two-nu.vercel.app',
  'https://library-app-git-main-neetsins-projects.vercel.app',
  'https://library-nnsrlgfrc-neetsins-projects.vercel.app',
  'https://library-app-2yo9.vercel.app',
  'https://library-app-2yo9-git-main-neetsins-projects.vercel.app',
  'https://library-app-2yo9-7cpnthqbi-neetsins-projects.vercel.app',
  'https://mern2-7lj3.vercel.app', // ✅ add your latest frontend
];

// ✅ CORS Options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚨 CORS blocked request from origin: ${origin}`);
      
      // Fallback option: allow all in DEV mode
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true); // ✅ don’t block in dev
      } else {
        callback(new Error('❌ Not allowed by CORS'));
      }
    }
  },
  credentials: true, // allow cookies / auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = cors(corsOptions);
