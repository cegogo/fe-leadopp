import { SERVER, ProfileUrl } from '../../services/ApiUrls';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, CircularProgress, FormControl, FormGroup, InputLabel, Input, Typography } from '@mui/material';

interface EditUserProfileProps {
    onUpdate: () => void;
}

const EditUserProfile: React.FC<EditUserProfileProps> = ({ onUpdate }) => {
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        job_title: '',
        address_line: '',
        street: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
        mobile_number: '',
    });
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

                setFormData({
                    email: data.user_obj.user_details.email,
                    first_name: data.user_obj.user_details.first_name,
                    last_name: data.user_obj.user_details.last_name,
                    job_title: data.user_obj.user_details.job_title,
                    address_line: data.user_obj.address.address_line,
                    street: data.user_obj.address.street,
                    city: data.user_obj.address.city,
                    state: data.user_obj.address.state,
                    postcode: data.user_obj.address.postcode,
                    country: data.user_obj.address.country,
                    mobile_number: data.user_obj.phone,
                });
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
            
        };

        fetchUserProfile();
    }, [id]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('Token');
        const org = localStorage.getItem('org');

        if (!token || !org) {
            setError('Missing token or organization ID in localStorage');
            return;
        }

        try {
            const response = await fetch(`${SERVER}${ProfileUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'org': org,
                    'Authorization': token,
                },
                body: JSON.stringify(formData),
            });
            
            if (!response.ok) {
                throw new Error(`Error updating profile: ${response.statusText}`);
            }

            onUpdate();
        } catch (error: any) {
            setError(error.message);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box sx={{ mt: '60px' }}>
            <Typography variant="h4">Edit Profile</Typography>
            <form onSubmit={handleFormSubmit}>
                <FormGroup>
                    <FormControl>
                        <InputLabel>Email</InputLabel>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </FormControl>
                    <FormControl>
                        <InputLabel>First Name</InputLabel>
                        <Input
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        />
                    </FormControl>
                    <FormControl>
                        <InputLabel>Last Name</InputLabel>
                        <Input
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        />
                    </FormControl>
                    <FormControl>
                        <InputLabel>Job Title</InputLabel>
                        <Input
                            value={formData.job_title}
                            onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                        />
                    </FormControl>
                    {/* Agrega más campos según tus necesidades */}
                    <Button type="submit" variant="contained" color="primary">
                        Save Changes
                    </Button>
                </FormGroup>
            </form>
        </Box>
    );
};

export default EditUserProfile;
