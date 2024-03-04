//Lib
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import jwtDecode from 'jwt-decode';
import { toast } from 'react-toastify';

//util
import * as loginService from '~/service/LoginService';

//style and source
import './Login.scss';
import images from '~/assets/images';

function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const userNameRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formSubmit = {
            userName: userNameRef.current.value,
            password: passwordRef.current.value,
            fcm: '',
        };

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
        <div className="h-100">
            <div className="row-1 justify-content-center d-flex align-items-center">
                <img className="row-1-image" alt="Think Tank Logo" src={images.logoText} />
            </div>
            <div className="row-2 row justify-content-center d-flex align-items-center">
                <h1 className="login-title justify-content-center d-flex align-items-center fw-bold">Login</h1>
                <form onSubmit={onSubmit} className="form-admin-login">
                    <div className="mb-3">
                        <label className="form-label fw-bold">Username</label>
                        <input
                            type="text"
                            ref={userNameRef}
                            className="form-control form-control-lg"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Password</label>
                        <input
                            type="password"
                            ref={passwordRef}
                            className="form-control form-control-lg"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="justify-content-center d-flex align-items-center">
                        <button type="submit" className="btn-login">
                            Login
                        </button>
                    </div>
                </form>
                {isLoading && (
                    <ThreeDots
                        height="80"
                        width="80"
                        radius="9"
                        color="rgba(105, 108, 255, 0.85)"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClassName=""
                        visible={true}
                    />
                )}
            </div>
            <div className="row-3 justify-content-center d-flex align-items-center">
                Copyright © 2024 ThinkTank. All rights reserved.
            </div>
        </div>
    );
}

export default LoginPage;
