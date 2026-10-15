function Ticket() {
    return (
        <article >
            <header >
                <h3 >{'title'}</h3>
                <span>{'item.price'} ₽</span>
            </header>

            <p>{'item.description'}</p>

            <button
                type="button"
                onClick={() => console.log("Забронировано")}
            >
                Забронировать
            </button>
        </article>
    );
}

export default Ticket;
