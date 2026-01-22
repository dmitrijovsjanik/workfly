import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@alfalab/core-components-input';
import { PasswordInput } from '@alfalab/core-components-password-input';
import { Button } from '@alfalab/core-components-button';
import { Typography } from '@alfalab/core-components-typography';
import { Card } from '@/components';
import { useLogin } from '../../hooks/useLogin';
import { ApiClientError } from '@/shared/api';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  const errorMessage = error instanceof ApiClientError ? error.message : error?.message;

  return (
    <Card>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Typography.Title tag="h1" view="small" className={styles.title}>
          Вход в Workfly
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

        <Button type="submit" view="primary" size="m" block loading={isPending} className={styles.button}>
          Войти
        </Button>

        <Typography.Text view="primary-small" className={styles.link}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </Typography.Text>
      </form>
    </Card>
  );
}
