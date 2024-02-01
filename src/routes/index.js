import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Upload from '~/pages/Upload';
import Profile from '~/pages/Profile';
import Live from '~/pages/Live';
import LoginPage from '~/pages/Login';
import Details from '~/pages/Details';
import UserDetails from '~/pages/Details/UserDetails';
import CreateUser from '~/pages/CreateUser';
import { HeaderOnly, WhiteLayouts } from '~/layouts';
import Report from '~/pages/Report';
import config from '~/config';

const publicRounter = [{ path: config.route.login, component: LoginPage, layouts: WhiteLayouts }];

const privateRounter = [
    { path: config.route.upload, component: Upload, layouts: HeaderOnly },
    { path: config.route.home, component: Home },
    { path: config.route.following, component: Following },
    { path: config.route.live, component: Live },
    { path: config.route.profile, component: Profile },
    { path: config.route.report, component: Report },
    { path: config.route.details, component: Details, layouts: HeaderOnly },
    { path: config.route.userDetails, component: UserDetails, layouts: HeaderOnly },
    { path: config.route.createUser, component: CreateUser, layouts: HeaderOnly },
];

export { privateRounter, publicRounter };
