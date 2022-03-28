import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { Box, Tooltip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';

function Username({ user }) {
  return (
    <Box style={{ display: 'flex', alignItems: 'center' }}>
      <b>
        {user.firstName} {user.lastName}&nbsp;
      </b>
      {user.role === 'admin' && (
        <Tooltip title="admin" arrow>
          <AdminPanelSettingsOutlinedIcon />
        </Tooltip>
      )}
      {user.role === 'commercial' && (
        <Tooltip title="Commercial" arrow>
          <VerifiedIcon />
        </Tooltip>
      )}
    </Box>
  );
}

export default Username;
