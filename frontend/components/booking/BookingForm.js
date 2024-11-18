import { useForm } from 'react-hook-form';
import axios from 'axios';

const BookingForm = ({ propertyId }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/bookings', {
        propertyId,
        ...data,
      });
      alert('Бронирование успешно создано' + response);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Ошибка при создании бронирования');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Бронирование</h1>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <div>
        <label>Дата начала</label>
        <input
          type="date"
          {...register('startDate', { required: 'Дата начала обязательна' })}
        />
        {errors.startDate && <span>{errors.startDate.message}</span>}
      </div>
      <div>
        <label>Дата окончания</label>
        <input
          type="date"
          {...register('endDate', { required: 'Дата окончания обязательна' })}
        />
        {errors.endDate && <span>{errors.endDate.message}</span>}
      </div>
      <button type="submit">Забронировать</button>
    </form>
  );
};

export default BookingForm;
