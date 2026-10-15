import { Button, Form, Input } from "antd";
import styles from "./MyBooking.module.css";
import BookingCard from "../../components/BookingCard/BookingCard";
import { useState } from "react";
import type { Ticket } from "../../types/tickets";
import { api } from "../../api/client";

type ValuesBooking = {
    code: string;
    lastName: string;
}

const MyBooking = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTickets = async (payload: { code: string; lastName: string }) => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.get(`/api/bookings/${payload.code}`, {
                params: {
                    lastName: payload.lastName
                },
            });

            setTickets([data]);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }

        } finally {
            setLoading(false);
        }
    };
    const onSearch = (values: ValuesBooking) => {
        const payload = {
            code: values.code,
            lastName: values.lastName,
        };
       
        fetchTickets(payload)
    };

    if (loading) return (<div>Загрузка...</div>)


    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Моя бронь</h1>
            <Form
                name="search"
                layout="vertical"
                onFinish={onSearch}
                initialValues={{ passengers: 1 }}
                className={styles.form}
                requiredMark={false}
                data-testid="booking-lookup-form"
            >
                <Form.Item
                    label="Код брони"
                    name="code"
                    rules={[{ required: true, message: "Укажите код брони" }]}
                >
                    <Input placeholder="Код брони" data-testid="lookup-code"/>
                </Form.Item>

                <Form.Item
                    label="Фамилия"
                    name="lastName"
                    rules={[{ required: true, message: "Укажите фамилию" }]}
                >
                    <Input placeholder="Фамилия" data-testid="lookup-lastName"/>
                </Form.Item>
                
                <Button type="primary" htmlType="submit" data-testid="lookup-submit">
                    Найти
                </Button>
            </Form>

            {tickets.length === 0 || error?
                (<div className={styles.notFoundBooking} data-testid="booking-not-found">бронь не найдена...</div>) : (
                    <div className={styles.cards}>
                        {tickets.map(ticket => (
                            <BookingCard ticket={ticket} key={ticket.createdAt} />
                        ))}
                    </div>
                )}



        </div>
    );
};

export default MyBooking;
