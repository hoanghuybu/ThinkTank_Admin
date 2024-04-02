//Lib
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import jwtDecode from 'jwt-decode';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

//util
import * as loginService from '~/service/LoginService';

//style and source
import './Login.scss';
import images from '~/assets/images';

function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const userNameRef = useRef();
    const passwordRef = useRef();
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const errors = {};

        const formSubmit = {
            userName: userNameRef.current.value,
            password: passwordRef.current.value,
            fcm: '',
        };

        if (userNameRef.current.value.trim() === '') {
            errors.username = 'Username is required';
        }

        if (passwordRef.current.value.trim() === '') {
            errors.password = 'Password is required';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setIsLoading(false);
            return;
        }

        try {
            const response = await loginService.login(formSubmit);
            const jwtDecodeObject = jwtDecode(response.accessToken);
            if (jwtDecodeObject.role === 'Admin') {
                await new Promise((resolve) => {
                    sessionStorage.setItem('accessToken', response.accessToken);
                    sessionStorage.setItem('refreshToken', response.refreshToken);
                    sessionStorage.setItem('accountId', response.id);
                    const event = new Event('accessTokenUpdated');
                    window.dispatchEvent(event);
                    resolve();
                }).then(navigate('/Dashboard'));
            } else {
                toast.error(
                    "You don't have permission to access. Please try another account or contact the administrator",
                );
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.error);
            } else if (error.request) {
                // console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(error.config);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="login-container">
            <div className="circle-top-left"></div>
            <div class="circle-bottom-right"></div>

            <div className="row-2 row ">
                <div className="col-6 d-flex justify-content-center align-items-center">
                    <form onSubmit={onSubmit} className="form-admin-login">
                        <h1 className="welcome-text">
                            Welcome to <br />
                            <div className="d-flex justify-content-center align-items-center">
                                <img src={images.logoImage} alt="Think Tank Logo" className="welcome-logo"></img>
                                <span className="highlight-text">Think Tank</span>
                            </div>
                        </h1>
                        <p className="welcome-p text-center">
                            Welcome admin to the Think Tank website! We're thrilled to have you onboard and look forward
                            to your contributions
                        </p>
                        <div className="mb-3 input-container">
                            <div className="input-with-icon">
                                <FontAwesomeIcon className="input-icon" icon={faUser}></FontAwesomeIcon>
                                <input
                                    type="text"
                                    ref={userNameRef}
                                    className="form-control form-control-lg login-input"
                                    placeholder="Username"
                                />
                            </div>
                            {validationErrors.username && (
                                <div>
                                    <span className="error">{validationErrors.username}</span>
                                </div>
                            )}
                        </div>
                        <div className="mb-3 input-container">
                            <div className="input-with-icon">
                                <FontAwesomeIcon className="input-icon" icon={faLock}></FontAwesomeIcon>
                                <input
                                    type="password"
                                    ref={passwordRef}
                                    className="form-control form-control-lg login-input"
                                    placeholder="Password"
                                />
                            </div>
                            {validationErrors.password && <span className="error">{validationErrors.password}</span>}
                        </div>
                        <div className="justify-content-center d-flex align-items-center">
                            {isLoading ? (
                                <ThreeDots
                                    height="80"
                                    width="80"
                                    radius="9"
                                    color="#f07b3f"
                                    ariaLabel="three-dots-loading"
                                    wrapperStyle={{}}
                                    wrapperClassName=""
                                    visible={true}
                                />
                            ) : (
                                <button type="submit" className="btn-login">
                                    Login
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                <div className="col-6 login-background d-flex justify-content-center align-items-center">
                    <div className="background-content">
                        <h1 className="background-text text-center">Think Tank</h1>
                        <p className="background-p text-center">
                            {' '}
                            Think Tank app boosts memory, sharpens focus, and enhances resilience amidst life's chaos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
