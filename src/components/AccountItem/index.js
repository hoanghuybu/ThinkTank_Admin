import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from '../Image';
import styles from './AccountItems.module.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function AccountItems({ data }) {
    return (
        <Link to={`/@${data.nickname}`} className={styles.wrapper}>
            <Image className={styles.avatar} src={data.avatar} alt={data.full_name}></Image>
            <div className={styles.info}>
                <h4 className={styles.name}>
                    <span> {data.full_name} </span>
                    {data.tick && <FontAwesomeIcon className={styles.check} icon={faCheckCircle}></FontAwesomeIcon>}
                </h4>
                <span className={styles.userName}>{data.nickname}</span>
            </div>
        </Link>
    );
}

AccountItems.propTypes = {
    data: PropTypes.object.isRequired,
};

export default AccountItems;
