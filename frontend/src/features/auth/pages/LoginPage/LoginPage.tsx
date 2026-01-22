import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Input } from '@alfalab/core-components-input';
import { PasswordInput } from '@alfalab/core-components-password-input';
import { Button } from '@alfalab/core-components-button';
import { Typography } from '@alfalab/core-components-typography';
import { useAuth } from '../../hooks/useAuth';
import { useLogin } from '../../hooks/useLogin';
import { ApiClientError } from '@/shared/api';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { mutate: login, isPending, error } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (authLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  const errorMessage = error instanceof ApiClientError ? error.message : error?.message;

  return (
    <div className={styles.container}>
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoText}>workfly</span>
      </div>

      {/* Card with Form */}
      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Typography.Title tag="h1" view="small" className={styles.title}>
            Вход
          </Typography.Title>

          {errorMessage && (
            <div className={styles.error}>
              <Typography.Text view="primary-small" color="negative">
                {errorMessage}
              </Typography.Text>
            </div>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            block
            required
          />

          <PasswordInput
            label="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            block
            required
          />

          <Button type="submit" view="primary" size="m" block loading={isPending}>
            Войти
          </Button>
        </form>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          view="secondary"
          size="m"
          className={styles.actionButton}
          onClick={() => navigate('/')}
        >
          Назад
        </Button>
        <Button
          view="tertiary"
          size="m"
          className={styles.actionButton}
          onClick={() => navigate('/register')}
        >
          Регистрация
        </Button>
      </div>
    </div>
  );
}
