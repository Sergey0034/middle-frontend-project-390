import Ticket from "../Ticket/Ticket";

function Tickets() {
    const tickets: any[] = [];
    return (
        <ul>
            {tickets.map((item) => (
                <li key={item.id}>
                    <Ticket></Ticket>
                </li>
            ))}
        </ul>
    );
}

export default Tickets;
