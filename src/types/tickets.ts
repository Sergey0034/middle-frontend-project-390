export type Ticket = {
    code: string;
    status: string;
    flight: {
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
    passengers: Passenger[];
    contact: {
        email: string;
        phone: string;
    };
    totalPrice: {
        amount: number;
        currency: string;
    };
    createdAt: string;
};

export type Passenger = {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    documentNumber: string;
};
