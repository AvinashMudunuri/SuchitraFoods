import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

const SuccessMessage = ({ success }) => {
  if (!success) return null;
  return (
    <Typography variant="body1" color="success">
      {success}
    </Typography>
  );
};

SuccessMessage.propTypes = {
  success: PropTypes.string,
};

export default SuccessMessage;
