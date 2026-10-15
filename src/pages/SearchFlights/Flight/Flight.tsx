import { useNavigate } from "react-router-dom";
import type { FlightType } from "../../../types/flights";
import styles from "./Flight.module.css";
import dayjs from "dayjs";

type FlightProps = {
    flight: FlightType
}
const Flight = ({ flight }: FlightProps) => {
    const navigate = useNavigate();
    const iconCurrency = flight.price.currency === "RUB" ? '₽' : flight.price.currency;
    return (
        <article className={styles.container} data-testid="flight-result-item">
            <header className={styles.header}>
                <h4>{flight.airline.name} &bull; {flight.flightNumber} </h4>
            </header>
            <div className={styles.description}>
                <div className={styles.route}>
                    <div className={styles.cities}>{flight.origin.name} &rarr; {flight.destination.name}</div>
                    <div className={styles.date}>{dayjs(flight.departureAt).format('DD.MM.YYYY, HH:mm')} - {dayjs(flight.arrivalAt).format('DD.MM.YYYY, HH:mm')} &bull; {flight.durationMinutes} мин</div>
                </div>
                <div className={styles.action}>
                    <div className={styles.price}>{flight.price.amount} {iconCurrency}</div>
                    <button
                        className={styles.btn}
                        type="button"
                        onClick={() => navigate(`/booking/${flight.id}`)}
                        data-testid="book-flight"
                    >Забронировать</button>
                </div>
            </div>
        </article>
    )
}

export default Flight