import styles from './Header.module.scss';
import images from '~/assets/images';
import { Link } from 'react-router-dom';
import config from '~/config';

function Header() {
    return (
        <header className={styles.wrapper}>
            <div className={styles.inner}>
                <Link to={config.route.home} className={styles.logo}>
                    <img className={styles.logoImage} src={images.logoText} alt="Think Tank"></img>
                </Link>
                <h2>Think Tank Admin dashboard</h2>
            </div>
        </header>
    );
}

export default Header;
