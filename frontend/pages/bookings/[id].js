import { useRouter } from 'next/router';
import BookingForm from '../../components/booking/BookingForm';

const BookingPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      {id ? <BookingForm propertyId={id} /> : null}
    </div>
  );
};

export default BookingPage;
