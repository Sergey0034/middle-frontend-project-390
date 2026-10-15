import styles from "./FlightNotFound.module.css";

const FlightNotFound = () => {
  return (
      <div className={styles.flightNotFound} data-testid="flight-not-found">Рейс не найден</div>
  )
}

export default FlightNotFound