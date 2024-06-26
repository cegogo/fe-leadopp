import { CustomToolbar } from '../../styles/CssStyled';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Button, CircularProgress, FormControl, FormGroup, InputLabel, Input, Typography, Select, MenuItem, Card, Stack, Accordion, AccordionSummary, Divider, AccordionDetails, TextField } from '@mui/material';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { SERVER, ProfileUrl } from '../../services/ApiUrls';
import { COUNTRIES } from '../../components/Data';

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
    const [countrySelectOpen, setCountrySelectOpen] = useState(false);

    const handleChange = (e: any) => {
        const { name, value, type } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: e.target.files?.[0] || null });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

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

    const submitForm = async () => {
        const token = localStorage.getItem('Token');
        const org = localStorage.getItem('org');

        if (!token || !org) {
            setError('Missing token or organization ID in localStorage');
            return;
        }

        try {
            const response = await fetch(`${SERVER}${ProfileUrl}/${id}/`, {
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

            onUpdate();
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitForm();
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box sx={{ mt: '60px' }}>
            <CustomToolbar sx={{ flexDirection: 'row-reverse' }}>
                <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        className="add-button"
                        component={Link}
                        to="/app/profile/"
                    >
                        Back
                    </Button>
                </Stack>
            </CustomToolbar>

            <Box sx={{ mt: '30px' }}>
                <form onSubmit={handleFormSubmit}>
                    <div style={{ padding: '10px' }}>
                        <div className="leadContainer">
                            <Accordion defaultExpanded style={{ width: '98%' }}>
                                <AccordionSummary
                                    expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                                >
                                    <Typography className="accordion-header">
                                        User Information
                                    </Typography>
                                </AccordionSummary>
                                <Divider className="divider" />
                                <AccordionDetails>
                                    <Box
                                        sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                                        component="form"
                                        noValidate
                                        autoComplete="off"
                                    >
                                        <div className="fieldContainer">
                                            <div className="fieldSubContainer">
                                                <div className="fieldTitle">First Name</div>
                                                <TextField
                                                    name="first_name"
                                                    value={formData.first_name}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size="small"
                                                />
                                            </div>
                                            <div className="fieldSubContainer">
                                                <div className="fieldTitle">Last Name</div>
                                                <TextField
                                                    name="last_name"
                                                    value={formData.last_name}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size="small"
                                                />
                                            </div>
                                        </div>
                                        <div className="fieldContainer">
                                            <div className="fieldSubContainer">
                                                <div className="fieldTitle">Mobile Number</div>
                                                <TextField
                                                    name="mobile_number"
                                                    value={formData.mobile_number}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size="small"
                                                />
                                            </div>
                                            <div className="fieldSubContainer">
                                                <div className="fieldTitle">Email</div>
                                                <TextField
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size="small"
                                                />
                                            </div>
                                        </div>
                                        <div className="fieldContainer">
                                            <div className="fieldSubContainer">
                                                <div className="fieldTitle">Job Title</div>
                                                <TextField
                                                    /*disabled*/
                                                    name="job_title"
                                                    value={formData.job_title}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size="small"
                                                />
                                            </div>
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        {/* Address Details */}
                        <div className="leadContainer">
                            <Accordion defaultExpanded style={{ width: '98%' }}>
                                <AccordionSummary
                                    expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}
                                >
                                    <Typography className="accordion-header">Address</Typography>
                                </AccordionSummary>
                                <Divider className="divider" />
                                <AccordionDetails>
                                    <Box
                                        sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                                        component="form"
                                        noValidate
                                        autoComplete="off"
                                    >
                                        <div className="fieldContainer">
                                            <div className="fieldSubContainer">
                                                <div className="fieldTitle">Address Line</div>
                                                <TextField
                                                    name="address_line"
                                                    value={formData.address_line}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size="small"
                                                />
                                            </div>
                                            <div className="fieldSubContainer">
                                                <div className="fieldTitle">Street</div>
                                                <TextField
                                                    name="street"
                                                    value={formData.street}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size="small"
                                                />
                                            </div>
                                        </div>
                                        <div className="fieldContainer">
                                            <div className="fieldSubContainer">
                                                <div className="fieldTitle">City</div>
                                                <TextField
                                                    required
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size="small"
                                                />
                                            </div>
                                            <div className="fieldSubContainer">
                                                <div className="fieldTitle">State</div>
                                                <TextField
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size="small"
                                                />
                                            </div>
                                        </div>
                                        <div className="fieldContainer">
                                            <div className="fieldSubContainer">
                                                <div className="fieldTitle">Postcode</div>
                                                <TextField
                                                    required
                                                    name="postcode"
                                                    value={formData.postcode}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size="small"
                                                />
                                            </div>
                                            <div className="fieldSubContainer">
                                                <div className="fieldTitle">Country</div>
                                                <FormControl sx={{ width: '70%' }}>
                                                    <Select
                                                        name="country"
                                                        value={formData.country}
                                                        open={countrySelectOpen}
                                                        onClick={() => setCountrySelectOpen(!countrySelectOpen)}
                                                        IconComponent={() => (
                                                            <div
                                                                onClick={() => setCountrySelectOpen(!countrySelectOpen)}
                                                                className="select-icon-background"
                                                            >
                                                                {countrySelectOpen ? <FiChevronUp className="select-icon" /> : <FiChevronDown className="select-icon" />}
                                                            </div>
                                                        )}
                                                        onChange={handleChange}
                                                        sx={{ height: '40px', }}
                                                    >
                                                        {COUNTRIES.map((option) => (
                                                            <MenuItem key={option.code} value={option.code}>
                                                                {option.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    </div>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}>
                        <Button type="submit" variant="contained" color="primary">
                            Save Changes
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default EditUserProfile;