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
        const accountId = sessionStorage.getItem('accountId');
        if (accountId) {
            try {
                const response = await loginService.logout(accountId);
                if (response) {
                    sessionStorage.clear();
                    navigate('/');
                }
            } catch (error) {
                if (error.response.data.error) {
                    toast.error(error.response.data.error);
                }
                if (error.response.data.errors) {
                    for (let key in error.response.data.errors) {
                        if (error.response.data.errors.hasOwnProperty(key)) {
                            error.response.data.errors[key].forEach((errorMessage) => {
                                const errorString = `${key}: ${errorMessage}`;
                                toast.error(errorString);
                            });
                        }
                    }
                }
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
