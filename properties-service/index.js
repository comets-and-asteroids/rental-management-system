const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

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
  .then(() => console.log('MongoDB connected for properties-service'))
  .catch(err => console.error(err));

  const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    available: { type: Boolean, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  }, { timestamps: true });

const Property = mongoose.model('Property', PropertySchema);

app.post('/properties', authenticateToken, async (req, res) => {
    const { title, description, price, location } = req.body;
    try {
      const newProperty = new Property({
        title, description, price, location, owner: req.user._id
      });
      const savedProperty = await newProperty.save();
      res.status(201).json(savedProperty);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

app.get('/properties', async (req, res) => {
  try {
    const { minPrice, maxPrice, location } = req.query;

    const query = {};
    if (minPrice) query.price = { $gte: minPrice };
    if (maxPrice) query.price = { ...query.price, $lte: maxPrice };
    if (location) query.location = location;

    const properties = await Property.find(query);
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
  
app.put('/properties/:id', authenticateToken, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        if (property.owner.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'You are not the owner of this property' });
        }

        const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProperty);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
  
app.delete('/properties/:id', authenticateToken, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not the owner of this property' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
}
});

app.listen(PORT, () => {
  console.log(`Properties service running on port ${PORT}`);
});
