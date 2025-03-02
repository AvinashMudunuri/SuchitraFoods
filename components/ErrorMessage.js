import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

const ErrorMessage = ({ error }) => {
  if (!error) return null;
  return (
    <Typography variant="body1" color="error">
      {error}
    </Typography>
  );
};

ErrorMessage.propTypes = {
  error: PropTypes.string,
};

export default ErrorMessage;
