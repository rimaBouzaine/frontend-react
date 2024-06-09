import React from 'react';
import { Box, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      pt={40} /* Added padding-top to create space for background */
      position="relative"
    >
      {/* Background Image */}
      <Box
        position="absolute"
        top={150}
        left={0}
        width="100%"
        height="100%"
        zIndex={-1} /* Ensure the background stays behind */
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/proxym.png)`,
          backgroundSize: 'cover',
          opacity: 0.5, /* Adjust the opacity as needed */
          filter: 'blur(3px)', /* Optional: Apply blur effect */
        }}
      />
      
      {/* Overlay Text */}
      <Box
        position="absolute"
        top={40} /* Adjust top position as needed */
        left={20} /* Adjust left position as needed */
        width="calc(100% - 40px)" /* Adjust width to leave space for text */
        zIndex={1} /* Ensure the text stays above */
        textAlign="left" /* Align text to left */
      >
        <Typography variant="h3" component="h1" className="font-bold text-black">
          Welcome to dashboard
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;