import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, LinearProgress } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchData } from '../../components/FetchData'; // Assuming fetchData is a utility function you've created
import { LeadUrl } from '../../services/ApiUrls'; // Assuming LeadUrl is your API endpoint for leads

const Dashboard: React.FC = () => {
    const [newLeads, setNewLeads] = useState<any[]>([]);
    const [assignedLeads, setAssignedLeads] = useState<any[]>([]);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [leadsData, setLeadsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch leads and team data when the component mounts
    useEffect(() => {
        fetchLeadsData();
        fetchTeamMembers();
    }, []);

    const fetchLeadsData = async () => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token') || '',
            org: localStorage.getItem('org') || '',
        };

        try {
            const res = await fetchData(`${LeadUrl}/`, 'GET', null as any, Header);
            if (!res.error) {
                setNewLeads(res?.open_leads?.open_leads?.slice(0, 5)); // Get the newest 5 leads
                setLeadsData(res?.open_leads?.open_leads); // For chart data
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const fetchTeamMembers = async () => {
        // Fetch team members of the current user
        // Replace with your actual API call
        setTeamMembers([
            // Sample data
            { id: 1, name: 'Team Member 1' },
            { id: 2, name: 'Team Member 2' },
            { id: 3, name: 'Team Member 3' },
        ]);
    };

    const pipelineData = [
        { name: 'Leads', value: 10 },
        { name: 'Meeting', value: 7 },
        { name: 'Opportunity', value: 5 },
        { name: 'Qualified', value: 3 },
        { name: 'Negotiation', value: 2 },
        { name: 'Won', value: 1 },
    ];

    const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#ED8473'];

    // Card Styles
    const cardStyle: React.CSSProperties = {
        borderRadius: '12px',
        border: '2px solid',
        boxShadow: '0 4px 8px rgba(0, 0, 2, 0.4)',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        height: '90%',
    };

    // Progress Bar Styles
    const progressBarStyle = {
        backgroundColor: '#6a1b9a', // Bar color
        height: '8px',
        borderRadius: '4px',
    };

    return (
        <Box sx={{ padding: '5px', marginTop: '60px' }}>
            <Grid container spacing={1}>
                {/* Pipeline Breakdown */}
                <Grid item xs={12} md={6}>
                    <Card style={cardStyle}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>Pipeline Breakdown</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pipelineData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        {pipelineData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
               
                {/* Potential Deals Value */}
                <Grid item xs={12} md={6}>
                    <Card style={cardStyle}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>Potential Deals Value</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={leadsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="account_name" />
                                    <YAxis domain={[0, 100000]} />
                                    <Tooltip />
                                    <Bar dataKey="opportunity_amount" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
               
                {/* Team Members */}
                <Grid item xs={12} md={6}>
                    <Card style={cardStyle}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>Team Members</Typography>
                            {teamMembers.map((member) => (
                                <Typography key={member.id} variant="body1">{member.name}</Typography>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
               
                {/* My Deals */}
                <Grid item xs={12} md={6}>
                    <Card style={cardStyle}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>My Deals</Typography>
                            <Grid container spacing={1}>
                                {/* Lead Name */}
                                <Grid item xs={12} sm={6} md={2.5}>
                                    <Typography variant="body1" style={{ color: '#000', marginBottom: '5px' }}><strong>Lead Name</strong></Typography>
                                    {newLeads.map((lead) => (
                                        <Typography key={lead.id} variant="body2" style={{ color: '#000', marginBottom: '5px' }}>{lead?.account_name}</Typography>
                                    ))}
                                </Grid>
 
                                {/* Value */}
                                <Grid item xs={12} sm={6} md={2.5}>
                                    <Typography variant="body1" style={{ color: '#000', marginBottom: '5px' }}><strong>Value</strong></Typography>
                                    {newLeads.map((lead) => (
                                        <Typography key={lead.id} variant="body2" style={{ color: '#000', marginBottom: '5px' }}>${lead?.opportunity_amount}</Typography>
                                    ))}
                                </Grid>
 
                                {/* Probability */}
                                <Grid item xs={12} sm={6} md={2.5}>
                                    <Typography variant="body1" style={{ color: '#000', marginBottom: '5px' }}><strong>Probability</strong></Typography>
                                    {newLeads.map((lead) => (
                                        <Box key={lead.id} sx={{ width: '100%', position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={lead.probability}
                                                sx={{ width: '100%', height: '15px', borderRadius: '4px' }}
                                            />
                                            <Typography
                                                variant="body2"
                                                style={{
                                                    position: 'absolute',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    color: '#000',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                {`${lead.probability}%`}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Grid>
 
                                {/* Status */}
                                <Grid item xs={12} sm={6} md={2.1}>
                                    <Typography variant="body1" style={{ color: '#000', marginBottom: '5px' }}><strong>Status</strong></Typography>
                                    {newLeads.map((lead) => (
                                        <Typography key={lead.id} variant="body2" style={{ color: '#000', marginBottom: '5px' }}>{lead?.status}</Typography>
                                    ))}
                                </Grid>
 
                                {/* Assignee */}
                                {/* Assuming md={3} for consistency, adjust as needed */}
                                <Grid item xs={12} sm={6} md={2.4}>
                                    <Typography variant="body1" style={{ color: '#000', marginBottom: '5px' }}><strong>Assignee</strong></Typography>
                                    {newLeads.map((lead) => (
                                        <Typography key={lead.id} variant="body2" style={{ color: '#000', marginBottom: '5px' }}>{lead?.assigned_to?.name}</Typography>
                                    ))}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;