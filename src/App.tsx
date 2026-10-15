import Layout from "./components/Layout/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyBooking from "./pages/MyBooking/MyBooking";
import SearchFlights from "./pages/SearchFlights/SearchFlights";
import BookingCreate from "./pages/BookingCreate/BookingCreate";

const App = () => {
    throw new Error("Error Thrown on purpose to send it to Bugsink");
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<SearchFlights />} />
                    <Route path="search-flight" element={<SearchFlights />} />
                    <Route path="lookup" element={<MyBooking />} />
                    <Route path="booking/:id" element={<BookingCreate />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
