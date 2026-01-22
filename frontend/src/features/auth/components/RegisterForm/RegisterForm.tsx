import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@alfalab/core-components-input';
import { PasswordInput } from '@alfalab/core-components-password-input';
import { Button } from '@alfalab/core-components-button';
import { Typography } from '@alfalab/core-components-typography';
import { Card } from '@/components';
import { useRegister } from '../../hooks/useRegister';
import { ApiClientError } from '@/shared/api';
import styles from './RegisterForm.module.css';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { mutate: register, isPending, error } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ email, password, name });
  };

  const errorMessage = error instanceof ApiClientError ? error.message : error?.message;

  return (
    <Card>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Typography.Title tag="h1" view="small" className={styles.title}>
          Регистрация в Workfly
        </Typography.Title>

        {errorMessage && (
          <div className={styles.error}>
            <Typography.Text view="primary-small" color="negative">
              {errorMessage}
            </Typography.Text>
          </div>
        )}

        <Input
          label="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          block
          required
        />

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
          hint="Минимум 8 символов"
        />

        <Button type="submit" view="primary" size="m" block loading={isPending} className={styles.button}>
          Зарегистрироваться
        </Button>

        <Typography.Text view="primary-small" className={styles.link}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </Typography.Text>
      </form>
    </Card>
  );
}
