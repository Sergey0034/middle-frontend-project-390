import Flights from "./Flights/Flights"
import SearchForm from "./SearchForm/SearchForm"
import useFetchCities from "../../hooks/useFetchCities";
import useFetchFlights from "../../hooks/useFetchFlights";

const SearchFlights = () => {
    const { cities } = useFetchCities();
    const { flights, loading, error, search } = useFetchFlights();

    return (
        <>
            <SearchForm cities={cities} onSearch={search} />
            <Flights flights={flights} loading={loading} error={error} />
        </>
    )
}

export default SearchFlights