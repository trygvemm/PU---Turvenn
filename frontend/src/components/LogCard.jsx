import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import Moment from 'react-moment';
import Username from './Username';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%'
});

export default function LogCard({ id, text, imageUrl, user, createdAt }) {
  const navigate = useNavigate();

  return (
    <Paper
      sx={{
        width: '100%',
        margin: 2,
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        ':hover': {
          boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.75)'
        },
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff')
      }}
    >
      <Grid
        sx={{ width: '100%', margin: '10px', cursor: 'pointer' }}
        onClick={() => navigate(`/users/${user.id}`)}
      >
        <Username user={user} />
        <Typography
          sx={{ display: 'inline', fontSize: 12, color: '#b5b5b5', marginLeft: '5px' }}
          variant="p"
        >
          <Moment format="Do MMMM YYYY, HH:mm">{createdAt}</Moment>
        </Typography>
      </Grid>
      <Grid sx={{ width: '100%', margin: '10px' }}>
        <Typography variant="body2" gutterBottom>
          {text}
        </Typography>
      </Grid>
      <Divider sx={{ width: '100%' }} />
      {imageUrl && (
        <Grid sx={{ width: '100%', marginLeft: '50px', marginRight: '50px', marginBottom: '20px' }}>
          <ButtonBase sx={{ width: '100%' }}>
            <Img
              alt="turbilde"
              src={`http://localhost:4000/uploads/${imageUrl}`}
              sx={{
                maxWidth: '100%',
                maxHeight: '500px',
                objectFit: 'scale-down',
                borderRadius: '10px'
              }}
            />
          </ButtonBase>
        </Grid>
      )}
    </Paper>
  );
}
