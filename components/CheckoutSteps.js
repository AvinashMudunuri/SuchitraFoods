import React from 'react';
import { Stepper, Step, StepLabel, Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';

const CheckoutSteps = ({ activeStep }) => {
  const steps = [
    'Contact Info',
    'Shipping Address',
    'Payment Method',
    'Order Summary',
  ];

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Checkout Process
      </Typography>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          '& .MuiStepLabel-label': {
            fontSize: '1rem',
          },
          '& .MuiStepIcon-root': {
            color: (theme) =>
              activeStep > steps.length ? theme.palette.success.main : '',
          },
          '& .MuiStepLabel-root.Mui-active .MuiStepLabel-label': {
            fontWeight: 'bold',
            color: (theme) => theme.palette.primary.main,
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

CheckoutSteps.propTypes = {
  activeStep: PropTypes.number.isRequired,
};

export default CheckoutSteps;
