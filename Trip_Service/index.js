const express = require('express');
const cors = require('cors');
const app = express();
const triprouter = require('./route/trip_routes');
const orderrouter = require('./route/order_routes');
const reviewrouter = require('./route/review_routes'); 
const mongoose = require('./DTB/mongo'); // Import the mongoose connection
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3001'],
  credentials: true
}));

// Health check route
app.get('/', (req, res) => {
  res.status(200).send('Trip Service is up and running');
});

app.use('/api/trips', triprouter);
app.use('/api/orders', orderrouter);
app.use('/api/reviews', reviewrouter);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

app.listen(3002, () => {
  console.log('Trip Service running on port 3002');
});
