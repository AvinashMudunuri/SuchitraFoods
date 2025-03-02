import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Link
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';

const ContactUs = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const [status, setStatus] = useState('');
  // Categories for the dropdown
  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'international', label: 'International order' },
    { value: 'bulk', label: 'Bulk order' },
    { value: 'orderStatus', label: 'Order Status' },
    { value: 'other', label: 'Other' },
  ];

  const onSubmit = async (data) => {
    console.log(data);
    setStatus('Sending...');

    try {
      const response = await axios.post('/api/contact', data);
      if (response.data.success) {
        setStatus('Message sent successfully!');
      } else {
        setStatus('Failed to send message.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('Failed to send message.');
    }
  };
  return (
    <>
      <Head>
        <title> Contact Us | Suchitra Foods</title>
        <meta name="description" content={`Suchitra Foods Contact Us`} />
        <meta property="og:title" content={`Contact Us | Suchitra Foods`} />
        <meta property="og:description" content={`Suchitra Foods Contact Us`} />
        <meta
          property="og:url"
          content={`https://www.suchitrafoods.com/contact-us`}
        />
      </Head>
      <Box
        sx={{
          display: 'flex',
          p: 3,
          maxWidth: 1200,
          mx: 'auto',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Sidebar with Contact Information */}
        <Box sx={{ width: 300, mr: 4 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Contact Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            <List>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Phone" secondary={<Link target="_blank" href="tel:+917331130990">+91 73311 30990</Link>} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <WhatsAppIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="WhatsApp" secondary={<Link target="_blank" href="https://wa.me/917331130990">+91 73311 30990</Link>} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={<Link target="_blank" href="mailto:connect@suchitrafoods.com">connect@suchitrafoods.com</Link>}
                />
              </ListItem>
              {/* <ListItem>
                <ListItemIcon>
                  <LocationOnIcon color="error" />
                </ListItemIcon>
                <ListItemText
                  primary="Address"
                  secondary="123 Spice Street, Hyderabad, Telangana, India"
                />
              </ListItem> */}
            </List>
          </Paper>
        </Box>

        {/* Main Contact Form or Information Section */}
        <Box sx={{ flexGrow: 1, mt: { xs: 4, md: 0 } }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Get in Touch
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We know value of customers and always love hearing from you. Feel
            free to give us a call or fill out the Inquiry form below, and we
            will get your question answered as soon as possible
          </Typography>

          {/* Placeholder for Contact Form or Other Content */}
          <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contact Form
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Name Field */}
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Name is required',
                  minLength: {
                    value: 3,
                    message: 'Name should be at least 3 characters long',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                  />
                )}
              />

              {/* Email Field */}
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/,
                    message: 'Invalid email format',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ''}
                  />
                )}
              />

              {/* Subject Field */}
              <Controller
                name="subject"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Subject is required',
                  minLength: {
                    value: 5,
                    message: 'Subject should be at least 5 characters long',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Subject"
                    fullWidth
                    margin="normal"
                    error={!!errors.subject}
                    helperText={errors.subject ? errors.subject.message : ''}
                  />
                )}
              />

              {/* Category Dropdown */}
              <Controller
                name="category"
                control={control}
                defaultValue=""
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Category"
                    select
                    fullWidth
                    margin="normal"
                    error={!!errors.category}
                    helperText={errors.category ? errors.category.message : ''}
                  >
                    {categories.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              {/* Message Field */}
              <Controller
                name="message"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Message is required',
                  minLength: {
                    value: 10,
                    message: 'Message should be at least 10 characters long',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Message"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    error={!!errors.message}
                    helperText={errors.message ? errors.message.message : ''}
                  />
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
            </form>
            {status && <Typography>{status}</Typography>}
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default ContactUs;
