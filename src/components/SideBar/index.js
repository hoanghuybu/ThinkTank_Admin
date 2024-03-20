import styles from './Sidebar.module.scss';
import MenuSidebar from './Menu';
import MenuItems from './Menu/MenuItems';
import config from '~/config';
import {
    AiOutlineDashboard,
    AiOutlineUser,
    AiOutlineVideoCameraAdd,
    AiOutlineCrown,
    AiOutlineBuild,
} from 'react-icons/ai';

function SideBar() {
    return (
        <aside className={styles.wrapper}>
            <MenuSidebar>
                <MenuItems title="DashBoard" to={config.route.dashboard} icon={<AiOutlineDashboard />}></MenuItems>
                <MenuItems
                    title="Player Account"
                    to={config.route.playerManagement}
                    icon={<AiOutlineUser></AiOutlineUser>}
                ></MenuItems>
                <MenuItems
                    title="Game Resource"
                    to={config.route.gameResource}
                    icon={<AiOutlineVideoCameraAdd />}
                ></MenuItems>

                <MenuItems title="Contest" to={config.route.contest} icon={<AiOutlineBuild />}></MenuItems>
                <MenuItems title="Leaderboard" to={config.route.leaderboard} icon={<AiOutlineCrown />}></MenuItems>
            </MenuSidebar>
        </aside>
    );
}

export default SideBar;
