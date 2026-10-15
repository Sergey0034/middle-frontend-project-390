import type { Ticket } from "../../types/tickets"
import BookingCard from "../BookingCard/BookingCard";
import styles from "./BookingList.module.css";
type BookingListProps = {
    tickets: Ticket[];
};
const BookingList = ({ tickets }: BookingListProps) => {

    return (
        <div className={styles.container}>
            {
                tickets.map(ticket => (
                    <BookingCard ticket={ticket} />
                ))
            }
        </div>

    )
}

export default BookingList