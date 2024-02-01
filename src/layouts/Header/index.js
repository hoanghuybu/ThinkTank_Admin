import styles from './Header.module.scss';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleQuestion,
    // faCoins,
    faEarthAfrica,
    faEllipsisVertical,
    // faGear,
    faKeyboard,
    faPlus,
    faSignOut,
} from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import Tippy from '@tippyjs/react';
import Button from '~/components/Button';
import Menu from '~/components/Popper/Menu';
import 'tippy.js/dist/tippy.css';
import { InboxIcon, MessageIcon } from '~/components/Icons';
import Image from '~/components/Image';
// import Search from '../Search';
import { Link, useNavigate } from 'react-router-dom';
import config from '~/config';

const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faEarthAfrica}></FontAwesomeIcon>,
        title: 'Vietnamese',
        children: {
            title: 'Languange',
            data: [
                {
                    code: 'en',
                    title: 'English',
                },
                {
                    code: 'vn',
                    title: 'Vietnamese',
                },
                {
                    code: 'jp',
                    title: 'Japanese',
                },
            ],
        },
    },
    {
        icon: <FontAwesomeIcon icon={faCircleQuestion}></FontAwesomeIcon>,
        title: 'Feedback and help',
        to: 'feedback',
    },
    {
        icon: <FontAwesomeIcon icon={faKeyboard}></FontAwesomeIcon>,
        title: 'Keyboard shortcut',
    },
];

function Header() {
    const currentUser = true;
    const navigate = useNavigate();

    const handleMenuOnChange = (menuItems) => {
        console.log(menuItems);
    };

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>,
            title: 'View Profile',
            to: '/@staff',
        },
        {
            icon: <FontAwesomeIcon icon={faSignOut}></FontAwesomeIcon>,
            title: 'Log out',
            separate: true,
        },
    ];

    return (
        <header className={styles.wrapper}>
            <div className={styles.inner}>
                <Link to={config.route.home} className={styles.logo}>
                    <img className={styles.logoImage} src={images.CDLP_logo} alt="CDLP"></img>
                </Link>
                {/* <Search></Search> */}
                <div className={styles.actions}>
                    {currentUser ? (
                        <>
                            <Button to="/CreateUser" text leftIcon={<FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>}>
                                Create
                            </Button>
                            <Tippy delay={[0, 200]} content="User" placement="bottom">
                                <button
                                    onClick={() => {
                                        navigate('/staff');
                                    }}
                                    className={styles.actionsBtn}
                                >
                                    <MessageIcon></MessageIcon>
                                </button>
                            </Tippy>
                            <Tippy delay={[0, 200]} content="Post" placement="bottom">
                                <button
                                    onClick={() => {
                                        navigate('/post');
                                    }}
                                    className={styles.actionsBtn}
                                >
                                    <InboxIcon></InboxIcon>
                                </button>
                            </Tippy>
                        </>
                    ) : (
                        <>
                            {/* <Button text leftIcon={<FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>}>
                                Upload
                            </Button> */}
                            <Button primary>Login</Button>
                        </>
                    )}
                    <Menu items={currentUser ? userMenu : MENU_ITEMS} onChange={handleMenuOnChange}>
                        {currentUser ? (
                            <Image
                                className={styles.userAvatar}
                                alt="Do Hoang Huy"
                                src="https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/b47bf9a7076dade7aa42e8657ef3d3f9~c5_100x100.jpeg?x-expires=1681200000&x-signature=Qmk7icxDOrVONo0RFdhOfeDzwq4%3D"
                            ></Image>
                        ) : (
                            <button className={styles.moreBtn}>
                                <FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon>
                            </button>
                        )}
                    </Menu>
                </div>
            </div>
        </header>
    );
}

export default Header;
