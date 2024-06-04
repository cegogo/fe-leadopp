import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    TextField,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
    Box,
    Tooltip,
    Select,
    MenuItem,
    FormControl,
    FormHelperText,
    Divider
} from '@mui/material';
import { CustomAppBar } from '../../components/CustomAppBar';
import { fetchData } from '../../components/FetchData';
import { UserUrl } from '../../services/ApiUrls';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { RequiredTextField } from '../../styles/CssStyled';
import '../../styles/style.css';

type FormErrors = Record<string, string[] | undefined>;

interface FormData {
    email: string;
    role: string;
    phone: string;
    alternate_phone: string;
    address_line: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
}

export function EditProfile() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [reset, setReset] = useState(false);
    const [error, setError] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState<FormData>({
        email: '',
        role: 'ADMIN',
        phone: '',
        alternate_phone: '',
        address_line: '',
        street: '',
        city: '',
        state: '',
        postcode: '',
        country: ''
    });

    useEffect(() => {
        if (state?.value) {
            setFormData(state.value);
        }
    }, [state?.id]);

    useEffect(() => {
        if (reset) {
            setFormData(state?.value);
            setReset(false);
        }
    }, [reset]);

    const handleChange = (e: any) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files?.[0] || null : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitForm();
    };

    const submitForm = () => {
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
        };

        fetchData(`${UserUrl}/${state?.id}/`, 'PUT', JSON.stringify(formData), headers)
            .then((res: any) => {
                if (!res.error) {
                    resetForm();
                    navigate('/app/users');
                } else {
                    setError(true);
                    setErrors(res?.errors || {});
                }
            })
            .catch(() => {
                setError(true);
            });
    };

    const resetForm = () => {
        setFormData({
            email: '',
            role: 'ADMIN',
            phone: '',
            alternate_phone: '',
            address_line: '',
            street: '',
            city: '',
            state: '',
            postcode: '',
            country: ''
        });
        setErrors({});
    };

    const backBtnHandle = () => {
        navigate(state?.edit ? '/app/users' : '/app/users/user-details', { state: { userId: state?.id, detail: true } });
    };

    const inputStyles = { display: 'none' };

    return (
        <Box sx={{ mt: '60px' }}>
            <CustomAppBar 
                backbtnHandle={backBtnHandle} 
                module='Users' 
                backBtn={state?.edit ? 'Back To Users' : 'Back To UserDetails'} 
                crntPage='Edit User' 
                onCancel={() => setReset(true)} 
                onSubmit={handleSubmit} 
            />
            <Box sx={{ mt: '120px' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ padding: '10px' }}>
                        <AccordionSection 
                            title="User Information" 
                            fields={[
                                { label: "Email", name: "email", type: "text", required: true },
                                { label: "Role", name: "role", type: "select", options: ['ADMIN', 'USER'], required: true },
                                { label: "Phone Number", name: "phone", type: "text", required: true, tooltip: "Number must start with +91" },
                                { label: "Alternate Phone", name: "alternate_phone", type: "text", required: true, tooltip: "Number must start with +91" }
                            ]} 
                            formData={formData} 
                            handleChange={handleChange} 
                            errors={errors} 
                        />
                        <AccordionSection 
                            title="Address" 
                            fields={[
                                { label: "Address Line", name: "address_line", type: "text", required: true },
                                { label: "Street", name: "street", type: "text", required: true },
                                { label: "City", name: "city", type: "text", required: true },
                                { label: "State", name: "state", type: "text", required: true },
                                { label: "Postcode", name: "postcode", type: "text", required: true },
                                { label: "Country", name: "country", type: "select", options: state?.countries || [], required: true }
                            ]} 
                            formData={formData} 
                            handleChange={handleChange} 
                            errors={errors} 
                        />
                    </div>
                </form>
            </Box>
        </Box>
    );
}

interface AccordionSectionProps {
    title: string;
    fields: {
        label: string;
        name: string;
        type: 'text' | 'select';
        options?: string[];
        required?: boolean;
        tooltip?: string;
    }[];
    formData: FormData;
    handleChange: (e: any) => void;
    errors: FormErrors;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, fields, formData, handleChange, errors }) => (
    <div className='leadContainer'>
        <Accordion defaultExpanded style={{ width: '98%' }}>
            <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                <Typography className='accordion-header'>{title}</Typography>
            </AccordionSummary>
            <Divider className='divider' />
            <AccordionDetails>
                <Box sx={{ width: '98%', color: '#1A3353', mb: 1 }} component='form' noValidate autoComplete='off'>
                    {fields.map(field => (
                        <div className='fieldContainer' key={field.name}>
                            <div className='fieldSubContainer'>
                                <div className='fieldTitle'>{field.label}</div>
                                {field.type === 'text' && (
                                    <Tooltip title={field.tooltip || ''}>
                                        <RequiredTextField
                                            name={field.name}
                                            value={formData[field.name as keyof FormData] || ''}
                                            onChange={handleChange}
                                            required={field.required}
                                            style={{ width: '70%' }}
                                            size='small'
                                            error={!!errors?.[field.name]?.[0]}
                                            helperText={errors?.[field.name]?.[0] || ''}
                                        />
                                    </Tooltip>
                                )}
                                {field.type === 'select' && (
                                    <FormControl sx={{ width: '70%' }}>
                                        <Select
                                            name={field.name}
                                            value={formData[field.name as keyof FormData] || ''}
                                            onChange={handleChange}
                                            error={!!errors?.[field.name]?.[0]}
                                            displayEmpty
                                        >
                                            {field.options && field.options.map(option => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors?.[field.name]?.[0] || ''}</FormHelperText>
                                    </FormControl>
                                )}
                            </div>
                        </div>
                    ))}
                </Box>
            </AccordionDetails>
        </Accordion>
    </div>
);
