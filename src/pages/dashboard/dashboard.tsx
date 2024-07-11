import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, LinearProgress, Grid } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchData } from '../../components/FetchData'; // Assuming fetchData is a utility function you've created
import { LeadUrl } from '../../services/ApiUrls'; // Assuming LeadUrl is your API endpoint for leads

const Dashboard: React.FC = () => {
    const [newLeads, setNewLeads] = useState<any[]>([]);
    const [assignedLeads, setAssignedLeads] = useState<any[]>([]);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [leadsData, setLeadsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | undefined }>({ key: 'account_name', direction: undefined });
    const [userRole, setUserRole] = useState<string>(localStorage.getItem('role') || '');
    const [userId, setUserId] = useState<string>(localStorage.getItem('current_user_id') || '');


    useEffect(() => {
        fetchLeadsData();
        fetchTeamMembers();
    }, [userRole]);

    useEffect(() => {
        if (sortConfig.direction !== undefined) {
            setNewLeads((prevLeads) => {
                const sortedLeads = [...prevLeads].sort((a, b) => {
                    let aValue = a[sortConfig.key];
                    let bValue = b[sortConfig.key];

                    // Handle nested key for assigned_to.name
                    if (sortConfig.key === 'assigned_to.name') {
                        aValue = a.assigned_to?.name || '';
                        bValue = b.assigned_to?.name || '';
                    }

                    // Convert to numbers for numerical fields
                    if (sortConfig.key === 'opportunity_amount' || sortConfig.key === 'probability') {
                        aValue = Number(aValue);
                        bValue = Number(bValue);
                    }

                    if (aValue < bValue) {
                        return sortConfig.direction === 'asc' ? -1 : 1;
                    }
                    if (aValue > bValue) {
                        return sortConfig.direction === 'asc' ? 1 : -1;
                    }
                    return 0;
                });
                return sortedLeads;
            });
        }
    }, [sortConfig]);

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
                if (userRole === 'ADMIN') {
                    /* console.log(userRole) */
                    setNewLeads(res?.open_leads?.open_leads?.slice(0, 5)); // Get the newest 5 leads
                    setLeadsData(res?.open_leads?.open_leads); // For chart data
                } else {
                    /* console.log(userRole) */
                    const userLeads = res?.open_leads?.open_leads?.filter((lead: any) => lead.assigned_to?.id === userId);
                    setNewLeads(userLeads.slice(0, 5)); // Get the newest 5 leads assigned to the user
                    setLeadsData(userLeads); // For chart data
                }
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const fetchTeamMembers = async () => {
        setTeamMembers([
            { id: 1, name: 'Team Member 1' },
            { id: 2, name: 'Team Member 2' },
            { id: 3, name: 'Team Member 3' },
        ]);
    };

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' | undefined = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
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

    const cardStyle: React.CSSProperties = {
        borderRadius: '12px',
        border: '2px solid',
        boxShadow: '0 4px 8px rgba(0, 0, 2, 0.4)',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        height: '90%',
    };

    const progressBarStyle = {
        backgroundColor: '#C7DDE5',
        height: '12px',
        borderRadius: '4px',
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
                                    <XAxis dataKey="account_name" />
                                    <YAxis domain={[0, 100000]} />
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
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <TableSortLabel
                                                active={sortConfig.key === 'account_name'}
                                                direction={sortConfig.direction}
                                                onClick={() => requestSort('account_name')}
                                            >
                                                Lead Name
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                              }}
                                                active={sortConfig.key === 'opportunity_amount'}
                                                direction={sortConfig.direction}
                                                onClick={() => requestSort('opportunity_amount')}
                                            >
                                                Value
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                              }}
                                                active={sortConfig.key === 'probability'}
                                                direction={sortConfig.direction}
                                                onClick={() => requestSort('probability')}
                                            >
                                                Probability
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                              }}
                                                active={sortConfig.key === 'status'}
                                                direction={sortConfig.direction}
                                                onClick={() => requestSort('status')}
                                            >
                                                Status
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                              }}
                                                active={sortConfig.key === 'assigned_to.name'}
                                                direction={sortConfig.direction}
                                                onClick={() => requestSort('assigned_to.name')}
                                            >
                                                Assignee
                                            </TableSortLabel>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {newLeads.map((lead) => (
                                        <TableRow key={lead.id}>
                                            <TableCell>{lead.account_name}</TableCell>
                                            <TableCell>€{lead.opportunity_amount}</TableCell>
                                            <TableCell>
                                                <Box sx={{ width: '100%', position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={lead.probability}
                                                        style={{ width: '80%', marginRight: '8px', ...progressBarStyle}}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary"
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
                                            </TableCell>
                                            <TableCell>{lead.status}</TableCell>
                                            <TableCell>{lead.assigned_to?.name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
