import { useEffect, useMemo } from "react";
import type { City } from "../../../types/cities";
import styles from "./SearchForm.module.css"
import { Form, Button, DatePicker, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

export type SearchValues = {
    from: string;
    to: string;
    date: Dayjs;
    passengers: number;
}

export type SearchPayload = Pick<SearchValues, 'passengers'> & {
    date: string;
    origin: string;
    destination: string;
};

type SearchFormProps = {
    cities: City[],
    onSearch: (payload: SearchPayload) => void;
}
type CitiesForm = {
    label: string;
    value: string;
}


function SearchForm({ cities, onSearch }: SearchFormProps) {
    const [form] = Form.useForm();
    const handleSearch = (values: SearchValues) => {
        const payload = {
            origin: values.from,
            destination: values.to,
            date: values.date?.format("YYYY-MM-DD"),
            passengers: values.passengers,
        };
        onSearch?.(payload);
    }

    const citiesForm: CitiesForm[] = useMemo(() => cities.map((city) => ({
        label: city.name,
        value: city.code
    })), [cities])

    useEffect(() => {
        if (citiesForm.length > 0) {
            form.setFieldsValue({ from: citiesForm?.[0]?.value });
            form.setFieldsValue({ to: citiesForm?.[1]?.value });
            const payload = {
                origin: form.getFieldValue('from'),
                destination: form.getFieldValue('to'),
                date: form.getFieldValue('date')?.format("YYYY-MM-DD"),
                passengers: form.getFieldValue('passengers'),

            };
            onSearch?.(payload);
        }


    }, [citiesForm, form, onSearch])

    return (
        <Form
            name="search"
            form={form}
            layout="vertical"
            onFinish={handleSearch}
            initialValues={{ passengers: 1, date: dayjs() }}
            className={styles.form}
            requiredMark={false}
            data-testid="flight-search-form"
        >
            <Form.Item
                label="Откуда"
                name="from"
                rules={[{ required: true, message: "Укажите, откуда" }]}
                style={{
                    width: '30%'
                }}
                data-testid="search-origin"
            >
                <Select
                    allowClear
                    showSearch
                    placeholder="Город вылета"
                    options={citiesForm}
                    getPopupContainer={trigger => trigger.parentElement!}
                />
            </Form.Item>

            <Form.Item
                label="Куда"
                name="to"
                rules={[{ required: true, message: "Укажите, куда" }]}
                style={{
                    width: '30%'
                }}
                data-testid="search-destination"
            >
                <Select
                    allowClear
                    showSearch
                    placeholder="Город вылета"
                    options={citiesForm}
                    getPopupContainer={trigger => trigger.parentElement!}
                />
            </Form.Item>

            <Form.Item
                label="Дата"
                name="date"
                rules={[{ required: true, message: "Выберите дату" }]}
            >
                <DatePicker
                    placeholder="Дата"
                    format="DD/MM/YYYY"
                    disabledDate={(current) =>
                        current && current < dayjs().startOf('day')
                    }
                    data-testid="search-date"
                />
            </Form.Item>

            <Form.Item
                label="Пассажиры"
                name="passengers"
                rules={[
                    {
                        required: true,
                        message: "Укажите количество пассажиров",
                    },
                ]}

            >
                <InputNumber
                    data-testid="search-passengers"
                    min={1}
                    max={9}
                    placeholder="Пассажиры"
                />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.submitBtn}
                    data-testid="search-submit"
                >
                    Найти
                </Button>
            </Form.Item>
        </Form>
    );
}

export default SearchForm;
