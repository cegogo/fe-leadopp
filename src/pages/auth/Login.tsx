import { useEffect, useState } from 'react';
import { Grid, Stack, Typography, TextField, Button } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import imgGoogle from '../../assets/images/auth/google.svg';
import imgLogo from '../../assets/images/auth/img_logo.png';
import imgLogin from '../../assets/images/auth/img_login.png';
import { GoogleButton } from '../../styles/CssStyled';
import { fetchData } from '../../components/FetchData';
import { AuthUrl, LoginUrl, RegisterUrl} from '../../services/ApiUrls';
import '../../styles/style.css';

declare global {
    interface Window {
        google: any;
        gapi: any;
    }
}

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signUpError, setSignUpError] = useState('');

    useEffect(() => {
        if (localStorage.getItem('Token')) {
            navigate('/app');
        }
    }, [token, navigate]);

    const login = useGoogleLogin({
        onSuccess: tokenResponse => {
            const apiToken = { token: tokenResponse.access_token };
            const head = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            fetchData(`${AuthUrl}/`, 'POST', JSON.stringify(apiToken), head)
                .then((res) => {
                    localStorage.setItem('Token', `Bearer ${res.access_token}`);
                    setToken(true);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        },
    });

    const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loginData = { email, password };
    const head = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    fetchData(LoginUrl, 'POST', JSON.stringify(loginData), head)
        .then((res) => {
            console.log('Response:', res);
            if (res.access_token) {
                localStorage.setItem('Token', `Bearer ${res.access_token}`);
                navigate('/app');
            } else {
                console.log('Login failed:', res);
                setError('Invalid email or password');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            setError('Something went wrong. Please try again.');
        });
};


const handleSignUpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const signUpData = { email: signUpEmail, password: signUpPassword };
    const head = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    fetchData(RegisterUrl, 'POST', JSON.stringify(signUpData), head)
        .then((res) => {
            console.log('Sign-up response:', res);
            if (res.email && res.user_id) {
                // Optionally, log the user in automatically or navigate to a different page
                // For example, you might want to log the user in automatically by making a login request
                const loginData = { email: signUpEmail, password: signUpPassword };
                fetchData(LoginUrl, 'POST', JSON.stringify(loginData), head)
                    .then((loginRes) => {
                        if (loginRes.access_token) {
                            localStorage.setItem('Token', `Bearer ${loginRes.access_token}`);
                            navigate('/app');
                        } else {
                            setSignUpError('Sign-up successful, but auto-login failed. Please try to log in manually.');
                        }
                    })
                    .catch((error) => {
                        console.error('Auto-login error:', error);
                        setSignUpError('Sign-up successful, but auto-login failed. Please try to log in manually.');
                    });
            } else {
                setSignUpError('Error during sign-up. Please try again.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            setSignUpError('Something went wrong. Please try again.');
        });
};

    return (
        <div>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent='center'
                alignItems='center'
                sx={{ height: '100%', width: '100%', position: 'fixed' }}
            >
                <Grid
                    container
                    item
                    xs={8}
                    direction='column'
                    justifyContent='space-evenly'
                    alignItems='center'
                    sx={{ height: '100%', overflow: 'hidden' }}
                >
                    <Grid item>
                        <Grid sx={{ mt: 2 }}>
                            <img src={imgLogo} alt='register_logo' className='register-logo' />
                        </Grid>
                        <Typography variant='h5' style={{ fontWeight: 'bolder' }}>
                            {isSignUp ? 'Sign Up' : 'Sign In'}
                        </Typography>
                        <Grid item sx={{ mt: 4 }}>
                            <form onSubmit={isSignUp ? handleSignUpSubmit : handleLoginSubmit}>
                                <TextField
                                    label='Email'
                                    type='email'
                                    value={isSignUp ? signUpEmail : email}
                                    onChange={(e) => isSignUp ? setSignUpEmail(e.target.value) : setEmail(e.target.value)}
                                    required
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label='Password'
                                    type='password'
                                    value={isSignUp ? signUpPassword : password}
                                    onChange={(e) => isSignUp ? setSignUpPassword(e.target.value) : setPassword(e.target.value)}
                                    required
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                {(isSignUp ? signUpError : error) && (
                                    <Typography color='error' sx={{ mb: 2 }}>
                                        {isSignUp ? signUpError : error}
                                    </Typography>
                                )}
                                <Button type='submit' variant='contained' color='primary' fullWidth>
                                    {isSignUp ? 'Sign Up' : 'Sign In'}
                                </Button>
                            </form>
                        </Grid>
                        <Grid item sx={{ mt: 4 }}>
                            {!isSignUp && (
                                <GoogleButton variant='outlined' onClick={() => login()} sx={{ fontSize: '12px', fontWeight: 500 }}>
                                    Sign in with Google
                                    <img src={imgGoogle} alt='google' style={{ width: '17px', marginLeft: '5px' }} />
                                </GoogleButton>
                            )}
                        </Grid>
                        <Grid item sx={{ mt: 4 }}>
                            <Button variant='text' onClick={() => setIsSignUp(!isSignUp)}>
                                {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    xs={8}
                    direction='column'
                    justifyContent='center'
                    alignItems='center'
                    className='rightBg'
                    sx={{ height: '100%', overflow: 'hidden', justifyItems: 'center' }}
                >
                    <Grid item>
                        <Stack sx={{ alignItems: 'center' }}>
                            <h3>Welcome to BottleCRM</h3>
                            <p> Free and OpenSource CRM for small and medium businesses.</p>
                            <img
                                src={imgLogin}
                                alt='register_ad_image'
                                className='register-ad-image'
                            />
                            <footer className='register-footer'>
                                bottlecrm.com
                            </footer>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
        </div>
    );
}
