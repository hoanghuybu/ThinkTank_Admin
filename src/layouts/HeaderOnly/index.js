import Header from '../Header';
import styles from './HeaderOnly.module.scss';

function HeaderOnly({ children }) {
    return (
        <div className={styles.wrapper}>
            <Header />
            <div className={styles.container}>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
}

export default HeaderOnly;
