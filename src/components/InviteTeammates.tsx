import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { SelectChangeEvent } from '@mui/material'
import { InvitationUrl } from '../services/ApiUrls';
import { fetchData } from './FetchData';

interface Role {
  value: string;
  label: string;
}

interface Teammate {
  email: string;
  roles: string[];
}

interface InviteTeammatesProps {
  // Add any additional props you might need for the component
}

const InviteTeammates: React.FC<InviteTeammatesProps> = () => {
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([
    { value: 'ADMIN', label: 'Admin' },
    { value: 'USER', label: 'User' },
  ]);

  const [isSent, setIsSent] = useState(false)

  const handleAddTeammate = () => {
    setTeammates([...teammates, { email: '', roles: ['USER'] }]);
  };

/*  const handleEmailChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target instanceof HTMLInputElement) {
      // Handle input element event (update email)
    } else if (event.target instanceof HTMLTextAreaElement) {
      // Handle textarea element event (might not be relevant for email)
    }
  }; */

  const handleRoleChange = (index: number, event: SelectChangeEvent<string[]>) => {
      const updatedRoles = Array.isArray(event.target.value) ? event.target.value : [event.target.value]; // Ensure roles is always an array
      setTeammates(
        teammates.map((teammate, i) => (i === index ? { ...teammate, roles: updatedRoles } : teammate))
      );
  };

  let token = localStorage.getItem('Token')?.split(' ')[1]
  
  useEffect(() => {
    const invitation = () => {
      for (let i = 0; i < teammates.length; i++) {
        if (teammates[i].email) {
          console.log(teammates[i])
          const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
          const Body = {
            org: localStorage.getItem('org'),
            role: teammates[i].roles[0],
            inviter: localStorage.getItem('current_user_id'),
            invitee_email: teammates[i].email
          }
  
          fetchData(`${InvitationUrl}`, 'POST', JSON.stringify(Body), Header)
            .then((res: any) => {
              console.log(res, 'res');
              if (!res.error) {
                const data = res?.data
  
              }
            })
        }
      }
    }
    invitation();
    setTeammates([]); // Clear teammates list after sending
  }, [isSent])

  const handleSendInvitations = async () => {
    // Implement logic to send invitations to email addresses with selected roles
    // This might involve sending emails or API calls to your backend
    console.log('Sending invitations:', teammates);
    setIsSent(!isSent)
  };

  return (
    <div className='invitationForm'>
      <h2>Invite Teammates</h2>
      {teammates.map((teammate, index) => (
        <div key={index}>
          <TextField
            label="Email Address"
            onChange={(event) => teammate.email = event.target.value}
            size='small'
            sx={{ minWidth: '80px', width: '20%', margin: '2px' }}
          />
          <Select
            labelId={`role-select-label-${index}`}
            id={`role-select-${index}`}
            value={teammate.roles}
            label="Select Role"
            onChange={(event) => handleRoleChange(index, event)}
            size='small'
            sx={{ width: '10%', maxWidth: '100px', minWidth: '50px', margin: '2px' }}
          >
            {availableRoles.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </Select>
        </div>
      ))}
      <IconButton onClick={handleAddTeammate}>
        <AddIcon />
      </IconButton>
      <Button variant="contained" onClick={handleSendInvitations} disabled={teammates.length === 0}>
        Send Invitations
      </Button>
    </div>
  );
};

export default InviteTeammates;

