import { SERVER, ProfileUrl } from '../../services/ApiUrls';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, CircularProgress, FormControl, FormGroup, InputLabel, Input, Typography } from '@mui/material';

interface EditUserProfileProps {
    onUpdate: () => void;
}

const EditUserProfile: React.FC<EditUserProfileProps> = ({ onUpdate }) => {
    const { id } = useParams();
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
        mobile_number:'',
    });
    const [loading, setLoading] = useState(true); // Estado para manejar la carga inicial
    const [error, setError] = useState<string | null>(null); // Estado para manejar errores

    useEffect(() => {
        // Función para cargar los datos del usuario basado en 'id'
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('Token'); // Obtén el token del localStorage
            const org = localStorage.getItem('org'); // Obtén el org del localStorage

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
                    email: data.user_details.email,
                    first_name: data.user_details.first_name,
                    last_name: data.user_details.last_name,
                    job_title: data.user_details.job_title,
                    address_line: data.address.address_line,
                    street: data.address.street,
                    city: data.address.city,
                    state: data.address.state,
                    postcode: data.address.postcode,
                    country: data.address.country,
                    mobile_number: data.phone,
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

        if (!token) {
            setError('Missing token in localStorage');
            return;
        }

        try {
            const response = await fetch(`${SERVER}${SERVER}${ProfileUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Error updating profile: ${response.statusText}`);
            }

            // Lógica adicional después de la actualización exitosa (como navegar a otra página)
            onUpdate(); // Llama a la función onUpdate para indicar que se ha actualizado el perfil correctamente
        } catch (error: any) {
            setError(error.message);
        }
    };

    if (loading) {
        return <CircularProgress />; // Muestra un indicador de carga mientras se obtienen los datos del usuario
    }

    if (error) {
        return <Typography color="error">{error}</Typography>; // Muestra un mensaje de error si ocurre algún problema
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