import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Card,
  Link,
  Button,
  Avatar,
  Divider,
  TextField,
  Box,
  AvatarGroup,
} from '@mui/material';
import {
  Fa500Px,
  FaAccusoft,
  FaAd,
  FaAddressCard,
  FaEnvelope,
  FaRegAddressCard,
  FaStar,
} from 'react-icons/fa';
import { CustomAppBar } from '../../components/CustomAppBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { AntSwitch } from '../../styles/CssStyled';
import { ContactUrl } from '../../services/ApiUrls';
import { fetchData } from '../../components/FetchData';

import { CATEGORY_OPTIONS } from './constants'; // Import category constants

// Function to get category color
const getCategoryColor = (category: any) => {
  const option = CATEGORY_OPTIONS.find(opt => opt.value === category);
  return option ? option.color : 'defaultColor';
};

// Function to get category label
const getCategoryLabel = (category: any) => {
  const option = CATEGORY_OPTIONS.find(opt => opt.value === category);
  return option ? option.label : '';
};

type response = {
  created_by: string;
  created_at: string;
  created_on_arrow: string;
  date_of_birth: string;
  department: string;
  description: string;
  do_not_call: boolean;
  facebook_url: string;
  first_name: string;
  lastname: string;
  id: string;
  is_active: boolean;
  language: string;
  last_name: string;
  linked_in_url: string;
  mobile_number: string;
  organization: string;
  primary_email: string;
  salutation: string;
  secondary_email: string;
  secondary_number: string;
  title: string;
  twitter_username: string;
  address_line: string;
  city: string;
  country: string;
  postcode: string;
  state: string;
  street: string;
  name: string;
  website: string;
  category: string;
};

export const formatDate = (dateString: any) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function ContactDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [contactDetails, setContactDetails] = useState<response | null>(null);
  const [addressDetails, setAddressDetails] = useState<response | null>(null);
  const [org, setOrg] = useState<response | null>(null);

  useEffect(() => {
    getContactDetail(state.contactId.id);
  }, [state.contactId.id]);

  const getContactDetail = (id: any) => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    };
    fetchData(`${ContactUrl}/${id}/`, 'GET', null as any, Header).then(
      (res) => {
        //console.log(res, 'res');
        if (!res.error) {
          setContactDetails(res?.contact_obj);
          setAddressDetails(res?.address_obj);
          //setOrg(res?.org);
          //console.log (contactDetails, 'contactDetails');
          //console.log (addressDetails, 'addressDetails');
        }
      }
    );
  };

  //   useEffect(() => {
  // navigate(-1)
  //     fetchData(`${ContactUrl}/${state.contactId}/`, 'GET', null as any, Header)
  //       .then((data) => {
  //         if (!data.error) {
  // setData(Object.assign({}, data, { cases: data.cases }));

  //           setContactDetails(data.contact_obj)
  //           setNewaddress(...contactDetails, {
  //             addreslane: data.contact_obj.address.address_line,
  //             city: data.contact_obj.address.city,
  //             state: data.contact_obj.address.state,
  //             postcode: data.contact_obj.address.postcode,
  //             country: data.contact_obj.address.country,
  //             street: data.contact_obj.address.street
  //           })
  //         }
  //       })
  //   }, [])

  const backbtnHandle = () => {
    navigate('/app/contacts');
  };

  const editHandle = () => {
    // navigate('/contacts/edit-contacts', { state: { value: contactDetails, address: newAddress } })
    navigate('/app/contacts/edit-contact', {
      state: {
        value: {
          salutation: contactDetails?.salutation,
          first_name: contactDetails?.first_name,
          last_name: contactDetails?.last_name,
          primary_email: contactDetails?.primary_email,
          secondary_email: contactDetails?.secondary_email,
          mobile_number: contactDetails?.mobile_number,
          secondary_number: contactDetails?.secondary_number,
          date_of_birth: contactDetails?.date_of_birth,
          organization: contactDetails?.organization,
          title: contactDetails?.title,
          language: contactDetails?.language,
          do_not_call: contactDetails?.do_not_call,
          website: contactDetails?.website,
          department: contactDetails?.department,
          address_line: addressDetails?.address_line,
          street: addressDetails?.street,
          city: addressDetails?.city,
          state: addressDetails?.state,
          country: addressDetails?.country,
          postcode: addressDetails?.postcode,
          description: contactDetails?.description,
          linked_in_url: contactDetails?.linked_in_url,
          facebook_url: contactDetails?.facebook_url,
          twitter_username: contactDetails?.twitter_username,
          category: contactDetails?.category,
        },
        id: state?.contactId?.id,
        countries: state?.countries,
      },
    });
  };

  const module = 'Contacts';
  const crntPage = 'Contact Detail';
  const backBtn = 'Back To Contacts';
  // console.log(state, 'contact');


  const websiteUrl = contactDetails?.website;
  const formattedUrl =
    websiteUrl &&
    (websiteUrl.startsWith('http://') || websiteUrl.startsWith('https://'))
      ? websiteUrl
      : `http://${websiteUrl}`;

  // Function to handle category change
  const handleCategoryChange = (contactId: any, newCategory: any) => {
    // API call to update category
    // Update contactList state with new category
  };


  return (
    <Box sx={{ mt: '60px' }}>
      <div>
        <CustomAppBar
          backbtnHandle={backbtnHandle}
          module={module}
          backBtn={backBtn}
          crntPage={crntPage}
          editHandle={editHandle}
        />
        <Box
          sx={{
            mt: '110px',
            p: '20px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ width: '65%' }}>
            <Card sx={{ borderRadius: '7px' }}>
              <div
                style={{
                  padding: '20px',
                  borderBottom: '1px solid lightgray',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '18px',
                    color: '#1a3353f0',
                  }}
                >
                  Contact Information
                </div>
                <div
                  style={{
                    color: 'gray',
                    fontSize: '16px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      marginRight: '15px',
                      textTransform: 'capitalize',
                    }}
                  >
                    created on &nbsp;
                    {formatDate(contactDetails?.created_at)}
                    {/* &nbsp;by &nbsp;&nbsp;
                    <span
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}
                    >
                      <Avatar
                        src="/broken-image.jpg"
                        style={{
                          height: '24px',
                          width: '24px',
                        }}
                      />
                    </span>{' '}
                    &nbsp;&nbsp;
                    {contactDetails?.first_name}
                    {contactDetails?.last_name} */}
                  </div>
                  <div>Last update&nbsp;&nbsp;{contactDetails?.created_on_arrow}</div>
                </div>
              </div>
              {/* <div
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ width: '32%' }}>
                  <div className="title2">Account Title</div>
                  <div
                    style={{
                      fontSize: '16px',
                      color: 'gray',
                      display: 'flex',
                      flexDirection: 'row',
                      marginTop: '5%',
                    }}
                  >
                    <div style={{ display: 'flex' }}>
                     <AvatarGroup
                                                total={2}
                                                max={3}
                                            >
                                                <Tooltip title={con.user.username}>
                                                    <Avatar alt={'sdf'}>
                                                    </Avatar>
                                                </Tooltip>
                                            </AvatarGroup>
                    </div>
                  </div>
                </div>
              </div> */}
              <div
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ width: '32%' }}>
                  <div className="title2">Salutation</div>
                  <div className="title3">
                    {contactDetails?.salutation || '----'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">First Name</div>
                  <div className="title3">
                    {contactDetails?.first_name || '----'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Last Name</div>
                  <div className="title3">
                    {contactDetails?.last_name || '----'}
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  marginTop: '15px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ width: '32%' }}>
                  <div className="title2">Organization Name</div>
                  {/* <div className="title3">{org?.name || '----'}</div> (original code)*/}

                  <div className="title3">{contactDetails?.organization || '----'}</div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Department</div>
                  {/* <div className="title3">{org?.name || '----'}</div> (original code)*/}
                  <div className="title3">{contactDetails?.department || '----'}</div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Title</div>
                  {/* <div className="title3">{org?.name || '----'}</div> (original code)*/}
                  <div className="title3">{contactDetails?.title || '----'}</div>

                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  marginTop: '15px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ width: '32%' }}>
                  <div className="title2">Email Address</div>
                  <div
                    style={{
                      fontSize: '16px',
                      color: '#1E90FF',
                      marginTop: '5%',
                    }}
                  >
                    <div>
                      {contactDetails?.primary_email ? (
                        <div>
                          <Link>{contactDetails?.primary_email}</Link>
                          <FaStar
                            style={{ fontSize: '16px', fill: 'yellow' }}
                          />
                        </div>
                      ) : (
                        '----'
                      )}
                      <br />
                      {contactDetails?.secondary_email ? (
                        <Link>{contactDetails?.secondary_email}</Link>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Mobile Number</div>
                  <div className="title3">
                    <div>
                      {contactDetails?.mobile_number ? (
                        <div>
                          {contactDetails?.mobile_number}
                          {
                            <FaStar
                              style={{ fontSize: '16px', fill: 'yellow' }}
                            />
                          }
                        </div>
                      ) : (
                        '----'
                      )}
                      <br />
                      {contactDetails?.secondary_number
                        ? contactDetails?.secondary_number
                        : ''}
                    </div>
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Website</div>
                  <div className="title3">
                    {websiteUrl ? (
                      <a
                        href={formattedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#1E90FF',
                          textDecoration: 'underline',
                          transition:
                            'color 0.3s ease-out, background-color 0.3s ease-out',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = 'darkblue')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = 'blue')
                        }
                      >
                        {websiteUrl}
                      </a>
                    ) : (
                      '----'
                    )}
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: '20px',
                  marginTop: '15px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                {/* <div style={{ width: '32%' }}>
                  <div className="title2">Department</div>
                  <div className="title3">
                    {contactDetails?.department || '----'}
                  </div>
                </div> */}
                <div style={{ width: '32%' }}>
                  <div className="title2">Language</div>
                  <div className="title3">
                    {contactDetails?.language || '----'}
                  </div>
                </div>
                <div style={{ width: '32%' }}>
                  <div className="title2">Do Not Call</div>
                  <div className="title3">
                    <AntSwitch
                      checked={contactDetails?.do_not_call}
                      inputProps={{ 'aria-label': 'ant design' }}
                    />
                  </div>
                </div>
              </div>
              {/* Address details */}
              <div style={{ marginTop: '15px' }}>
                <div
                  style={{
                    padding: '20px',
                    borderBottom: '1px solid lightgray',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '18px',
                      color: '#1a3353f0',
                    }}
                  >
                    Address Details
                  </div>
                </div>
                <div
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ width: '32%' }}>
                    <div className="title2">Address Line</div>
                    <div className="title3">
                      {addressDetails?.address_line || '----'}
                    </div>
                  </div>
                  <div style={{ width: '32%' }}>
                    <div className="title2">Street</div>
                    <div className="title3">
                      {addressDetails?.street || '----'}
                    </div>
                  </div>
                  <div style={{ width: '32%' }}>
                    <div className="title2">City</div>
                    <div className="title3">
                      {addressDetails?.city || '----'}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    padding: '20px',
                    marginTop: '15px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ width: '32%' }}>
                    <div className="title2">Postcode</div>
                    <div className="title3">
                      {addressDetails?.postcode || '----'}
                    </div>
                  </div>
                  <div style={{ width: '32%' }}>
                    <div className="title2">State</div>
                    <div className="title3">
                      {addressDetails?.state || '----'}
                    </div>
                  </div>
                  <div style={{ width: '32%' }}>
                    <div className="title2">Country</div>
                    <div className="title3">
                      {contactDetails?.country || '----'}
                    </div>
                  </div>
                </div>
              </div>
              {/* Description */}
              <div style={{ marginTop: '15px' }}>
                <div
                  style={{
                    padding: '20px',
                    borderBottom: '1px solid lightgray',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '18px',
                      color: '#1a3353f0',
                    }}
                  >
                    Description
                  </div>
                </div>
                <Box sx={{ p: '15px' }}>
                  {contactDetails?.description ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: contactDetails?.description,
                      }}
                    />
                  ) : (
                    '---'
                  )}
                </Box>
              </div>
            </Card>
          </Box>
          <Box sx={{ width: '34%' }}>
            <Card sx={{ borderRadius: '7px', p: '20px', mb: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '16px',
                      color: '#1a3353f0',
                      marginBottom: '15px',
                    }}
                  >
                    Category
                  </div>
                </div>
              </div>
              <Button
                style={{ backgroundColor: getCategoryColor(contactDetails?.category), color: 'white' }}
                onClick={() => handleCategoryChange(contactDetails?.id, contactDetails?.category)}
              >
                {getCategoryLabel(contactDetails?.category)}
              </Button>
            </Card>
            
            <Card sx={{ borderRadius: '7px', p: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#1a3353f0',
                  }}
                >
                  Social
                </div>
                <div
                  style={{
                    color: '#3E79F7',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}
                >
                  {/* Add Social #1E90FF */}
                  <Button
                    type="submit"
                    variant="text"
                    size="small"
                    startIcon={<FaEnvelope style={{ fill: '#3E79F7' }} />}
                    style={{
                      textTransform: 'capitalize',
                      fontWeight: 600,
                      fontSize: '16px',
                    }}
                  >
                    Add Socials
                  </Button>
                </div>
              </div>
              <div style={{ fontSize: '16px', marginTop: '15px' }}>
                LinkedIn URL
              </div>
              <div
                style={{
                  paddingBottom: '10px',
                  width: '80%',
                  marginBottom: '10px',
                }}
              >
                <TextField
                  variant="outlined"
                  size="small"
                  value={contactDetails?.linked_in_url || '----'}
                  sx={{ height: '40px', width: '100%', mt: 1 }}
                />
              </div>
              <div style={{ fontSize: '16px' }}>Facebook URL</div>
              <div
                style={{
                  paddingBottom: '10px',
                  width: '80%',
                  marginBottom: '10px',
                }}
              >
                <TextField
                  variant="outlined"
                  size="small"
                  value={contactDetails?.facebook_url || '----'}
                  sx={{ height: '40px', width: '100%', mt: 1 }}
                />
              </div>
              <div style={{ fontSize: '16px', marginTop: '15px' }}>
                Twitter URL
              </div>
              <div
                style={{
                  paddingBottom: '10px',
                  width: '80%',
                  marginBottom: '10px',
                }}
              >
                <TextField
                  variant="outlined"
                  size="small"
                  value={contactDetails?.twitter_username || '----'}
                  sx={{ height: '40px', width: '100%', mt: 1 }}
                />
              </div>
            </Card>
          </Box>
        </Box>
      </div>
    </Box>
  );
}