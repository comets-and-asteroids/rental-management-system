const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json()); 

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid Token' });
      req.user = user;
      next();
    });
  };

  
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected for bookings-service'))
  .catch(err => console.error(err));

  const BookingSchema = new mongoose.Schema({
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'canceled'], default: 'pending' },
  }, { timestamps: true });
  

const Booking = mongoose.model('Booking', BookingSchema);

app.post('/bookings', authenticateToken, async (req, res) => {
    const { propertyId, startDate, endDate, totalPrice } = req.body;
  
    try {
      const property = await Property.findById(propertyId);
      if (!property) return res.status(404).json({ message: 'Property not found' });
  
      if (!property.available) {
        return res.status(400).json({ message: 'Property is already booked' });
      }
  
      const newBooking = new Booking({
        propertyId, userId: req.user._id, startDate, endDate, totalPrice
      });
  
      await Property.findByIdAndUpdate(propertyId, { available: false }); 
      const savedBooking = await newBooking.save();
      res.status(201).json(savedBooking);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

app.get('/bookings', async (req, res) => {
  try {
    const { userId, status } = req.query;

    const query = {};
    if (userId) query.userId = userId;
    if (status) query.status = status;

    const bookings = await Booking.find(query).populate('propertyId userId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('propertyId userId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/bookings/:id', async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBooking) return res.status(404).json({ message: 'Booking not found' });
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/bookings/:id', authenticateToken, async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
  
      if (booking.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You are not the owner of this booking' });
      }
      await Property.findByIdAndUpdate(booking.propertyId, { available: true });
      await Booking.findByIdAndDelete(req.params.id);
      res.json({ message: 'Booking canceled successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

app.listen(PORT, () => {
  console.log(`Bookings service running on port ${PORT}`);
});
