import { useEffect, useState } from 'react';
import axios from 'axios';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/bookings')
      .then(response => setBookings(response.data))
      .catch(err => setError(err.response?.data?.message || 'Ошибка загрузки бронирований'));
  }, []);

  return (
    <div>
      <h1>Мои бронирования</h1>
      {error && <p className="error">{error}</p>}
      {bookings.map(booking => (
        <div key={booking.id} className="booking-item">
          <h3>{booking.property.title}</h3>
          <p>Дата: {booking.date}</p>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
