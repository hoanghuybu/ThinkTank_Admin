import './Login.scss';
import images from '~/assets/images';

function LoginPage() {
    return (
        <div className="h-100">
            <div className="row-1 justify-content-center d-flex align-items-center">
                <img className="row-1-image" alt="Think Tank Logo" src={images.logoText} />
            </div>
            <div className="row-2 row justify-content-center d-flex align-items-center">
                <h1 className="login-title justify-content-center d-flex align-items-center fw-bold">Login</h1>
                <form className="w-50">
                    <div className="mb-3">
                        <label className="form-label fw-bold">Username</label>
                        <input type="text" className="form-control form-control-lg" placeholder="Enter your username" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Password</label>
                        <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="justify-content-center d-flex align-items-center">
                        <button type="button" className="btn-login">
                            Login
                        </button>
                    </div>
                </form>
            </div>
            <div className="row-3 justify-content-center d-flex align-items-center">
                Copyright © 2024 ThinkTank. All rights reserved.
            </div>
        </div>
    );
}

export default LoginPage;
