import { SERVER, ProfileUrl } from '../../services/ApiUrls';
import React, { useEffect, useState } from 'react';
import { Card, Button, Typography, Avatar, CircularProgress, Box, Stack } from '@mui/material';

interface UserDetails {
    email: string;
    is_active: boolean;
    profile_pic: string | null;
    first_name: string;
    last_name: string;
    job_title: string;
}

interface Address {
    id: string;
    created_at: string;
    updated_at: string;
    address_line: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
}

interface UserObj {
    id: string;
    user_details: UserDetails;
    role: string;
    address: Address;
    has_marketing_access: boolean;
    has_sales_access: boolean;
    phone: string;
    date_of_joining: string | null;
    is_active: boolean;
}

export function UserTeams() {
    const [userProfile, setUserProfile] = useState<UserObj | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('Token');
            const org = localStorage.getItem('org');

            if (!token || !org) {
                setError('Missing token or organization ID in localStorage');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${SERVER}${ProfileUrl}/`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'org': org,
                        'Authorization': token,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error fetching profile: ${response.statusText}`);
                }

                const data = await response.json();
                setUserProfile(data.user_obj);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!userProfile) {
        return <Typography>No user profile found</Typography>;
    }

    return (




<Card sx={{ mt: '20px', ml: '20px', p: '20px', borderRadius: '7px', mb: '20px', backgroundColor: '#fff', width: '66%' }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '18px', color: '#1a3353f0', mb: '10px' }}>My teams</Typography>
                            <Box sx={{ mb: '20px', borderBottom: '1px solid lightgray', display: 'flex', flexDirection: 'row', alignItems: 'center' }}></Box>
                            <Box>
                                <Typography sx={{ mb: '10px' }} className="title2">Team 1</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', mb: '20px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                                        <Avatar sx={{ width: 24, height: 24, mr: '5px' }} />
                                        <Typography className="title3">Team member</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                                        <Avatar sx={{ width: 24, height: 24, mr: '5px' }} />
                                        <Typography className="title3">Team member</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                                        <Avatar sx={{ width: 24, height: 24, mr: '5px' }} />
                                        <Typography className="title3">Team member</Typography>
                                    </Box>
                                </Box>
                                <Typography sx={{ mb: '10px' }} className="title2">Team 2</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                                        <Avatar sx={{ width: 24, height: 24, mr: '5px' }} />
                                        <Typography className="title3">Team member</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                                        <Avatar sx={{ width: 24, height: 24, mr: '5px' }} />
                                        <Typography className="title3">Team member</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                                        <Avatar sx={{ width: 24, height: 24, mr: '5px' }} />
                                        <Typography className="title3">Team member</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
    );
}