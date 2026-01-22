import { Navigate } from 'react-router-dom';
import { RegisterForm } from '../../components/RegisterForm';
import { useAuth } from '../../hooks/useAuth';
import styles from './RegisterPage.module.css';

export function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.container}>
      <RegisterForm />
    </div>
  );
}
