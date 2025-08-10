const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const userRouter = require('./router');
const mongoose = require('./DTB/mongo'); // Import the mongoose connection



app.use(bodyParser.json());
app.use(cookieParser()); // Add cookie parser middleware
app.use('/api/users', userRouter);

// Connect to MongoDB
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
