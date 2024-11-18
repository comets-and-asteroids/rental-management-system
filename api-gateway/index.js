const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('API Gateway is running!');
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Тут можно добавить логику для хранения данных пользователя в БД

  res.status(201).json({ message: 'User registered', username });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Логика для проверки пользователя, например, сверка с БД

  // После успешной аутентификации генерируем JWT
  const payload = { username };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ message: 'Login successful', token });
});

// Защищенный маршрут (требующий JWT)
app.get('/protected', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }

    res.json({ message: 'Welcome to the protected route', user: decoded.username });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
