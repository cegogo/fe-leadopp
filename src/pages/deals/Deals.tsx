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
  const filterLeadsByStatus = (status: string) => {
    return leads.filter((lead) => lead.status === status);
  };

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
    textAlign: 'center',
    paddingLeft: '18%',
    padding: '9px',
    color: 'white',
    position: 'relative',
    clipPath: 'polygon(0 0, 75% 0, 100% 50%, 75% 100%, 0 100%, 25% 50%)',
    cursor: 'pointer',
  };

  const displayAreaStyle: React.CSSProperties = {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #1C4D4D',
    borderRadius: '5px',
  };

  const handleHeaderClick = (component: string) => {
    navigate(`/app/${component}`);
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
  }, []);

  const getLeads = async () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token') || '',
      org: localStorage.getItem('org') || '',
    };

    try {
      const res = await fetchData(`${LeadUrl}/?limit=50`, 'GET', null as any, Header); //limit=50 is getting 50 leads, ignoring the pagination of 10.
      if (!res.error) {
        setLeads(res?.open_leads?.open_leads);
        setContacts(res?.contacts);
        setStatus(res?.status);
        setSource(res?.source);
        setCompanies(res?.companies);
        setTags(res?.tags);
        setUsers(res?.users);
        setCountries(res?.countries);
        setIndustries(res?.industries);
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
                style={{ ...headerStyleBase, backgroundColor: '#AC80A0' }}
                onClick={() => handleHeaderClick('Leads')}
              >
                Leads
              </div>
              {leads && leads.length > 0 ? (
                filterLeadsByStatus('lead').map((lead) => (
                  console.log(lead),
                  <PipelineCard
                    key={lead.id}
                    title={lead.account_name}
                    content={
                      <>
                        <div>
                          Value:  <span style={{color: '#1a3353',fontWeight: 500, textTransform: 'none', }}>€{lead.opportunity_amount || '---'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          Assignee:&nbsp; {lead.assigned_to?.[0]?.user_details?.profile_pic ? (
                            <Avatar
                              alt="Profile Picture"
                              src={lead.assigned_to?.[0]?.user_details?.profile_pic}
                              style={{ marginRight: '8px' }}
                            />
                          ) : (
                            <Avatar alt="Profile Initial">
                              {lead.assigned_to?.[0]?.user_details?.profile_pic?.charAt(0)}
                            </Avatar>
                          )}
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                            }}>
                          &nbsp;{lead.assigned_to?.[0]?.user_details?.first_name &&
                            lead.assigned_to?.[0]?.user_details?.last_name
                            ? `${lead.assigned_to[0].user_details.first_name} ${lead.assigned_to[0].user_details.last_name}`
                            : lead.assigned_to?.[0]?.user_details?.email || 'Unassigned'
                          }
                          </span>
                        </div>
                        <div>
                          Probability:  <span style={{color: '#1a3353',fontWeight: 500, textTransform: 'none', }}> {lead.probability || '---'}%</span>
                        </div>
                      </>
                    }
                    />
                ))
              ) : (
                <div>
                  <p>No leads available</p>
                </div>
              )}
            </div>
            <div style={columnStyle}>
              <div
                style={{ ...headerStyleBase, backgroundColor: '#89AAE6' }}
                onClick={() => handleHeaderClick('Meeting')}
              >
                Meeting
              </div>
              {filterLeadsByStatus('meeting').length > 0 ? (
                filterLeadsByStatus('meeting').map((meeting) => (
                  <PipelineCard
                    key={meeting?.id}
                    title={meeting?.account_name}
                    content={
                      <>
                        <div>
                          Value: <span style={{color: '#1a3353',fontWeight: 500, textTransform: 'none', }}>€{meeting.opportunity_amount || '---'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          Assignee:&nbsp; {meeting.assigned_to?.[0]?.user_details?.profile_pic ? (
                            <Avatar
                              alt="Profile Picture"
                              src={meeting.assigned_to?.[0]?.user_details?.profile_pic}
                              style={{ marginRight: '8px' }}
                            />
                          ) : (
                            <Avatar alt="Profile Initial">
                              {meeting.assigned_to?.[0]?.user_details?.profile_pic?.charAt(0)}
                            </Avatar>
                          )}
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                            }}>
                          &nbsp;{meeting.assigned_to?.[0]?.user_details?.first_name &&
                            meeting.assigned_to?.[0]?.user_details?.last_name
                            ? `${meeting.assigned_to[0].user_details.first_name} ${meeting.assigned_to[0].user_details.last_name}`
                            : meeting.assigned_to?.[0]?.user_details?.email || 'Unassigned'
                          }
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
                style={{ ...headerStyleBase, backgroundColor: '#3685B5' }}
                onClick={() => handleHeaderClick('Opportunities')}
              >
                Opportunity
              </div>
              {filterLeadsByStatus('opportunity').length > 0 ? (
                filterLeadsByStatus('opportunity').map((opportunity) => (
                  <PipelineCard
                    key={opportunity?.id}
                    title={opportunity?.account_name}
                    content={
                      <>
                        <div>
                          Value: <span style={{color: '#1a3353',fontWeight: 500, textTransform: 'none', }}>€{opportunity.opportunity_amount || '---'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          Assignee:&nbsp; {opportunity.assigned_to?.[0]?.user_details?.profile_pic ? (
                            <Avatar
                              alt="Profile Picture"
                              src={opportunity.assigned_to?.[0]?.user_details?.profile_pic}
                              style={{ marginRight: '8px' }}
                            />
                          ) : (
                            <Avatar alt="Profile Initial">
                              {opportunity.assigned_to?.[0]?.user_details?.profile_pic?.charAt(0)}
                            </Avatar>
                          )}
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                            }}>
                          &nbsp;{opportunity.assigned_to?.[0]?.user_details?.first_name &&
                            opportunity.assigned_to?.[0]?.user_details?.last_name
                            ? `${opportunity.assigned_to[0].user_details.first_name} ${opportunity.assigned_to[0].user_details.last_name}`
                            : opportunity.assigned_to?.[0]?.user_details?.email || 'Unassigned'
                          }
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
                style={{ ...headerStyleBase, backgroundColor: '#0471A6' }}
                onClick={() => handleHeaderClick('Qualified')}
              >
                Qualified
              </div>
              {filterLeadsByStatus('qualified').length > 0 ? (
                filterLeadsByStatus('qualified').map((qualified) => (
                  <PipelineCard
                    key={qualified?.id}
                    title={qualified?.account_name}
                    content={
                      <>
                        <div>
                          Value: <span style={{color: '#1a3353',fontWeight: 500, textTransform: 'none', }}>€{qualified.opportunity_amount || '---'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          Assignee:&nbsp; {qualified.assigned_to?.[0]?.user_details?.profile_pic ? (
                            <Avatar
                              alt="Profile Picture"
                              src={qualified.assigned_to?.[0]?.user_details?.profile_pic}
                              style={{ marginRight: '8px' }}
                            />
                          ) : (
                            <Avatar alt="Profile Initial">
                              {qualified.assigned_to?.[0]?.user_details?.profile_pic?.charAt(0)}
                            </Avatar>
                          )}
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                            }}>
                          &nbsp;{qualified.assigned_to?.[0]?.user_details?.first_name &&
                            qualified.assigned_to?.[0]?.user_details?.last_name
                            ? `${qualified.assigned_to[0].user_details.first_name} ${qualified.assigned_to[0].user_details.last_name}`
                            : qualified.assigned_to?.[0]?.user_details?.email || 'Unassigned'
                          }
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
                style={{ ...headerStyleBase, backgroundColor: '#023d5a' }}
                onClick={() => handleHeaderClick('Negotiation')}
              >
                Negotiation
              </div>
              {filterLeadsByStatus('negotiation').length > 0 ? (
                filterLeadsByStatus('negotiation').map((negotiation) => (
                  <PipelineCard
                    key={negotiation?.id}
                    title={negotiation?.account_name}
                    content={
                      <>
                        <div>
                          Value: <span style={{color: '#1a3353',fontWeight: 500, textTransform: 'none', }}> €{negotiation.opportunity_amount || '---'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          Assignee:&nbsp; {negotiation.assigned_to?.[0]?.user_details?.profile_pic ? (
                            <Avatar
                              alt="Profile Picture"
                              src={negotiation.assigned_to?.[0]?.user_details?.profile_pic}
                              style={{ marginRight: '8px' }}
                            />
                          ) : (
                            <Avatar alt="Profile Initial">
                              {negotiation.assigned_to?.[0]?.user_details?.profile_pic?.charAt(0)}
                            </Avatar>
                          )}
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                            }}>
                          &nbsp;{negotiation.assigned_to?.[0]?.user_details?.first_name &&
                            negotiation.assigned_to?.[0]?.user_details?.last_name
                            ? `${negotiation.assigned_to[0].user_details.first_name} ${negotiation.assigned_to[0].user_details.last_name}`
                            : negotiation.assigned_to?.[0]?.user_details?.email || 'Unassigned'
                          }
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
                style={{ ...headerStyleBase, backgroundColor: '#1C4D4D' }}
                onClick={() => handleHeaderClick('Won')}
              >
                Won
              </div>
              {filterLeadsByStatus('won').length > 0 ? (
                filterLeadsByStatus('won').map((won) => (
                  <PipelineCard
                    key={won?.id}
                    title={won?.account_name}
                    content={
                      <>
                        <div>
                              Value: 
                              <span style={{color: '#1a3353',fontWeight: 500, textTransform: 'none', }}> €{won.opportunity_amount || '---'} </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          Assignee:&nbsp; {won.assigned_to?.[0]?.user_details?.profile_pic ? (
                            <Avatar
                              alt="Profile Picture"
                              src={won.assigned_to?.[0]?.user_details?.profile_pic}
                              style={{ marginRight: '8px' }}
                            />
                          ) : (
                            <Avatar alt="Profile Initial">
                              {won.assigned_to?.[0]?.user_details?.profile_pic?.charAt(0)}
                            </Avatar>
                          )}
                          <span
                            style={{
                              color: '#1a3353',
                              fontWeight: 500,
                              textTransform: 'none',
                            }}>
                          &nbsp;{won.assigned_to?.[0]?.user_details?.first_name &&
                            won.assigned_to?.[0]?.user_details?.last_name
                            ? `${won.assigned_to[0].user_details.first_name} ${won.assigned_to[0].user_details.last_name}`
                            : won.assigned_to?.[0]?.user_details?.email || 'Unassigned'
                          }
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