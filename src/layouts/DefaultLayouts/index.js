import Header from '../Header';
import SideBar from '../../components/SideBar';
import styles from './DefaultLayouts.module.scss';
import PropTypes from 'prop-types';

function DefaultLayouts({ children }) {
    return (
        <div className={styles.wrapper}>
            <Header />
            <div className={styles.container}>
                <SideBar />
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
}

DefaultLayouts.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayouts;
