import React, { useState } from "react";
import { SERVER, TeamsUrl } from "../../services/ApiUrls";

interface AddTeamMemberProps {
  open: boolean;
  onClose: () => void;
  teamId: string | null;
}

const AddTeamMember: React.FC<AddTeamMemberProps> = ({ open, onClose, teamId }) => {
  // State to hold user ID
  const [userId, setUserId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Function to handle the POST request to add a user to a team
  const handleAddUser = async () => {
    const token = localStorage.getItem('Token');
    const org = localStorage.getItem('org');

    if (!token || !org) {
      setError('Token or organization information is missing.');
      return;
    }

    if (!teamId || !userId) {
      setMessage("Team ID and User ID are required.");
      return;
    }

    try {
      const response = await fetch(`${SERVER}${TeamsUrl}${teamId}/user/${userId}/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
          org: org,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message || "An error occurred while adding the user.");
      }
    } catch (error) {
      setMessage("An error occurred while making the request.");
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Add User to Team</h1>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleAddUser}>Add User</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddTeamMember;
