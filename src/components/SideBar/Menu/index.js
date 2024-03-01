import PropTypes from 'prop-types';
import MenuItems from './MenuItems';
import { AiOutlineLogout } from 'react-icons/ai';
import classNames from 'classnames/bind';
import styles from './MenuSidebar.module.scss';
// import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function MenuSidebar({ children }) {
    // const navigate = useNavigate();

    // const handleLogout = async () => {
    //     const refreshToken = sessionStorage.getItem('refreshToken');

    //         if (refreshToken) {
    //             try {
    //                 const response = await fetch(
    //                     `https://beprn231catdoglover20231105200231.azurewebsites.net/api/Auth/Logout/${refreshToken}`,
    //                     {
    //                         method: 'POST',
    //                         headers: {
    //                             'Content-Type': 'application/json',
    //                         },
    //                     },
    //                 );
    //                 if (response.ok) {
    //                     sessionStorage.clear();
    //                     navigate('/');
    //                 }
    //             } catch (error) {
    //                 console.error('Error fetching data:', error);
    //             }
    //         }
    return (
        <nav>
            {children}
            <div className={cx('logout-item')}>
                <MenuItems
                    title="Log Out"
                    to="#"
                    onClick={(e) => {
                        e.preventDefault();
                        console.log('was clicked');
                    }}
                    icon={<AiOutlineLogout />}
                ></MenuItems>
            </div>
        </nav>
    );
}

MenuSidebar.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MenuSidebar;
