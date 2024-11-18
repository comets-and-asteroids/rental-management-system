import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axios.get('/api/properties')
      .then(response => setProperties(response.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Список объектов недвижимости</h1>
      {properties.map(property => (
        <div key={property.id}>
          <h2>{property.title}</h2>
          <p>{property.description}</p>
          <a href={`/properties/${property.id}`}>Подробнее</a>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
