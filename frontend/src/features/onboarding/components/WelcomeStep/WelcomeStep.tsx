import { Typography } from '@alfalab/core-components-typography';
import { Button } from '@alfalab/core-components-button';
import styles from './WelcomeStep.module.css';

interface WelcomeStepProps {
  userName: string;
  onNext: () => void;
}

export function WelcomeStep({ userName, onNext }: WelcomeStepProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Typography.Title tag="h1" view="medium" className={styles.title}>
          {userName ? `${userName}, добро пожаловать!` : 'Добро пожаловать!'}
        </Typography.Title>

        <Typography.Text view="primary-medium" color="secondary" className={styles.subtitle}>
          Workfly — фриланс-биржа в формате свайпов
        </Typography.Text>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>1</div>
            <Typography.Text view="primary-small">
              Свайпайте заказы как в Tinder
            </Typography.Text>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>2</div>
            <Typography.Text view="primary-small">
              Получайте матчи с заказчиками
            </Typography.Text>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>3</div>
            <Typography.Text view="primary-small">
              Работайте через безопасную сделку
            </Typography.Text>
          </div>
        </div>
      </div>

      <Button view="primary" size="m" block onClick={onNext}>
        Начать
      </Button>
    </div>
  );
}
