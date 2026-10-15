import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.css";

const Layout = () => {
    return (
        <div className={styles.appContainer}>
            <header className={styles.appHeader}>
                <h1>Бронирование авиабилетов</h1>
            </header>
            <nav className={styles.nav}>
                <Link to="/search-flight">Поиск рейсов</Link>
                <Link to="/lookup" data-testid="nav-lookup">Мои брони</Link>
            </nav>

            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
