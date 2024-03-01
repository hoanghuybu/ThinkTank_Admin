import HeaderGame from '../../components/HeaderGame';
import styles from './HeaderGameOnly.module.scss';

function HeaderGameOnly({ children }) {
    return (
        <div className={styles.wrapper}>
            <HeaderGame />
            <div className={styles.container}>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
}

export default HeaderGameOnly;
