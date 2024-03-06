// import Home from '~/pages/Home';
// import Following from '~/pages/Following';
// import Upload from '~/pages/Upload';
// import Profile from '~/pages/Profile';
// import Live from '~/pages/Live';
import LoginPage from '~/pages/Login';
// import Details from '~/pages/Details';
// import UserDetails from '~/pages/Details/UserDetails';
// import CreateUser from '~/pages/CreateUser';
// import Report from '~/pages/Report';
import Dashboard from '~/pages/Dashboard/Dashboard';
import PlayerManagement from '~/pages/PlayerManagement';
import GameResource from '~/pages/GameResource';
import Analysis from '~/pages/Analysis';
import Contest from '~/pages/Contest';
import Leaderboard from '~/pages/Leaderboard';
import ContestGame from '~/pages/ContestGame';
import CreateContest from '~/pages/CreateContest';

import { WhiteLayouts, HeaderGameOnly } from '~/layouts';
import config from '~/config';

const publicRounter = [
    { path: config.route.login, component: LoginPage, layouts: WhiteLayouts },
    { path: config.route.contest, component: Contest },
    { path: config.route.contestGame, component: ContestGame, layouts: HeaderGameOnly },
    { path: config.route.contestCreate, component: CreateContest, layouts: HeaderGameOnly },
    { path: config.route.dashboard, component: Dashboard },
];

const privateRounter = [
    { path: config.route.playerManagement, component: PlayerManagement },
    { path: config.route.gameResource, component: GameResource },
    { path: config.route.analysis, component: Analysis },
    { path: config.route.contest, component: Contest },
    { path: config.route.leaderboard, component: Leaderboard },
];

export { privateRounter, publicRounter };
