import styles from "./BookingCard.module.css";
import clsx from "clsx";
import type { Ticket } from "../../types/tickets";
import { useState } from "react";
import { api } from "../../api/client";
type MyBookingProps = {
    ticket: Ticket;
};

const BookingStatus  = {
    confirmed: "Подтверждена",
    cancelled: "Отменена"
} as const

const BookingCard = ({ ticket }: MyBookingProps) => {
    const isConfirmed = ticket.status.toLowerCase() === "confirmed";
    const [status, setStatus] = useState(isConfirmed ? BookingStatus.confirmed : BookingStatus.cancelled);
    const iconCurrency = ticket.totalPrice.currency === "RUB" ? '₽' : ticket.totalPrice.currency;
    const [cancelStatus, setCancelStatus] = useState("idle");

    const onCancelBooking = async () => {
        try {
            setCancelStatus("loading");
            await api.post(`/api/bookings/${ticket.code}/cancel`, {
                lastName: ticket.passengers[0].lastName
            });
            setStatus(BookingStatus.cancelled)
            setCancelStatus("success");
        } catch (err) {
            if (err instanceof Error) {
                setCancelStatus("error");
                setStatus(isConfirmed ? BookingStatus.confirmed : BookingStatus.cancelled)
            }
        }
    }
    return (
        <div className={styles.container} data-testid="booking-details">
            <header className={styles.header}>
                <div className={styles.code} data-testid="booking-code">{ticket.code}</div>
                <div className={clsx(styles.status, status === BookingStatus.confirmed ? styles.success : styles.cancel)} data-testid="booking-status"
                    data-status={status === BookingStatus.confirmed ? 'confirmed' : 'cancelled'}
                >
                    {status.toUpperCase()}
                </div>
            </header>
            <div className={styles.description}>
                <div className={styles.info}>
                    {ticket.flight.airline.name} &bull; {ticket.flight.flightNumber}: {ticket.flight.origin.name} &rarr; {ticket.flight.destination.name}
                </div>
                <div className={styles.passengers}>Пассажиры: {ticket.passengers.map((p, i) => `${p.firstName} ${p.lastName}${i === ticket.passengers.length - 1 ? '' : ', '}`)}</div>
                <div className={styles.cost}>Итого: {ticket.totalPrice.amount} {iconCurrency}</div>
            </div>
            {cancelStatus === "error" && <div>Ошибка при отмене бронирования</div>}
            {cancelStatus === "loading" && <div>Отменяем бронирование...</div>}
            {(status === BookingStatus.confirmed) && <button
                className={styles.btn}
                type="button"
                onClick={onCancelBooking}
                data-testid="cancel-booking"
            >Отменить бронь</button>}
        </div>
    );
};

export default BookingCard;
