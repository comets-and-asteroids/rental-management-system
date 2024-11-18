import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('/api/properties');
        setProperties(response.data);
      } catch (error) {
        console.error('Ошибка при получении объектов недвижимости', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div>
      <h1>Список объектов недвижимости</h1>
      <Link href="/properties/add">
        <button>Добавить новый объект</button>
      </Link>
      <ul>
        {properties.map(property => (
          <li key={property._id}>
            <h2>{property.title}</h2>
            <p>{property.description}</p>
            <p>Цена: {property.price} ₽</p>
            <Link href={`/properties/${property._id}`}>Подробнее</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyList;
