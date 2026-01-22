import { useNavigate } from 'react-router-dom';
import { Typography } from '@alfalab/core-components-typography';
import { CreateOrderForm } from '../../components/CreateOrderForm';
import styles from './CreateOrderPage.module.css';

export function CreateOrderPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography.Title tag="h1" view="small">
          Новый заказ
        </Typography.Title>
      </div>

      <CreateOrderForm onSuccess={handleSuccess} />
    </div>
  );
}
