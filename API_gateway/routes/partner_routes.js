const express = require('express');
const router = express.Router();
const axios = require('axios');
const { verifyTokenFromCookie } = require('../midlewares/auth');

const createTrip = async (req, res) => {
    try {
        const items = req.body;
        console.log('Received trip data:', items);
        const requiredFields = [
            'routeCode',
            'partnerId',
            'from',
            'to',
            'departureTime',
            'duration',
            'price',
            'totalSeats',
            'busType',
            'licensePlate'
        ];

        const missingFields = requiredFields.filter(field => !items.hasOwnProperty(field));

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
        }

        const response = await axios.post('http://localhost:3002/api/trips/create/trip', items, {
            headers: { 'Content-Type': 'application/json' }
        });

        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ message: "Failed to create trip" });
    }
};

router.post('/trip/create', createTrip);

router.get('/trip/:partnerId', async (req, res) => {
    try {
        const { partnerId } = req.params;
        console.log('Fetching trips for partnerId:', partnerId);
        const response = await axios.get(`http://localhost:3002/api/trips/trip/${partnerId}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching trips:', res.message);
        res.status(500).json({ message: "Failed to fetch trips" });
    }
});

router.get('/trips', async (req, res) => {
    try {
        const { page, limit, sortBy, sortOrder, isActive } = req.query;
        console.log('Fetching all trips with params:', req.query);
        
        const response = await axios.get('http://localhost:3002/api/trips/trips', {
            params: { page, limit, sortBy, sortOrder, isActive }
        });
        
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching all trips:', error.message);
        res.status(500).json({ message: "Failed to fetch trips" });
    }
});

router.delete('/trip/delete/:tripId', async (req, res) => {
    try {
        const { tripId } = req.params;
        console.log('Deleting trip with ID:', tripId);
        const response = await axios.delete(`http://localhost:3002/api/trips/delete/trip/${tripId}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error deleting trip:', error.message);
        res.status(500).json({ message: "Failed to delete trip" });
    }
});


router.put('/trip/update/:tripId', async (req, res) => {
    try {
        const { tripId } = req.params;
        const items = req.body;
        console.log('Updating trip with ID:', tripId, 'Data:', items);
        
        const response = await axios.put(`http://localhost:3002/api/trips/update/trip/${tripId}`, items, {
            headers: { 'Content-Type': 'application/json' }
        });

        res.status(200).json(response.data);
    }
    catch (error) {
        console.error('Error updating trip:', error.message);
        res.status(500).json({ message: "Failed to update trip" });
    }
});

router.get('/trips/search', async (req, res) => {
    try {
        const { 
            from, 
            to, 
            departureTime, 
            busType, 
            minPrice, 
            maxPrice, 
            minRating, 
            tags, 
            isActive 
        } = req.query;
        console.log('Searching trips with:', req.query);

        const response = await axios.get('http://localhost:3002/api/trips/search/trips', {
            params: { 
                from, 
                to, 
                departureTime, 
                busType, 
                minPrice, 
                maxPrice, 
                minRating, 
                tags, 
                isActive 
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error searching trips:', error.message);
        res.status(500).json({ message: "Failed to search trips" });
    }
});

router.get('/route/data/:routeid', async (req, res) => {
    try {
        const { routeid } = req.params;
        const response = await axios.get(`http://localhost:3002/api/trips/route/data/${routeid}`);
        console.log('Fetched route data:', response.data);
        res.json({
           response: response.data,
        });
    } catch (error) {
        console.error('Error fetching route data:', error.message);
        res.status(500).json({ message: "Failed to fetch route data" });
    }
});

// Order routes
router.post('/order/create', async (req, res) => {
    try {
        const orderData = req.body;
        console.log('Creating order:', orderData);
        
        const requiredFields = [
            'routeId',
            'userId',
            'bussinessId',
            'fullName',
            'phone',
            'email',
            'paymentMethod',
            'basePrice'
        ];

        const missingFields = requiredFields.filter(field => !orderData.hasOwnProperty(field));

        if (missingFields.length > 0) {
            return res.status(400).json({ 
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}` 
            });
        }

        const response = await axios.post('http://localhost:3002/api/orders/order/create', orderData, {
            headers: { 'Content-Type': 'application/json' }
        });

        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating order:', error);
        if (error.response && error.response.data) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ 
                success: false,
                message: "Failed to create order" 
            });
        }
    }
});

router.put('/order/accept/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log('Accepting order with ID:', orderId);
        
        const response = await axios.put(`http://localhost:3002/api/orders/order/accept/${orderId}`, {}, {
            headers: { 'Content-Type': 'application/json' }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error accepting order:', error.message);
        res.status(500).json({ message: "Failed to accept order" });
    }
});
router.put('/order/decline/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log('Declining order with ID:', orderId);
        
        const response = await axios.put(`http://localhost:3002/api/orders/order/decline/${orderId}`, {}, {
            headers: { 'Content-Type': 'application/json' }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error declining order:', error.message);
        res.status(500).json({ message: "Failed to decline order" });
    }
});

router.get('/order/route/:routeId', async (req, res) => {
    try {
        const { routeId } = req.params;
        console.log('Fetching orders for route ID:', routeId);
        
        const response = await axios.get(`http://localhost:3002/api/orders/order/route/${routeId}`);
        
        console.log('Fetched orders:', response.data);
        
        // Handle the case where Trip_Service returns { data: orders }
        const orders = response.data.data || response.data;
        
        if (Array.isArray(orders) && orders.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }
        
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching orders by route ID:', error.message);
        if (error.response && error.response.data) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ 
                success: false,
                message: "Failed to fetch orders" 
            });
        }
    }
});
router.get('/user/orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Fetching orders for user ID:', userId);
        
        const response = await axios.get(`http://localhost:3002/api/orders/user/orders/${userId}`);
        console.log('Fetched user orders:', response.data);
        // const contactres = await axios.get(`http://localhost:4001/api/users/partner/${response.data.businessId}/contact`);
        // console.log('Fetched partner contact:', contactres.data);
        
        // Handle the case where Trip_Service returns { data: orders }
        const orders = response.data.data || response.data;
        
        if (Array.isArray(orders) && orders.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }
        console.log('Fetched user orders:', orders);
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching user orders:', error.message);
        if (error.response && error.response.data) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ 
                success: false,
                message: "Failed to fetch user orders" 
            });
        }
    }
});


module.exports = router;
