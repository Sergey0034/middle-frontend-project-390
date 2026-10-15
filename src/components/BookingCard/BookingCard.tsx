import styles from "./BookingCard.module.css";
import clsx from "clsx";
import type { Ticket } from "../../types/tickets";
import { useState } from "react";
import { api } from "../../api/client";
type MyBookingProps = {
    ticket: Ticket;
};

const BookingStatus  = {
    Success: "Подтверждена",
    Cancel: "Отменена"
} as const

const BookingCard = ({ ticket }: MyBookingProps) => {
    const isConfirmed = ticket.status.toLowerCase() === "confirmed";
    const [status, setStatus] = useState(isConfirmed ? BookingStatus.Success : BookingStatus.Cancel);
    const iconCurrency = ticket.totalPrice.currency === "RUB" ? '₽' : ticket.totalPrice.currency;
    const [cancelStatus, setCancelStatus] = useState("idle");

    const onCancelBooking = async () => {
        try {
            setCancelStatus("loading");
            await api.post(`/api/bookings/${ticket.code}/cancel`, {
                lastName: ticket.passengers[0].lastName
            });
            setCancelStatus("success");
            setStatus(BookingStatus.Cancel)
        } catch (err) {
            if (err instanceof Error) {
                setCancelStatus("error");
                setStatus(isConfirmed ? BookingStatus.Success : BookingStatus.Cancel)
            }
        }
    }
    return (
        <div className={styles.container} data-testid="booking-details">
            <header className={styles.header}>
                <div className={styles.code} data-testid="booking-code">{ticket.code}</div>
                <div className={clsx(styles.status, status === BookingStatus.Success ? styles.success : styles.cancel)} data-testid="booking-status"
                    data-status={ticket.status}
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
            {(isConfirmed && cancelStatus === "idle") && <button
                className={styles.btn}
                type="button"
                onClick={onCancelBooking}
                data-testid="cancel-booking"
            >Отменить бронь</button>}
        </div>
    );
};

export default BookingCard;
