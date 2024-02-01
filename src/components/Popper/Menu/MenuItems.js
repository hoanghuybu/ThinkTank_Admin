import Button from '~/components/Button';
import styles from './Menu.module.scss';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function MenuItems({ data, onClick }) {
    const classes = cx('menuItem', {
        separate: data.separate,
    });

    const navigate = useNavigate();

    const handleLogout = async () => {
        const refreshToken = sessionStorage.getItem('refreshToken');

        if (refreshToken) {
            try {
                const response = await fetch(
                    `https://beprn231catdoglover20231105200231.azurewebsites.net/api/Auth/Logout/${refreshToken}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                );
                if (response.ok) {
                    sessionStorage.clear();
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };
    return (
        <Button
            className={classes}
            leftIcon={data.icon}
            to={data.to}
            onClick={async () => {
                if (data.title === 'Log out') {
                    await handleLogout();
                } else {
                    onClick();
                }
            }}
            // onClick={handleLogout}
        >
            {data.title}
        </Button>
    );
}

MenuItems.propTypes = {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func,
};

export default MenuItems;
