const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const limiter = require('./midlewares/ratelimits');
const app = express();

const router = require('./routes/user_route') ;
const triprouter = require('./routes/partner_routes');
const orderrouter = require('./routes/order_routes');
const reviewrouter = require('./routes/review_routes');

// CORS config
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json());
app.use(limiter);
app.use('/api',
  router,
  triprouter,
  orderrouter,
  reviewrouter
);


app.get('/', (req, res) => {
  res.send('API Gateway');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
