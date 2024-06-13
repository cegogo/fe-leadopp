import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  TextField,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
  Box,
  TextareaAutosize,
  MenuItem,
  Tooltip,
  Button,
  Input,
  Avatar,
  IconButton,
  Stack,
  Divider,
  Select,
  FormControl,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';
import { UserUrl } from '../../services/ApiUrls';
import { fetchData } from '../../components/FetchData';
import { CustomAppBar } from '../../components/CustomAppBar';
import { FaArrowDown, FaTimes, FaUpload } from 'react-icons/fa';
import { AntSwitch, RequiredTextField } from '../../styles/CssStyled';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp';
import '../../styles/style.css';

type FormErrors = {
  email?: string[];
  role?: string[];
  phone?: string[];
  alternate_phone?: string[];
  address_line?: string[];
  street?: string[];
  city?: string[];
  state?: string[];
  postcode?: string[];
  country?: string[];
  // profile_pic?: string[];
  // has_sales_access?: string[];
  // has_marketing_access?: string[];
  // is_organization_admin?: string[];
};

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
  // profile_pic: string | null,
  // has_sales_access: boolean,
  // has_marketing_access: boolean,
  // is_organization_admin: boolean
}

export function EditProfile() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [reset, setReset] = useState(false);
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [profileErrors, setProfileErrors] = useState<FormErrors>({});
  const [userErrors, setUserErrors] = useState<FormErrors>({});
  const [roleSelectOpen, setRoleSelectOpen] = useState(false);
  const [countrySelectOpen, setCountrySelectOpen] = useState(false);
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
    country: '',
    // profile_pic: null,
    // has_sales_access: false,
    // has_marketing_access: false,
    // is_organization_admin: false
  });

  useEffect(() => {
    if (state?.value) {
      setFormData(state.value);
    }
  }, [state?.id, state?.value]);

  useEffect(() => {
    if (reset) {
      if (state?.value) {
        setFormData(state.value);
      }
      setReset(false);
    }
  }, [reset, state?.value]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files, type, checked } = e.target as HTMLInputElement;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files?.[0] || null });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleCountryChange = (event: SelectChangeEvent<string>) => {
    setFormData({ ...formData, country: event.target.value });
  };

  const backbtnHandle = () => {
    if (state?.edit) {
      navigate('/app/users');
    } else {
      navigate('/app/users/user-details', {
        state: { userId: state?.id, detail: true },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state?.id) { // Check if state?.id is defined
        submitForm();
      } else {
        // Handle the case where state?.id is undefined
        console.error("User ID is undefined.");
      }
    };

  const submitForm = () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    };

    const data = {
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
      alternate_phone: formData.alternate_phone,
      address_line: formData.address_line,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      postcode: formData.postcode,
      country: formData.country,
      // profile_pic: formData.profile_pic,
      // has_sales_access: formData.has_sales_access,
      // has_marketing_access: formData.has_marketing_access,
      // is_organization_admin: formData.is_organization_admin
    };

    fetchData(`${UserUrl}/${state?.id}/`, 'PUT', JSON.stringify(data), Header)
      .then((res: any) => {
        if (!res.error) {
          resetForm();
          navigate('/app/users');
        } else {
          setError(true);
          setProfileErrors(
            res?.errors?.profile_errors || res?.profile_errors[0]
          );
          setUserErrors(res?.errors?.user_errors || res?.user_errors[0]);
        }
      })
      .catch(() => {});
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
      country: '',
      // profile_pic: null,
      // has_sales_access: false,
      // has_marketing_access: false,
      // is_organization_admin: false
    });
    setProfileErrors({});
    setUserErrors({});
  };

  const onCancel = () => {
    setReset(true);
  };

  const module = 'Users';
  const crntPage = 'Edit User';
  const backBtn = state?.edit ? 'Back To Users' : 'Back To UserDetails';

  const inputStyles = {
    display: 'none',
  };

  return (
    <Box sx={{ mt: '60px' }}>
      <CustomAppBar
        backbtnHandle={backbtnHandle}
        module={module}
        backBtn={backBtn}
        crntPage={crntPage}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
      <Box sx={{ mt: '120px' }}>
        <form onSubmit={handleSubmit}>
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
                        <div className="fieldTitle">Email</div>
                        <RequiredTextField
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.email?.[0] ||
                            !!userErrors?.email?.[0]
                          }
                          helperText={
                            profileErrors?.email?.[0] ||
                            userErrors?.email?.[0] ||
                            ''
                          }
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Role</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name="role"
                            value={formData.role}
                            open={roleSelectOpen}
                            onClick={() => setRoleSelectOpen(!roleSelectOpen)}
                            IconComponent={() => (
                              <div
                                onClick={() =>
                                  setRoleSelectOpen(!roleSelectOpen)
                                }
                                className="dropdownIcon"
                              >
                                {!roleSelectOpen ? (
                                  <FiChevronDown style={{ fontSize: '25px' }} />
                                ) : (
                                  <FiChevronUp style={{ fontSize: '25px' }} />
                                )}
                              </div>
                            )}
                            size="small"
                            onChange={handleSelectChange}
                            error={
                              !!profileErrors?.role?.[0] ||
                              !!userErrors?.role?.[0]
                            }
                          >
                            <MenuItem value={'ADMIN'}>Admin</MenuItem>
                            <MenuItem value={'USER'}>User</MenuItem>
                          </Select>
                          <FormHelperText error>
                            {profileErrors?.role?.[0] ||
                              userErrors?.role?.[0] ||
                              ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Phone Number</div>
                        <Tooltip title="Country code required. e.g:+31">
                          <RequiredTextField
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            style={{ width: '70%' }}
                            size="small"
                            error={
                              !!profileErrors?.phone?.[0] ||
                              !!userErrors?.phone?.[0]
                            }
                            helperText={
                              profileErrors?.phone?.[0] ||
                              userErrors?.phone?.[0] ||
                              ''
                            }
                          />
                        </Tooltip>
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Alternate Phone</div>
                        <Tooltip title="Country code required. e.g:+31">
                          <RequiredTextField
                            required
                            name="alternate_phone"
                            value={formData.alternate_phone}
                            onChange={handleChange}
                            style={{ width: '70%' }}
                            size="small"
                            error={
                              !!profileErrors?.alternate_phone?.[0] ||
                              !!userErrors?.alternate_phone?.[0]
                            }
                            helperText={
                              profileErrors?.alternate_phone?.[0] ||
                              userErrors?.alternate_phone?.[0] ||
                              ''
                            }
                          />
                        </Tooltip>
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
                          required
                          name="address_line"
                          value={formData.address_line}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.address_line?.[0] ||
                            !!userErrors?.address_line?.[0]
                          }
                          helperText={
                            profileErrors?.address_line?.[0] ||
                            userErrors?.address_line?.[0] ||
                            ''
                          }
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Street</div>
                        <TextField
                          required
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.street?.[0] ||
                            !!userErrors?.street?.[0]
                          }
                          helperText={
                            profileErrors?.street?.[0] ||
                            userErrors?.street?.[0] ||
                            ''
                          }
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">City</div>
                        <TextField
                          required
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.city?.[0] ||
                            !!userErrors?.city?.[0]
                          }
                          helperText={
                            profileErrors?.city?.[0] ||
                            userErrors?.city?.[0] ||
                            ''
                          }
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">State</div>
                        <TextField
                          required
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.state?.[0] ||
                            !!userErrors?.state?.[0]
                          }
                          helperText={
                            profileErrors?.state?.[0] ||
                            userErrors?.state?.[0] ||
                            ''
                          }
                        />
                      </div>
                    </div>
                    <div className="fieldContainer2">
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">postcode</div>
                        <TextField
                          required
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size="small"
                          error={
                            !!profileErrors?.postcode?.[0] ||
                            !!userErrors?.postcode?.[0]
                          }
                          helperText={
                            profileErrors?.postcode?.[0] ||
                            userErrors?.postcode?.[0] ||
                            ''
                          }
                        />
                      </div>
                      <div className="fieldSubContainer">
                        <div className="fieldTitle">Country</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name="country"
                            value={formData.country}
                            open={countrySelectOpen}
                            onClick={() =>
                              setCountrySelectOpen(!countrySelectOpen)
                            }
                            IconComponent={() => (
                              <div
                                onClick={() =>
                                  setCountrySelectOpen(!countrySelectOpen)
                                }
                                className="select-icon-background"
                              >
                                {countrySelectOpen ? (
                                  <FiChevronUp className="select-icon" />
                                ) : (
                                  <FiChevronDown className="select-icon" />
                                )}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleCountryChange}
                            error={!!profileErrors?.country?.[0]}
                          >
                            {state?.countries?.length &&
                              state?.countries.map((option: any) => (
                                <MenuItem key={option[0]} value={option[0]}>
                                  {option[1]}
                                </MenuItem>
                              ))}
                          </Select>
                          <FormHelperText>
                            {profileErrors?.country?.[0]
                              ? profileErrors?.country?.[0]
                              : ''}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </form>
      </Box>
    </Box>
  );
}
