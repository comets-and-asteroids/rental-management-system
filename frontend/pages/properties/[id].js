import { useRouter } from 'next/router';
import PropertyForm from '../../components/property/PropertyForm';

const EditPropertyPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      {id ? <PropertyForm propertyId={id} /> : null}
    </div>
  );
};

export default EditPropertyPage;
