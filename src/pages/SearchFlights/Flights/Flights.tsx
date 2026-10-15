import type { FlightType } from "../../../types/flights";
import Flight from "../Flight/Flight";
import styles from "./Flights.module.css";

type FlightsProps = {
    flights: FlightType[];
    loading: boolean;
    error: string | null;
}

const Flights = ({ flights, loading, error }: FlightsProps) => {
    if (error) return (<div data-testid="flights-error">Ошибка загрузки: <span>{error}</span></div>)
    if (loading) return (<div>Загрузка...</div>)
    if (flights.length === 0) return (<div className={styles.empty} data-testid="flights-empty">Рейсов не найдено</div>)
    return (
        <div className={styles.container} data-testid="flight-results">
            {flights.map(flight => (
                <Flight flight={flight} key={flight.id} />
            ))}
        </div>
    )
}

export default Flights