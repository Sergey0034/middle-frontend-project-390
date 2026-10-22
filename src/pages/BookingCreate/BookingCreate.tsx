import { useParams } from "react-router-dom";
import styles from "./BookingCreate.module.css";
import useFetchFlight from "../../hooks/useFetchFlight";
import { Form, Button, DatePicker, Input, Divider } from "antd";
import InputMasked from 'antd-imask-input';
import { useState } from "react";
import { api } from "../../api/client";
import type { Ticket } from "../../types/tickets";
import type { Dayjs } from "dayjs";
import FlightNotFound from "./FlightNotFound/FlightNotFound";

const BookingCreate = () => {
    const { id } = useParams<{ id: string }>();
    const { flight, loading, error } = useFetchFlight(id);
    const [form] = Form.useForm();
    const [countPassengers, setCountPassengers] = useState(1);
    const [statusSubmit, setStatusSubmit] = useState("idle");
    const [submitResult, setSubmitResult] = useState<Ticket>();
    const onBooking = async (values: Record<string, string | Dayjs>) => {
        const formValues = {
            flightId: id,
            contact: {
                email: values.email,
                phone: `+${values.phone}`
            },
            passengers: Array.from({ length: countPassengers }).map((_, i) => ({
                firstName: values[`firstName-${i}`],
                lastName: values[`lastName-${i}`],
                dateOfBirth: (values[`dateOfBirth-${i}`] as Dayjs)?.format("YYYY-MM-DD"),
                documentNumber: values[`documentNumber-${i}`]
            }))
        }

        setStatusSubmit("loading");
        try {
            const { data } = await api.post(`/api/bookings`, formValues);
            setSubmitResult(data);
            setStatusSubmit("success")
        } catch {
            setStatusSubmit("error");
        }
    }

    if (loading) return (<div>Загрузка...</div>)
    if (error || flight?.code === "not_found") return <FlightNotFound />

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>{statusSubmit === "success" ? "Бронирование оформлено" : "Оформление бронирования"}</h2>
            </header>
            {statusSubmit === "success" ?
                <div>
                    <div className={styles.flightBooking} data-testid="booking-success">
                        <div>Код бронирования: <span className={styles.code} data-testid="booking-code">{submitResult?.code}</span></div>
                        <div>{submitResult?.flight?.origin?.name} &rarr; {submitResult?.flight?.destination?.name}, {submitResult?.flight?.flightNumber}</div>
                        <div>Пассажиров: {submitResult?.passengers?.length ?? 0}</div>
                        <div>Итого: {submitResult?.totalPrice?.amount} {submitResult?.flight?.price?.currency === "RUB" ? '₽' : submitResult?.flight.price.currency}</div>
                    </div>
                </div>
                :
                <>
                    <div className={styles.flight} data-testid="booking-flight">
                        {flight?.airline?.name} &bull; {flight?.flightNumber}: {flight?.origin?.name} &rarr; {flight?.destination?.name}
                    </div>
                    {statusSubmit === "loading" && <div>Бронируем...</div>}
                    {statusSubmit === "error" && <div data-testid="booking-error">Ошибка бронирования <button onClick={() => setStatusSubmit("idle")}>Повторить</button></div>}
                    {statusSubmit === "idle" && <Form
                        name="booking"
                        form={form}
                        layout="vertical"
                        onFinish={onBooking}
                        className={styles.form}
                        requiredMark={false}
                        data-testid="booking-form"
                    >
                        <div className={styles.contact}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: "Укажите email" },
                                    { type: 'email', message: "Некорректный email" }
                                ]}
                                style={{
                                    width: '50%'
                                }}
                            >
                                <Input
                                    type="email"
                                    placeholder="user@example.com"
                                    data-testid="contact-email"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Телефон"
                                name="phone"
                                rules={[{ required: true, message: "Укажите телефон" }]}
                                style={{
                                    width: '50%'
                                }}
                            >
                                <InputMasked
                                    maskOptions={{
                                        mask: '+0 (000) 000-00-00'
                                    }}
                                    placeholder="+7 (___) ___-__-__"
                                    allowClear
                                    data-testid="contact-phone"
                                />
                            </Form.Item>
                        </div>
                        <Divider className={styles.passengersDivider} orientation="horizontal">Пассажиры</Divider>
                        <div className={styles.passengers}>
                            {Array.from({ length: countPassengers }, (_, index) => (
                                <div key={index} className={styles.passenger}>
                                    <Form.Item
                                        label="Имя"
                                        name={`firstName-${index}`}
                                        rules={[
                                            { required: true, message: "Укажите имя" }
                                        ]}
                                        style={{
                                            width: '25%'
                                        }}
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Имя"
                                            data-testid={`passenger-${index}-firstName`}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Фамилия"
                                        name={`lastName-${index}`}
                                        rules={[
                                            { required: true, message: "Укажите фамилию" }
                                        ]}
                                        style={{
                                            width: '25%'
                                        }}
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Фамилия"
                                            data-testid={`passenger-${index}-lastName`}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Дата рождения"
                                        name={`dateOfBirth-${index}`}
                                        rules={[{ required: true, message: "Выберите дату рождения" }]}
                                        
                                    >
                                        <DatePicker
                                            placeholder="yyyy-mm-dd"
                                            format="YYYY-MM-DD"
                                            data-testid={`passenger-${index}-dob`}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Документ"
                                        name={`documentNumber-${index}`}
                                        rules={[
                                            { required: true, message: "Укажите документ" }
                                        ]}
                                        style={{
                                            width: '25%'
                                        }}
                                        normalize={(value) => {
                                            if (!value) return value;
                                            if (value.length <= 4) return value;
                                            return `${value.slice(0, 4)} ${value.slice(4, 10)}`;
                                        }}
                                    >
                                        <InputMasked
                                            maskOptions={{
                                                mask: '0000 000000'
                                            }}
                                            placeholder="____ ______"
                                            allowClear
                                            data-testid={`passenger-${index}-document`}
                                        />
                                    </Form.Item>
                                </div>
                            ))}
                        </div>
                        <div className={styles.actions}>
                            <Button
                                className={styles.add}
                                htmlType="button"
                                onClick={() => setCountPassengers(countPassengers + 1)}
                                data-testid="add-passenger"
                            >
                                Добавить пассажира
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className={styles.bookingBtn}
                                data-testid="booking-submit"
                            >
                                Забронировать
                            </Button>
                        </div>
                    </Form>}
                </>}


        </div>
    )
}

export default BookingCreate