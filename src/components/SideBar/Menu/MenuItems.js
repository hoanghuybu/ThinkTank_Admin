import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './MenuSidebar.module.scss';

const cx = classNames.bind(styles);

function MenuItems({ title, to, icon, onClick }) {
    return (
        <NavLink
            className={(nav) => cx('menu-item', { active: title !== 'Log Out' && nav.isActive })}
            to={to}
            onClick={onClick}
        >
            {icon}
            <span className={cx('title')}>{title}</span>
        </NavLink>
    );
}

MenuItems.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
};

export default MenuItems;
