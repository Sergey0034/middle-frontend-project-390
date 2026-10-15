import { useState } from "react";
import { api } from "../api/client";
import type { SearchPayload } from "../pages/SearchFlights/SearchForm/SearchForm";

const useFetchFlights = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const search = async (payload: SearchPayload) => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.get(`/api/flights`, {
                params: payload,
            });
            setFlights(data);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return { flights, loading, error, search };
};

export default useFetchFlights;
