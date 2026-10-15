export type FlightType = {
    code?: string;
    id: string;
    flightNumber: string;
    airline: {
        code: string;
        name: string;
    };
    origin: {
        code: string;
        name: string;
        country: string;
    };
    destination: {
        code: string;
        name: string;
        country: string;
    };
    departureAt: string;
    arrivalAt: string;
    durationMinutes: number;
    price: {
        amount: number;
        currency: string;
    };
    seatsAvailable: number;
};

export type FlightTypeError = {
    statusCode: number;
    code: string;
    message: string;
};