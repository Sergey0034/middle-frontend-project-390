import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { FlightType } from "../types/flights";

const useFetchFlight = (id: string | undefined) => {
    const [flight, setFlight] = useState<FlightType>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const controller = new AbortController();
        const fetchFlight = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await api.get(`/api/flights/${id}`, {
                    signal: controller.signal,
                });
                setFlight(data);
            } catch (e) {
                if (e instanceof Error) {
                    if (e.message !== "canceled") {
                        setError(e.message);
                    }
                }
            } finally {
                 if (!controller.signal.aborted) {
                     setLoading(false);
                 }
            }
        };

        fetchFlight();

        return () => controller.abort();
    }, [id]);

    return { flight, loading, error };
};

export default useFetchFlight;
