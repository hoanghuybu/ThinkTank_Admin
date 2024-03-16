import styles from './HeaderGame.module.scss';
// import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { Link } from 'react-router-dom';
// import config from '~/config';

function HeaderGame() {
    return (
        <header className={styles.wrapper}>
            <div className={styles.inner}>
                <div></div>
                {/* <Link to={config.route.contest} className={styles.logo}>
                    <FontAwesomeIcon className={styles.logoImage} icon={faArrowLeft}></FontAwesomeIcon>
                </Link> */}
                <div></div>
            </div>
        </header>
    );
}

export default HeaderGame;
