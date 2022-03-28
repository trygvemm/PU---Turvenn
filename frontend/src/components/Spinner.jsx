import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import { Box } from '@mui/material';

function Spinner() {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '40px',
        marginBottom: '40px'
      }}
    >
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
          animationDuration: '550ms',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round'
          }
        }}
        size={40}
        thickness={4}
      />
    </Box>
  );
}

export default Spinner;
