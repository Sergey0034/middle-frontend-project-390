import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { City } from "../types/cities";

const useFetchCities = () => {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchCities = async () => {
            try {
                setLoading(true);
                setError(null);
                const { data } = await api.get(`/api/cities`, {
                    signal: controller.signal,
                });
                setCities(data);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchCities();

        return () => controller.abort();
    }, [])

    return { cities, loading, error }
};

export default useFetchCities;