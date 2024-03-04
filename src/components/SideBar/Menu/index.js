import PropTypes from 'prop-types';
import MenuItems from './MenuItems';
import { AiOutlineLogout } from 'react-icons/ai';
import classNames from 'classnames/bind';
import styles from './MenuSidebar.module.scss';
import { useNavigate } from 'react-router-dom';
import * as loginService from '~/service/LoginService';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function MenuSidebar({ children }) {
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        const accessToken = sessionStorage.getItem('accessToken');
        const accountId = sessionStorage.getItem('accountId');
        if (accountId && accessToken) {
            try {
                const response = await loginService.logout(accountId, accessToken);
                if (response) {
                    sessionStorage.clear();
                    navigate('/');
                }
            } catch (error) {
                toast.error('Error fetching data:', error);
            }
        }
    };

    return (
        <nav>
            {children}
            <div className={cx('logout-item')}>
                <MenuItems title="Log Out" to="#" onClick={handleLogout} icon={<AiOutlineLogout />}></MenuItems>
            </div>
        </nav>
    );
}

MenuSidebar.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MenuSidebar;
