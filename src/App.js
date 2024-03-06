import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { publicRounter, privateRounter } from '~/routes';
import { DefaultLayouts } from '~/layouts';
import { Fragment } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@coreui/coreui/dist/css/coreui.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [hasAccessToken, setHasAccessToken] = useState(!!sessionStorage.getItem('accessToken'));

    useEffect(() => {
        const accessToken = sessionStorage.getItem('accessToken');
        setHasAccessToken(!!accessToken);
    }, []);

    useEffect(() => {
        const eventListener = () => {
            const accessToken = sessionStorage.getItem('accessToken');
            setHasAccessToken(!!accessToken);
        };
        window.addEventListener('accessTokenUpdated', eventListener);

        return () => {
            window.removeEventListener('accessTokenUpdated', eventListener);
        };
    }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRounter.map((route, index) => {
                        const Page = route.component;
                        let Layouts = DefaultLayouts;
                        if (route.layouts) {
                            Layouts = route.layouts;
                        } else if (route.layouts === null) {
                            Layouts = Fragment;
                        }
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layouts>
                                        <Page />
                                    </Layouts>
                                }
                            />
                        );
                    })}

                    {privateRounter.map((route, index) => {
                        if (hasAccessToken) {
                            const Page = route.component;
                            let Layouts = DefaultLayouts;
                            if (route.layouts) {
                                Layouts = route.layouts;
                            } else if (route.layouts === null) {
                                Layouts = Fragment;
                            }
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layouts>
                                            <Page />
                                        </Layouts>
                                    }
                                />
                            );
                        } else {
                            return <Route key={index} path={route.path} element={<Navigate to="/" replace={true} />} />;
                        }
                    })}
                </Routes>
            </div>
            <ToastContainer />
        </Router>
    );
}

export default App;
