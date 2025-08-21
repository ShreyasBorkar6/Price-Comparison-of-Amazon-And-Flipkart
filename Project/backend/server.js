const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const bookmarkRoutes = require('./routes/bookmarks');
const cors = require('cors'); // Import the cors middleware

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Configure CORS to allow requests from any origin
// This is suitable for development. For production, specify your domain.
const corsOptions = {
  origin: 'https://price-comparison-of-amazon-and-flipkart-frontend-idsp01wmx.vercel.app/', // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies and authentication headers
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the route handlers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// Define a simple root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
