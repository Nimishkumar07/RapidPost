import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const location = useLocation();
    const [isSignup, setIsSignup] = useState(location.pathname === '/signup');

    // Login State
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Signup State
    const [signupData, setSignupData] = useState({
        name: '',
        username: '',
        email: '',
        password: ''
    });

    // OTP State
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState('');

    const [error, setError] = useState('');
    const { login, signup, verifyOTP, googleLogin } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();



    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(loginUsername, loginPassword);
            showToast("Welcome back!", "success");
            navigate('/blogs');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (!showOTP) {
                await signup(signupData);
                showToast("OTP sent to your email!", "success");
                setShowOTP(true);
            } else {
                await verifyOTP(signupData.email, otp);
                showToast("Welcome to RapidPost!", "success");
                navigate('/blogs');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Signup failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            showToast("Google Login successful!", "success");
            navigate('/blogs');
        } catch (err) {
            setError(err.response?.data?.message || 'Google Login failed');
        }
    };

    const handleSignupChange = (e) => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value });
    };

    return (
        <div className="wrapper">
            <div className="form-container" style={{height: showOTP ? 'auto' : ''}}>
                {error && <div className="alert alert-danger">{error}</div>}

                <input
                    id="flip-toggle"
                    type="checkbox"
                    className="toggle"
                    checked={isSignup}
                    onChange={(e) => {
                        setIsSignup(e.target.checked);
                        // Optional: update URL
                        navigate(e.target.checked ? '/signup' : '/login', { replace: true });
                    }}
                />

                <label htmlFor="flip-toggle" className="switch">
                    <span className="slider"></span>
                    <span className="card-side"></span>
                </label>

                <div className="flip-card__inner">
                    <div className="flip-card__front">
                        <div className="title">Log in</div>
                        <form className="flip-card__form" onSubmit={handleLoginSubmit}>
                            <input
                                className="flip-card__input"
                                name="username"
                                placeholder="Username"
                                type="text"
                                value={loginUsername}
                                onChange={(e) => setLoginUsername(e.target.value)}
                                required
                            />
                            <input
                                className="flip-card__input"
                                name="password"
                                placeholder="Password"
                                type="password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                            />
                            <button className="flip-card__btn">Let's go!</button>
                            <div className="mt-3 d-flex justify-content-center">
                                <GoogleLogin 
                                    onSuccess={handleGoogleSuccess} 
                                    onError={() => setError('Google Login Failed')}
                                />
                            </div>
                        </form>
                    </div>
                    <div className="flip-card__back mb-4">
                        <div className="title" style={{marginBottom: "5px"}}>Sign up</div>
                        <form className="flip-card__form" onSubmit={handleSignupSubmit}>
                            {!showOTP ? (
                                <>
                                    <input
                                        className="flip-card__input"
                                        placeholder="Full Name"
                                        name="name"
                                        type="text"
                                        value={signupData.name}
                                        onChange={handleSignupChange}
                                        required
                                    />
                                    <input
                                        className="flip-card__input"
                                        placeholder="Username"
                                        name="username"
                                        type="text"
                                        value={signupData.username}
                                        onChange={handleSignupChange}
                                        required
                                    />
                                    <input
                                        className="flip-card__input"
                                        name="email"
                                        placeholder="Email"
                                        type="email"
                                        value={signupData.email}
                                        onChange={handleSignupChange}
                                        required
                                    />
                                    <input
                                        className="flip-card__input"
                                        name="password"
                                        placeholder="Password"
                                        type="password"
                                        value={signupData.password}
                                        onChange={handleSignupChange}
                                        required
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="text-center text-muted mb-3" style={{fontSize: "13px", color:"#ccc"}}>
                                        Enter the 6-digit OTP sent to {signupData.email}
                                    </div>
                                    <input
                                        className="flip-card__input"
                                        name="otp"
                                        placeholder="Enter OTP"
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </>
                            )}
                            <button className="flip-card__btn">{showOTP ? 'Verify!' : 'Confirm!'}</button>
                            {!showOTP && (
                                <div className="mt-3 d-flex justify-content-center">
                                    <GoogleLogin 
                                        onSuccess={handleGoogleSuccess} 
                                        onError={() => setError('Google Signup Failed')}
                                    />
                                </div>
                            )}
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
