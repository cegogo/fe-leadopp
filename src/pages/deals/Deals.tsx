import React, { useState, useEffect } from 'react';
import { Avatar, Box, Button, Tabs } from '@mui/material';
import {
  LeadUrl,
  ProfileUrl,
  SERVER,
} from '../../services/ApiUrls';
import { fetchData } from '../../components/FetchData';
import PipelineCard from './Card';
import { CustomTab, CustomToolbar } from '../../styles/CssStyled';
import '../../styles/style.css';
import { FiPlus } from '@react-icons/all-files/fi/FiPlus';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import LeadsColumn from './LeadsColumn';
import MeetingColumn from './MeetingColumn';

const Deals: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [leads, setLeads] = useState<any[]>([]);
  const [contacts, setContacts] = useState([]);
  const [status, setStatus] = useState([]);
  const [source, setSource] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [industries, setIndustries] = useState([]);
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

  const onAddHandle = () => {
    if (!loading) {
      navigate('/app/deals/add-leads', {
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

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    const token = localStorage.getItem('Token');
    const org = localStorage.getItem('org');

    if (!token || !org) {
      throw new Error('Authorization or organization details missing');
    }

    // Prepare the updated lead data
    const updatedLeadData = {
      status: newStatus,
    };

    // Send the updated lead data to the server
    const response = await fetchData(
      `${LeadUrl}/${leadId}/`,
      'PUT',
      JSON.stringify(updatedLeadData),
      {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        org: org,
      }
    );

    if (response.error) {
      throw new Error(`Failed to update lead status: ${response.error}`);
    }

    return response;
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const updatedLeads = Array.from(leads);
    const [movedLead] = updatedLeads.splice(source.index, 1);
    movedLead.status = destination.droppableId;
    updatedLeads.splice(destination.index, 0, movedLead);

    // Update local state
    setLeads(updatedLeads);

    try {
      // Update lead status on the server
      await updateLeadStatus(movedLead.id, destination.droppableId);
    } catch (error) {
      console.error('Error updating lead status on the server:', error);
      // Optionally revert the local changes or show an error message to the user
      // For example, you might want to revert the state change in case of an error
      setLeads(leads);
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
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={columnsStyle}>

            <LeadsColumn />

            <MeetingColumn />

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
                              {opportunity.assigned_to?.[0]?.user_details?.first_name?.charAt(
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
                <div>{/*  <p>No opportunities available</p> */}</div>
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
                              {qualified.assigned_to?.[0]?.user_details?.first_name?.charAt(
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
                <div>{/* <p>No qualified leads available</p> */}</div>
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
                              {negotiation.assigned_to?.[0]?.user_details?.first_name?.charAt(
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
                <div>{/*<p>No negotiations available</p> */}</div>
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
                              {won.assigned_to?.[0]?.user_details?.first_name?.charAt(
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
                <div>{/* <p>No won leads available</p> */}</div>
              )}
            </div>
          </div>
        </DragDropContext>
      </div>
    </Box>
  );
};

export default Deals;
