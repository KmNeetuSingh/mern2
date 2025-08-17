// middlewares/cors.js
const cors = require("cors");

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);

    // ✅ Allow all localhost for development
    if (origin.startsWith("http://localhost")) {
      return callback(null, true);
    }

    // ✅ Allow ALL subdomains (any .vercel.app, .onrender.com, etc.)
    if (
      /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin) ||   // any vercel subdomain
      /^https:\/\/[a-z0-9-]+\.onrender\.com$/.test(origin)    // any render subdomain
    ) {
      return callback(null, true);
    }

    // ✅ You can add your future custom domain here if needed
    // Example: if (origin === "https://mylibraryapp.com") return callback(null, true);

    console.warn(`🚨 Blocked by CORS: ${origin}`);
    return callback(new Error("❌ Not allowed by CORS"));
  },
  credentials: true, // Allow cookies and auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = cors(corsOptions);
