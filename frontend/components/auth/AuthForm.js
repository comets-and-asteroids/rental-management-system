import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';

const AuthForm = ({ isRegister }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const url = isRegister ? '/api/auth/register' : '/api/auth/login';
      const response = await axios.post(url, data);
      localStorage.setItem('token', response.data.token); // Сохраняем токен
      router.push('/properties'); // Перенаправляем на список объектов
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Ошибка аутентификации');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>{isRegister ? 'Регистрация' : 'Вход'}</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div>
        <label>Email</label>
        <input
          type="email"
          {...register('email', { required: 'Email обязателен' })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      <div>
        <label>Пароль</label>
        <input
          type="password"
          {...register('password', { required: 'Пароль обязателен' })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      {isRegister && (
        <div>
          <label>Имя пользователя</label>
          <input
            type="text"
            {...register('username', { required: 'Имя пользователя обязательно' })}
          />
          {errors.username && <span>{errors.username.message}</span>}
        </div>
      )}
      <button type="submit">{isRegister ? 'Зарегистрироваться' : 'Войти'}</button>
    </form>
  );
};

export default AuthForm;
