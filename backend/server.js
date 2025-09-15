const app = require('./app');
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Connect to Database
(async () => {
  try {
    await connectDatabase();
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit if DB connection fails
  }
})();

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Server
const PORT = process.env.PORT || 4001;
console.log("PORT from env:", process.env.PORT);

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT} in ${process.env.NODE_ENV} mode`);
});
