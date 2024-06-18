import { SERVER, ProfileUrl } from '../../services/ApiUrls';
import React, { useEffect, useState } from 'react';
import { Card, Switch, Typography, Avatar, CircularProgress, Box } from '@mui/material';
import { CustomAppBar } from '../../components/CustomAppBar';

interface UserDetails {
    email: string;
    id: string;
    is_active: boolean;
    profile_pic: string | null;
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
    created_by: string;
    updated_by: string;
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

export function UserProfile() {
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
        <Box sx={{ mt: '120px', p: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Box sx={{ width: '100%' }}>
            <Card sx={{ borderRadius: '7px' }}>
              <Box sx={{ p: '20px', borderBottom: '1px solid lightgray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a3353f0' }}>My profile</Typography>
              </Box>
              <Box sx={{ p: '20px', borderBottom: '1px solid lightgray', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Avatar src={userProfile.user_details.profile_pic || ''} alt="Profile Picture" sx={{ width: 120, height: 120, mr: '20px' }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>My name</Typography>
                  <Typography variant="body1" sx={{ color: 'gray', mb: '10px' }}>Job title</Typography>
                  <Box sx={{ backgroundColor: '#4f575b', color: 'white', px: '10px', py: '5px', borderRadius: '4px', display: 'inline-block' }}>
                    <Typography variant="body2">{userProfile.role || '---'}</Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ p: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Box sx={{ width: '32%' }}>
                  <Typography variant="body2" className="title2">Email</Typography>
                  <Typography variant="body1" className="title3">{userProfile.user_details.email || '---'}</Typography>
                </Box>
                <Box sx={{ width: '32%' }}>
                  <Typography variant="body2" className="title2">Is Active</Typography>
                  <Switch checked={userProfile.user_details.is_active} />
                </Box>
              </Box>
              <Box sx={{ p: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mt: '15px' }}>
                <Box sx={{ width: '32%' }}>
                  <Typography variant="body2" className="title2">Role</Typography>
                  <Typography variant="body1" sx={{ color: '#1E90FF', mt: '5%' }}>{userProfile.role || '---'}</Typography>
                </Box>
                <Box sx={{ width: '32%' }}>
                  <Typography variant="body2" className="title2">Mobile Number</Typography>
                  <Typography variant="body1" className="title3">{userProfile.phone || '---'}</Typography>
                </Box>
                <Box sx={{ width: '32%' }}>
                  <Typography variant="body2" className="title2">Marketing Access</Typography>
                  <Switch checked={userProfile.has_marketing_access} />
                </Box>
              </Box>
              <Box sx={{ p: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mt: '15px' }}>
                <Box sx={{ width: '34%' }}>
                  <Typography variant="body2" className="title2">Sales Access</Typography>
                  <Switch checked={userProfile.has_sales_access} />
                </Box>
                <Box sx={{ width: '32%' }}>
                  <Typography variant="body2" className="title2">Date of joining</Typography>
                  <Typography variant="body1" className="title3">{userProfile.date_of_joining || '---'}</Typography>
                </Box>
              </Box>
              <Box sx={{ mt: '15px' }}>
                <Box sx={{ p: '20px', borderBottom: '1px solid lightgray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a3353f0' }}>Address</Typography>
                </Box>
                <Box sx={{ p: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Box sx={{ width: '32%' }}>
                    <Typography variant="body2" className="title2">Address Line</Typography>
                    <Typography variant="body1" className="title3">{userProfile.address.address_line || '---'}</Typography>
                  </Box>
                  <Box sx={{ width: '32%' }}>
                    <Typography variant="body2" className="title2">Street</Typography>
                    <Typography variant="body1" className="title3">{userProfile.address.street || '---'}</Typography>
                  </Box>
                  <Box sx={{ width: '32%' }}>
                    <Typography variant="body2" className="title2">City</Typography>
                    <Typography variant="body1" className="title3">{userProfile.address.city || '---'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ p: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mt: '15px' }}>
                  <Box sx={{ width: '32%' }}>
                    <Typography variant="body2" className="title2">Postcode</Typography>
                    <Typography variant="body1" className="title3">{userProfile.address.postcode || '---'}</Typography>
                  </Box>
                  <Box sx={{ width: '32%' }}>
                    <Typography variant="body2" className="title2">State</Typography>
                    <Typography variant="body1" className="title3">{userProfile.address.state || '---'}</Typography>
                  </Box>
                  <Box sx={{ width: '32%' }}>
                    <Typography variant="body2" className="title2">Country</Typography>
                    <Typography variant="body1" className="title3">{userProfile.address.country || '---'}</Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
      );
    }