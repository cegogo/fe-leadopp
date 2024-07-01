import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
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
        fetchAssignedLeads();
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

    const fetchAssignedLeads = async () => {
        // Fetch leads assigned to the current user
        // Replace with your actual API call
        setAssignedLeads([
            // Sample data
            { id: 1, title: 'Assigned Lead 1', opportunity_amount: 5000, assigned_to: { name: 'User A' } },
            { id: 2, title: 'Assigned Lead 2', opportunity_amount: 3000, assigned_to: { name: 'User B' } },
        ]);
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
        boxShadow: '0 4px 8px rgba(0, 0.2, 0, 0.4)',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        height: '90%',
    };

    return (
        <Box sx={{ padding: '5px', marginTop: '60px' }}>
            <Grid container spacing={1}>
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
            <Grid item xs={12} md={6}>
            <Card style={cardStyle}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Potential Deals Value</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={leadsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="title" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="opportunity_amount" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            </Grid>
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
            <Grid item xs={12} md={6}>
            <Card style={cardStyle}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>My Deals</Typography>
                    {assignedLeads.map((lead) => (
                        <Box key={lead.id} sx={{ padding: '10px 0' }}>
                            <Typography variant="body1"><strong>Name:</strong> {lead.title}</Typography>
                            <Typography variant="body2"><strong>Value:</strong> ${lead.opportunity_amount}</Typography>
                            <Typography variant="body2"><strong>Assignee:</strong> {lead.assigned_to?.name}</Typography>
                        </Box>
                    ))}
                </CardContent>
            </Card>
            </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;