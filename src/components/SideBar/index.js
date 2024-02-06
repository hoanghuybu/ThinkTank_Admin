import styles from './Sidebar.module.scss';
import MenuSidebar from './Menu';
import MenuItems from './Menu/MenuItems';
import config from '~/config';
import {
    AiOutlineDashboard,
    AiOutlineUser,
    AiOutlineVideoCameraAdd,
    AiOutlineBarChart,
    AiOutlineCrown,
    AiOutlineBuild,
} from 'react-icons/ai';

function SideBar() {
    return (
        <aside className={styles.wrapper}>
            <MenuSidebar>
                <MenuItems title="DashBoard" to={config.route.home} icon={<AiOutlineDashboard />}></MenuItems>
                <MenuItems
                    title="Player Account"
                    to={config.route.following}
                    icon={<AiOutlineUser></AiOutlineUser>}
                ></MenuItems>
                <MenuItems title="Game Resource" to={config.route.live} icon={<AiOutlineVideoCameraAdd />}></MenuItems>
                <MenuItems title="Analyis" to={config.route.report} icon={<AiOutlineBarChart />}></MenuItems>
                <MenuItems title="Contest" to={config.route.report} icon={<AiOutlineBuild />}></MenuItems>
                <MenuItems title="Leaderboard" to={config.route.report} icon={<AiOutlineCrown />}></MenuItems>
            </MenuSidebar>
        </aside>
    );
}

export default SideBar;
