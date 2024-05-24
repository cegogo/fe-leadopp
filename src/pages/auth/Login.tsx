import { useEffect, useState } from 'react';
import { Grid, Stack, Typography, TextField, Button } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import imgGoogle from '../../assets/images/auth/google.svg';
import imgLogo from '../../assets/images/auth/img_logo.png';
import imgLogin from '../../assets/images/auth/img_login.png';
import { GoogleButton } from '../../styles/CssStyled';
import { fetchData } from '../../components/FetchData';
import { AuthUrl, LoginUrl } from '../../services/ApiUrls';
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const loginData = { email, password };
        const head = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        fetchData(LoginUrl, 'POST', JSON.stringify(loginData), head)
            .then((res) => {
                if (res.token) {
                    localStorage.setItem('Token', `Bearer ${res.token}`);
                    navigate('/app');
                } else {
                    setError('Invalid email or password');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setError('Something went wrong. Please try again.');
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
                        <Typography variant='h5' style={{ fontWeight: 'bolder' }}>Sign In</Typography>
                        <Grid item sx={{ mt: 4 }}>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    label='Email'
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label='Password'
                                    type='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                {error && (
                                    <Typography color='error' sx={{ mb: 2 }}>
                                        {error}
                                    </Typography>
                                )}
                                <Button type='submit' variant='contained' color='primary' fullWidth>
                                    Sign In
                                </Button>
                            </form>
                        </Grid>
                        <Grid item sx={{ mt: 4 }}>
                            <GoogleButton variant='outlined' onClick={() => login()} sx={{ fontSize: '12px', fontWeight: 500 }}>
                                Sign in with Google
                                <img src={imgGoogle} alt='google' style={{ width: '17px', marginLeft: '5px' }} />
                            </GoogleButton>
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
                    <Grid item >
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
