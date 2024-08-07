import React, { SyntheticEvent, useState, useEffect } from 'react';
import { Avatar, Box, Button, Tabs } from '@mui/material';
import Leads from '../leads/Leads';
import {
  LeadUrl,
  OpportunityUrl,
  MeetingUrl,
  QualifiedUrl,
  NegotiationUrl,
  WonUrl,
  ProfileUrl,
  SERVER,
} from '../../services/ApiUrls';
import { fetchData } from '../../components/FetchData';
import Opportunities from '../opportunities/Opportunities';
import PipelineCard from './Card';
import { CustomTab, CustomToolbar } from '../../styles/CssStyled';
import '../../styles/style.css';
import { FiPlus } from '@react-icons/all-files/fi/FiPlus';
import { useNavigate } from 'react-router-dom';
import Meeting from './Meeting';
import Negotiation from './Negotiation';
import Qualified from './Qualified';
import Won from './Won';

const Deals: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [leads, setLeads] = useState<any[]>([]);
  const [meeting, setMeetings] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [qualified, setQualified] = useState<any[]>([]);
  const [negotiation, setNegotiation] = useState<any[]>([]);
  const [won, setWon] = useState<any[]>([]);
  const [contacts, setContacts] = useState([]);
  const [status, setStatus] = useState([]);
  const [source, setSource] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [leadSource, setLeadSource] = useState([]);
  const [account, setAccount] = useState([]);
  const [stage, setStage] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const filterLeadsByStatus = (status: string) => {
    return leads.filter((lead) => lead.status === status);
  };
  const [userRole, setUserRole] = useState<string>(
    localStorage.getItem('role') || ''
  );
  const [profileId, setProfileId] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('Token');
      const org = localStorage.getItem('org');

      if (!token || !org) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${SERVER}${ProfileUrl}/`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            org: org,
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching profile: ${response.statusText}`);
        }

        const profileData = await response.json();
        console.log(profileData);
        setProfileId(profileData.user_obj.id);
        setUserRole(profileData.user_obj.role);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Define inline styles as JavaScript objects
  const containerStyle: React.CSSProperties = {
    padding: '20px',
    marginLeft: '1em',
    marginTop: '3em',
  };

  const columnsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0',
  };

  const columnStyle: React.CSSProperties = {
    flex: 1,
    margin: '0 -2%',
    border: 0,
    overflow: 'hidden',
    position: 'relative',
  };

  const firstHeaderStyleBase: React.CSSProperties = {
    textAlign: 'center',
    paddingLeft: '18%',
    padding: '9px',
    color: 'white',
    position: 'relative',
    clipPath: 'polygon(75% 0%,100% 50%,75% 100%,0% 100%,0% 51%,0% 0%)',
    cursor: 'pointer',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 1)',
    letterSpacing: '2px',
    height: '50px',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const headerStyleBase: React.CSSProperties = {
    paddingLeft: '18%',
    padding: '9px',
    color: 'white',
    position: 'relative',
    clipPath: 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
    cursor: 'pointer',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
    letterSpacing: '2px',
    height: '50px',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const displayAreaStyle: React.CSSProperties = {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #1C4D4D',
    borderRadius: '5px',
  };

  const getColorForProbability = (probability: number) => {
    if (probability <= 20) return '#da2700'; // Red
    if (probability <= 40) return '#fe8701'; // Orange
    if (probability <= 60) return '#fcf000'; // Yellow
    if (probability <= 80) return '#87ea00'; // Light green
    return '#00b308'; // Green
  };

  const handleHeaderClick = (component: string) => {
    navigate(`/app/deals/${component}`);
  };

  // Function to handle back click to show the columns again
  const handleBackClick = () => {
    setSelectedComponent(null);
  };

  const onAddHandle = () => {
    if (!loading) {
      navigate('/app/leads/add-leads', {
        state: {
          detail: false,
          contacts: contacts || [],
          status: status || [],
          source: source || [],
          companies: companies || [],
          tags: tags || [],
          users: users || [],
          countries: countries || [],
          industries: industries || [],
          // status: leads.status, source: leads.source, industry: leads.industries, users: leads.users, tags: leads.tags, contacts: leads.contacts
        },
      });
    }
  };

  // Function to render the selected component
  const renderComponent = () => {
    if (selectedComponent === 'Leads') return <Leads />;
    if (selectedComponent === 'Opportunities') return <Opportunities />;
    if (selectedComponent === 'Meeting') return <Meeting />;
    if (selectedComponent === 'Qualified') return <Qualified />;
    if (selectedComponent === 'Negotiation') return <Negotiation />;
    if (selectedComponent === 'Won') return <Won />;
    return null;
  };

  useEffect(() => {
    getLeads();
  }, [userRole, profileId, currentPage]);

  const getLeads = async () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token') || '',
      org: localStorage.getItem('org') || '',
    };

    try {
      const res = await fetchData(
        `${LeadUrl}/?limit=50&page=${currentPage}`,
        'GET',
        null as any,
        Header
      ); // Added page parameter for pagination

      if (!res.error) {
        setLeads(res?.open_leads?.open_leads || []);
        setContacts(res?.contacts || []);
        setStatus(res?.status || []);
        setSource(res?.source || []);
        setCompanies(res?.companies || []);
        setTags(res?.tags || []);
        setUsers(res?.users || []);
        setCountries(res?.countries || []);
        setIndustries(res?.industries || []);

        // Set pagination state if provided
        if (res?.pagination) {
          setCurrentPage(res?.pagination.currentPage || 1);
          setTotalPages(res?.pagination.totalPages || 1);
        }

        // Handle user-specific logic
        if (userRole === 'ADMIN') {
          setLeads(res?.open_leads?.open_leads);
        } else {
          const userLeads = res?.open_leads?.open_leads?.filter(
            (lead: any) => lead.assigned_to?.[0]?.id === profileId
          );
          setLeads(userLeads);
        }
      }
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  return (
    <Box
      sx={{
        mt: '60px',
      }}
    >
      <CustomToolbar>
        <Tabs sx={{ mt: '26px' }}>
          <CustomTab
            value="open"
            label="Open"
            sx={{
              backgroundColor: 'white',
              color: 'darkblue',
            }}
          />
        </Tabs>
        <Button
          variant="contained"
          startIcon={<FiPlus className="plus-icon" />}
          onClick={onAddHandle}
          className={'add-button'}
        >
          Add Lead
        </Button>
      </CustomToolbar>

      <div style={containerStyle}>
        {selectedComponent ? (
          <div>
            <button onClick={handleBackClick}>Back</button>
            <h2>{selectedComponent}</h2>
            {renderComponent()}
          </div>
        ) : (
          <div style={columnsStyle}>
            <div style={columnStyle}>
              <div
                style={{
                  ...firstHeaderStyleBase,
                  backgroundColor: '#87c7e5',
                  marginLeft: '30px',
                }}
                onClick={() => handleHeaderClick('Leads')}
              >
                <span style={{ marginRight: '15%' }}>Leads</span>
              </div>
              {leads && leads.length > 0 ? (
                filterLeadsByStatus('lead').map(
                  (lead) => (
                    console.log(lead),
                    (
                      <PipelineCard
                        key={lead.id}
                        leadId={lead?.id}
                        title={lead.account_name}
                        content={
                          <>
                            <div>
                              Value:{' '}
                              <span
                                style={{
                                  color: '#1a3353',
                                  fontWeight: 500,
                                  textTransform: 'none',
                                }}
                              >
                                {lead.opportunity_amount
                                  ? `€${parseFloat(
                                      lead.opportunity_amount
                                    ).toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}`
                                  : '---'}
                              </span>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: '10px',
                              }}
                            >
                              Assignee:&nbsp;{' '}
                              {lead.assigned_to?.[0]?.user_details
                                ?.profile_pic ? (
                                <Avatar
                                  alt="Profile Picture"
                                  src={
                                    lead.assigned_to?.[0]?.user_details
                                      ?.profile_pic
                                  }
                                  style={{ marginRight: '8px' }}
                                />
                              ) : (
                                <Avatar alt="Profile Initial">
                                  {lead.assigned_to?.[0]?.user_details?.profile_pic?.charAt(
                                    0
                                  )}
                                </Avatar>
                              )}
                              <span
                                style={{
                                  color: '#1a3353',
                                  fontWeight: 500,
                                  textTransform: 'none',
                                }}
                              >
                                &nbsp;
                                {lead.assigned_to?.[0]?.user_details
                                  ?.first_name &&
                                lead.assigned_to?.[0]?.user_details?.last_name
                                  ? `${lead.assigned_to[0].user_details.first_name} ${lead.assigned_to[0].user_details.last_name}`
                                  : lead.assigned_to?.[0]?.user_details
                                      ?.email || 'Unassigned'}
                              </span>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: '10px',
                                marginBottom: '10px',
                              }}
                            >
                              <span>Probability:&nbsp;</span>
                              <div
                                style={{
                                  flexGrow: 1,
                                  height: '10px',
                                  backgroundColor: '#e0e0e0',
                                  borderRadius: '5px',
                                  overflow: 'hidden',
                                }}
                              >
                                <div
                                  style={{
                                    height: '100%',
                                    width: `${lead.probability || 0}%`,
                                    backgroundColor: getColorForProbability(
                                      lead.probability || 0
                                    ),
                                    transition: 'width 0.5s ease',
                                  }}
                                />
                              </div>
                              <span
                                style={{
                                  color: '#1a3353',
                                  fontWeight: 500,
                                  textTransform: 'none',
                                  marginLeft: '10px',
                                }}
                              >
                                {lead.probability || '---'}%
                              </span>
                            </div>
                          </>
                        }
                      />
                    )
                  )
                )
              ) : (
                <div>
                  <p>No leads available</p>
                </div>
              )}
            </div>
            <div style={columnStyle}>
              <div
                style={{ ...headerStyleBase, backgroundColor: '#2ebafb' }}
                onClick={() => handleHeaderClick('Meeting')}
              >
                Meeting
              </div>
              {filterLeadsByStatus('meeting').length > 0 ? (
                filterLeadsByStatus('meeting').map((meeting) => (
                  <PipelineCard
                    key={meeting?.id}
                    leadId={meeting?.id}
                    title={meeting?.account_name}
                    content={
                      <>
                        <div>
                          Value:{' '}
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                            }}
                          >
                            {meeting.opportunity_amount
                              ? `€${parseFloat(
                                  meeting.opportunity_amount
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}`
                              : '---'}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '10px',
                          }}
                        >
                          Assignee:&nbsp;{' '}
                          {meeting.assigned_to?.[0]?.user_details
                            ?.profile_pic ? (
                            <Avatar
                              alt="Profile Picture"
                              src={
                                meeting.assigned_to?.[0]?.user_details
                                  ?.profile_pic
                              }
                              style={{ marginRight: '8px' }}
                            />
                          ) : (
                            <Avatar alt="Profile Initial">
                              {meeting.assigned_to?.[0]?.user_details?.profile_pic?.charAt(
                                0
                              )}
                            </Avatar>
                          )}
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                            }}
                          >
                            &nbsp;
                            {meeting.assigned_to?.[0]?.user_details
                              ?.first_name &&
                            meeting.assigned_to?.[0]?.user_details?.last_name
                              ? `${meeting.assigned_to[0].user_details.first_name} ${meeting.assigned_to[0].user_details.last_name}`
                              : meeting.assigned_to?.[0]?.user_details?.email ||
                                'Unassigned'}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '10px',
                            marginBottom: '10px',
                          }}
                        >
                          <span>Probability:&nbsp;</span>
                          <div
                            style={{
                              flexGrow: 1,
                              height: '10px',
                              backgroundColor: '#e0e0e0',
                              borderRadius: '5px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${meeting.probability || 0}%`,
                                backgroundColor: getColorForProbability(
                                  meeting.probability || 0
                                ),
                                transition: 'width 0.5s ease',
                              }}
                            />
                          </div>
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                              marginLeft: '10px',
                            }}
                          >
                            {meeting.probability || '---'}%
                          </span>
                        </div>
                      </>
                    }
                  />
                ))
              ) : (
                <div>
                  <p>No meetings available</p>
                </div>
              )}
            </div>
            <div style={columnStyle}>
              <div
                style={{ ...headerStyleBase, backgroundColor: '#0993f3' }}
                onClick={() => handleHeaderClick('Opportunities')}
              >
                Opportunity
              </div>
              {filterLeadsByStatus('opportunity').length > 0 ? (
                filterLeadsByStatus('opportunity').map((opportunity) => (
                  <PipelineCard
                    key={opportunity?.id}
                    leadId={opportunity?.id}
                    title={opportunity?.account_name}
                    content={
                      <>
                        <div>
                          Value:{' '}
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                            }}
                          >
                            {opportunity.opportunity_amount
                              ? `€${parseFloat(
                                  opportunity.opportunity_amount
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}`
                              : '---'}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '10px',
                          }}
                        >
                          Assignee:&nbsp;{' '}
                          {opportunity.assigned_to?.[0]?.user_details
                            ?.profile_pic ? (
                            <Avatar
                              alt="Profile Picture"
                              src={
                                opportunity.assigned_to?.[0]?.user_details
                                  ?.profile_pic
                              }
                              style={{ marginRight: '8px' }}
                            />
                          ) : (
                            <Avatar alt="Profile Initial">
                              {opportunity.assigned_to?.[0]?.user_details?.profile_pic?.charAt(
                                0
                              )}
                            </Avatar>
                          )}
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                            }}
                          >
                            &nbsp;
                            {opportunity.assigned_to?.[0]?.user_details
                              ?.first_name &&
                            opportunity.assigned_to?.[0]?.user_details
                              ?.last_name
                              ? `${opportunity.assigned_to[0].user_details.first_name} ${opportunity.assigned_to[0].user_details.last_name}`
                              : opportunity.assigned_to?.[0]?.user_details
                                  ?.email || 'Unassigned'}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '10px',
                            marginBottom: '10px',
                          }}
                        >
                          <span>Probability:&nbsp;</span>
                          <div
                            style={{
                              flexGrow: 1,
                              height: '10px',
                              backgroundColor: '#e0e0e0',
                              borderRadius: '5px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${opportunity.probability || 0}%`,
                                backgroundColor: getColorForProbability(
                                  opportunity.probability || 0
                                ),
                                transition: 'width 0.5s ease',
                              }}
                            />
                          </div>
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                              marginLeft: '10px',
                            }}
                          >
                            {opportunity.probability || '---'}%
                          </span>
                        </div>
                      </>
                    }
                  />
                ))
              ) : (
                <div>
                  <p>No opportunities available</p>
                </div>
              )}
            </div>
            <div style={columnStyle}>
              <div
                style={{ ...headerStyleBase, backgroundColor: '#0763e5' }}
                onClick={() => handleHeaderClick('Qualified')}
              >
                Qualified
              </div>
              {filterLeadsByStatus('qualified').length > 0 ? (
                filterLeadsByStatus('qualified').map((qualified) => (
                  <PipelineCard
                    key={qualified?.id}
                    leadId={qualified?.id}
                    title={qualified?.account_name}
                    content={
                      <>
                        <div>
                          Value:{' '}
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                            }}
                          >
                            {qualified.opportunity_amount
                              ? `€${parseFloat(
                                  qualified.opportunity_amount
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}`
                              : '---'}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '10px',
                          }}
                        >
                          Assignee:&nbsp;{' '}
                          {qualified.assigned_to?.[0]?.user_details
                            ?.profile_pic ? (
                            <Avatar
                              alt="Profile Picture"
                              src={
                                qualified.assigned_to?.[0]?.user_details
                                  ?.profile_pic
                              }
                              style={{ marginRight: '8px' }}
                            />
                          ) : (
                            <Avatar alt="Profile Initial">
                              {qualified.assigned_to?.[0]?.user_details?.profile_pic?.charAt(
                                0
                              )}
                            </Avatar>
                          )}
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                            }}
                          >
                            &nbsp;
                            {qualified.assigned_to?.[0]?.user_details
                              ?.first_name &&
                            qualified.assigned_to?.[0]?.user_details?.last_name
                              ? `${qualified.assigned_to[0].user_details.first_name} ${qualified.assigned_to[0].user_details.last_name}`
                              : qualified.assigned_to?.[0]?.user_details
                                  ?.email || 'Unassigned'}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '10px',
                            marginBottom: '10px',
                          }}
                        >
                          <span>Probability:&nbsp;</span>
                          <div
                            style={{
                              flexGrow: 1,
                              height: '10px',
                              backgroundColor: '#e0e0e0',
                              borderRadius: '5px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${qualified.probability || 0}%`,
                                backgroundColor: getColorForProbability(
                                  qualified.probability || 0
                                ),
                                transition: 'width 0.5s ease',
                              }}
                            />
                          </div>
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                              marginLeft: '10px',
                            }}
                          >
                            {qualified.probability || '---'}%
                          </span>
                        </div>
                      </>
                    }
                  />
                ))
              ) : (
                <div>
                  <p>No qualified leads available</p>
                </div>
              )}
            </div>
            <div style={columnStyle}>
              <div
                style={{ ...headerStyleBase, backgroundColor: '#0e458b' }}
                onClick={() => handleHeaderClick('Negotiation')}
              >
                Negotiation
              </div>
              {filterLeadsByStatus('negotiation').length > 0 ? (
                filterLeadsByStatus('negotiation').map((negotiation) => (
                  <PipelineCard
                    key={negotiation?.id}
                    leadId={negotiation?.id}
                    title={negotiation?.account_name}
                    content={
                      <>
                        <div>
                          Value:{' '}
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                            }}
                          >
                            {negotiation.opportunity_amount
                              ? `€${parseFloat(
                                  negotiation.opportunity_amount
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}`
                              : '---'}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '10px',
                          }}
                        >
                          Assignee:&nbsp;{' '}
                          {negotiation.assigned_to?.[0]?.user_details
                            ?.profile_pic ? (
                            <Avatar
                              alt="Profile Picture"
                              src={
                                negotiation.assigned_to?.[0]?.user_details
                                  ?.profile_pic
                              }
                              style={{ marginRight: '8px' }}
                            />
                          ) : (
                            <Avatar alt="Profile Initial">
                              {negotiation.assigned_to?.[0]?.user_details?.profile_pic?.charAt(
                                0
                              )}
                            </Avatar>
                          )}
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                            }}
                          >
                            &nbsp;
                            {negotiation.assigned_to?.[0]?.user_details
                              ?.first_name &&
                            negotiation.assigned_to?.[0]?.user_details
                              ?.last_name
                              ? `${negotiation.assigned_to[0].user_details.first_name} ${negotiation.assigned_to[0].user_details.last_name}`
                              : negotiation.assigned_to?.[0]?.user_details
                                  ?.email || 'Unassigned'}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '10px',
                            marginBottom: '10px',
                          }}
                        >
                          <span>Probability:&nbsp;</span>
                          <div
                            style={{
                              flexGrow: 1,
                              height: '10px',
                              backgroundColor: '#e0e0e0',
                              borderRadius: '5px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${negotiation.probability || 0}%`,
                                backgroundColor: getColorForProbability(
                                  negotiation.probability || 0
                                ),
                                transition: 'width 0.5s ease',
                              }}
                            />
                          </div>
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                              marginLeft: '10px',
                            }}
                          >
                            {negotiation.probability || '---'}%
                          </span>
                        </div>
                      </>
                    }
                  />
                ))
              ) : (
                <div>
                  <p>No negotiations available</p>
                </div>
              )}
            </div>
            <div style={columnStyle}>
              <div
                style={{
                  ...headerStyleBase,
                  backgroundColor: '#1A3353',
                  marginRight: '30px',
                }}
                onClick={() => handleHeaderClick('Won')}
              >
                Won
              </div>
              {filterLeadsByStatus('won').length > 0 ? (
                filterLeadsByStatus('won').map((won) => (
                  <PipelineCard
                    key={won?.id}
                    leadId={won?.id}
                    title={won?.account_name}
                    content={
                      <>
                        <div>
                          Value:{' '}
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                            }}
                          >
                            {won.opportunity_amount
                              ? `€${parseFloat(
                                  won.opportunity_amount
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}`
                              : '---'}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '10px',
                          }}
                        >
                          Assignee:&nbsp;{' '}
                          {won.assigned_to?.[0]?.user_details?.profile_pic ? (
                            <Avatar
                              alt="Profile Picture"
                              src={
                                won.assigned_to?.[0]?.user_details?.profile_pic
                              }
                              style={{ marginRight: '8px' }}
                            />
                          ) : (
                            <Avatar alt="Profile Initial">
                              {won.assigned_to?.[0]?.user_details?.profile_pic?.charAt(
                                0
                              )}
                            </Avatar>
                          )}
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                            }}
                          >
                            &nbsp;
                            {won.assigned_to?.[0]?.user_details?.first_name &&
                            won.assigned_to?.[0]?.user_details?.last_name
                              ? `${won.assigned_to[0].user_details.first_name} ${won.assigned_to[0].user_details.last_name}`
                              : won.assigned_to?.[0]?.user_details?.email ||
                                'Unassigned'}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '10px',
                            marginBottom: '10px',
                          }}
                        >
                          <span>Probability:&nbsp;</span>
                          <div
                            style={{
                              flexGrow: 1,
                              height: '10px',
                              backgroundColor: '#e0e0e0',
                              borderRadius: '5px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${won.probability || 0}%`,
                                backgroundColor: getColorForProbability(
                                  won.probability || 0
                                ),
                                transition: 'width 0.5s ease',
                              }}
                            />
                          </div>
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                              marginLeft: '10px',
                            }}
                          >
                            {won.probability || '---'}%
                          </span>
                        </div>
                      </>
                    }
                  />
                ))
              ) : (
                <div>
                  <p>No won leads available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Box>
  );
};

export default Deals;
