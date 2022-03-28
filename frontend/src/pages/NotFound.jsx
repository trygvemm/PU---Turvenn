import { Grid } from '@mui/material';
import React from 'react';

function NotFound() {
  return (
    <main>
      <div>
        <Grid sx={{ mt: '15rem' }}>
          <h1 style={{ width: '100%', textAlign: 'center' }}>404</h1>
          <p style={{ width: '100%', textAlign: 'center' }}>Ops! Siden du ser etter finnes ikke.</p>
        </Grid>
      </div>
    </main>
  );
}

export default NotFound;
