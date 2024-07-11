import React, { SyntheticEvent, useState, useEffect, } from 'react';
import { Box, Button, Tabs } from '@mui/material'
import Leads from '../leads/Leads';
import { LeadUrl, OpportunityUrl } from '../../services/ApiUrls';
import { fetchData } from '../../components/FetchData';
import Opportunities from '../opportunities/Opportunities';
import Card from './Card';
import { CustomTab, CustomToolbar } from '../../styles/CssStyled';
import '../../styles/style.css'
import { FiPlus } from '@react-icons/all-files/fi/FiPlus';
import { useNavigate } from 'react-router-dom';

const Deals: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [contacts, setContacts] = useState([])
  const [status, setStatus] = useState([])
  const [source, setSource] = useState([])
  const [companies, setCompanies] = useState([])
  const [tags, setTags] = useState([])
  const [users, setUsers] = useState([])
  const [countries, setCountries] = useState([])
  const [industries, setIndustries] = useState([])
  const [currency, setCurrency] = useState([])
  const [leadSource, setLeadSource] = useState([])
  const [account, setAccount] = useState([])
  const [stage, setStage] = useState([])
  const [teams, setTeams] = useState([])


  // Define inline styles as JavaScript objects
  const containerStyle: React.CSSProperties = {
    padding: '20px',
    marginLeft: '1em',
    marginTop: '3em',
  };

  const columnsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0'
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
    borderRadius: '5px'
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
          contacts: contacts || [], status: status || [], source: source || [], companies: companies || [], tags: tags || [], users: users || [], countries: countries || [], industries: industries || []
          // status: leads.status, source: leads.source, industry: leads.industries, users: leads.users, tags: leads.tags, contacts: leads.contacts 
        }
      })
    }
  }

  // Function to render the selected component
  const renderComponent = () => {
    if (selectedComponent === 'Leads') return <Leads />;
    if (selectedComponent === 'Opportunities') return <Opportunities />;
    if (selectedComponent === 'Meeting') return <div>Meeting Component Content</div>;
    if (selectedComponent === 'Qualified') return <div>Qualified Component Content</div>;
    if (selectedComponent === 'Negotiation') return <div>Negotiation Component Content</div>;
    if (selectedComponent === 'Won') return <div>Won Component Content</div>;
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
      const res = await fetchData(`${LeadUrl}/`, 'GET', null as any, Header);
      if (!res.error) {
        setLeads(res?.open_leads?.open_leads)
        setContacts(res?.contacts)
        setStatus(res?.status)
        setSource(res?.source)
        setCompanies(res?.companies)
        setTags(res?.tags)
        setUsers(res?.users)
        setCountries(res?.countries)
        setIndustries(res?.industries)
      }
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); // Set loading to false even if there's an error
    }
  }
  useEffect(() => {
    getOpportunity();
  }, []);

  const getOpportunity = async () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token') || '',
      org: localStorage.getItem('org') || '',
    };

    try {
      const resop = await fetchData(`${OpportunityUrl}/`, 'GET', null as any, Header);
      if (!resop.error) {
        setOpportunities(resop?.opportunities)
        setContacts(resop?.contacts_list)
        setAccount(resop?.accounts_list)
        setCurrency(resop?.currency)
        setLeadSource(resop?.lead_source)
        setStage(resop?.stage)
        setTags(resop?.tags)
        setTeams(resop?.teams)
        setUsers(resop?.users)
        setCountries(resop?.countries)
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching opportunity data:', error);
      setLoading(false);
    }
  }

  return (
    <Box sx={{
      mt: '60px',
    }}>
      <CustomToolbar>
        <Tabs sx={{ mt: '26px' }}>
          <CustomTab value="open" label="Open"
            sx={{
              backgroundColor: 'white',
              color: 'darkblue',
            }} />
        </Tabs>
        <Button
          variant='contained'
          startIcon={<FiPlus className='plus-icon' />}
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
              <div style={{ ...headerStyleBase, backgroundColor: '#AC80A0' }} onClick={() => handleHeaderClick('Leads')}>Leads</div>
              {leads.length > 0 ? (
                leads.map((lead) => (
                  console.log(lead),
                  <Card key={lead?.id} title={lead?.account_name} content={`Value: $${lead?.opportunity_amount}\n
                                Assignee: ${lead?.assigned_to?.[0]?.user_details?.first_name && lead?.assigned_to?.[0]?.user_details?.last_name ?
                      lead?.assigned_to?.[0]?.user_details?.first_name + ' ' + lead?.assigned_to?.[0]?.user_details?.last_name :
                      lead?.assigned_to?.[0]?.user_details?.email || 'Unassigned'}`} />
                ))
              ) : (
                <div>
                  <p>No leads available</p>
                </div>
              )}
            </div>
            <div style={columnStyle}>
              <div style={{ ...headerStyleBase, backgroundColor: '#89AAE6' }} onClick={() => handleHeaderClick('Meeting')}>Meeting</div>
              <Card title="Meeting" content="Meeting details here..." />
              <Card title="Meeting" content="Meeting details here..." />
            </div>
            <div style={columnStyle}>
              <div style={{ ...headerStyleBase, backgroundColor: '#3685B5' }} onClick={() => handleHeaderClick('Opportunities')}>Opportunity</div>
              {opportunities.length > 0 ? (
                opportunities.map((opportunity) => (
                  <Card
                    key={opportunity.id}
                    title={opportunity.name}
                    content={`Value: $${opportunity?.amount}\nStage: ${opportunity?.stage}`}
                  />
                ))
              ) : (
                <div>
                  <p>No opportunities available</p>
                </div>
              )}
            </div>
            <div style={columnStyle}>
              <div style={{ ...headerStyleBase, backgroundColor: '#0471A6' }} onClick={() => handleHeaderClick('Qualified')}>Qualified</div>
              <Card title="Qualified" content="Qualified details here..." />
              <Card title="Qualified" content="Qualified details here..." />
            </div>
            <div style={columnStyle}>
              <div style={{ ...headerStyleBase, backgroundColor: '#023d5a' }} onClick={() => handleHeaderClick('Negotiation')}>Negotiation</div>
              <Card title="Negotiation" content="Negotiation details here..." />
              <Card title="Negotiation" content="Negotiation details here..." />
            </div>
            <div style={columnStyle}>
              <div style={{ ...headerStyleBase, backgroundColor: '#1C4D4D' }} onClick={() => handleHeaderClick('Won')}>Won</div>
              <Card title="Won" content="Won details here..." />
              <Card title="Won" content="Won details here..." />
            </div>
          </div>
        )}
      </div>
    </Box>
  );
}

export default Deals;