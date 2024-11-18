import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';

const PropertyForm = ({ propertyId }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (propertyId) {
      // Если это редактирование, загружаем данные объекта
      const fetchProperty = async () => {
        try {
          const response = await axios.get(`/api/properties/${propertyId}`);
          const { title, description, price, location } = response.data;
          setValue('title', title);
          setValue('description', description);
          setValue('price', price);
          setValue('location', location);
        } catch (error) {
          console.error('Ошибка при загрузке объекта недвижимости', error);
        }
      };
      fetchProperty();
    }
  }, [propertyId, setValue]);

  const onSubmit = async (data) => {
    try {
      const url = propertyId ? `/api/properties/${propertyId}` : '/api/properties';
      const method = propertyId ? 'put' : 'post';
      const response = await axios[method](url, data);
      console.log(response)
      router.push('/properties');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Ошибка при сохранении объекта');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>{propertyId ? 'Редактировать объект' : 'Добавить новый объект'}</h1>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <div>
        <label>Название</label>
        <input
          type="text"
          {...register('title', { required: 'Название объекта обязательно' })}
        />
        {errors.title && <span>{errors.title.message}</span>}
      </div>
      <div>
        <label>Описание</label>
        <input
          type="text"
          {...register('description', { required: 'Описание обязательно' })}
        />
        {errors.description && <span>{errors.description.message}</span>}
      </div>
      <div>
        <label>Цена</label>
        <input
          type="number"
          {...register('price', { required: 'Цена обязательна' })}
        />
        {errors.price && <span>{errors.price.message}</span>}
      </div>
      <div>
        <label>Локация</label>
        <input
          type="text"
          {...register('location', { required: 'Локация обязательна' })}
        />
        {errors.location && <span>{errors.location.message}</span>}
      </div>
      <button type="submit">{propertyId ? 'Сохранить изменения' : 'Добавить объект'}</button>
    </form>
  );
};

export default PropertyForm;
