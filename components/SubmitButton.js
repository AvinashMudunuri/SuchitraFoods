'use client';
import { Button } from '@mui/material';
import { useFormStatus } from 'react-dom';
import PropTypes from 'prop-types';

const SubmitButton = ({ children, ...props }) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? 'Loading...' : children}
    </Button>
  );
};

SubmitButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SubmitButton;
