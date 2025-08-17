// middlewares/cors.js
const cors = require('cors');

// ✅ Whitelisted origins (update this list if the frontend link changes)
const allowedOrigins = [
  'http://localhost:5173',
  'https://library-app-two-nu.vercel.app',
  'https://library-app-git-main-neetsins-projects.vercel.app',
  'https://library-nnsrlgfrc-neetsins-projects.vercel.app',
  'https://library-app-2yo9.vercel.app',
  'https://library-app-2yo9-git-main-neetsins-projects.vercel.app',
  'https://library-app-2yo9-7cpnthqbi-neetsins-projects.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // ✅ Allow the request
    } else {
      callback(new Error('❌ Not allowed by CORS'));
    }
  },
  credentials: true, // Allow sending cookies and auth headers
};

module.exports = cors(corsOptions); // 👈 Export configured middleware
