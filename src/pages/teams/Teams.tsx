import React, { useState, useEffect } from 'react';
import {
  Typography,
  CircularProgress,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SERVER, TeamsUrl } from '../../services/ApiUrls';
import PersonIcon from '@mui/icons-material/Person';

interface UserDetails {
  email: string;
  first_name: string;
  profile_pic: string | null;
  last_name: string;
}

interface User {
  is_active: boolean;
  user_details: UserDetails;
  workload: string; // Add the workload property here
  expertise: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  users: User[];
  created_at: string;
  created_by: User;
  created_on_arrow: string;
}

const GetTeams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem('Token');
      const org = localStorage.getItem('org');

      if (!token || !org) {
        setError('Token or organization information is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${SERVER}${TeamsUrl}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
            org: org,
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching teams: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data);
        setTeams(data.teams);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box mt={4}>
      {teams.map((team) => (
        <Paper
          key={team.id}
          elevation={0}
          style={{
            padding: '15px',
            marginBottom: '16px',
            marginLeft: '24px',
            marginRight: '24px',
          }}
        >
          <Typography variant="h5" gutterBottom>
            {team.name}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Description: {team.description}
          </Typography>
          <Divider style={{ margin: '16px 0' }} />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>
                    Email Address
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>
                    Team member
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>
                    User's status
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Workload</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>
                    Expertise
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {team.users.length > 0 ? (
                  team.users.map((user, userIndex) => (
                    <TableRow key={userIndex}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={user.user_details.profile_pic || ''}
                            style={{ marginRight: '10px' }}
                          >
                            {!user.user_details.profile_pic && <PersonIcon />}
                          </Avatar>
                          {user.user_details.email}
                        </Box>
                      </TableCell>
                      <TableCell>{`${user.user_details.first_name} ${user.user_details.last_name}`}</TableCell>
                      <TableCell>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </TableCell>
                      <TableCell>{user.workload}</TableCell>
                      <TableCell>{user.expertise}</TableCell>
                      <TableCell>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="body2">
                        No users in this team.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ))}
    </Box>
  );
};

export default GetTeams;
