import styles from './HomePage.module.css';

function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Workfly</h1>
        <p className={styles.subtitle}>Фриланс-биржа в формате Tinder</p>
        <p className={styles.description}>
          Находите заказы и исполнителей свайпами
        </p>
        <div className={styles.status}>
          <span className={styles.dot} />
          Скоро запуск
        </div>
      </div>
    </div>
  );
}

export default HomePage;
