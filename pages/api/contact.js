// pages/api/contact.js
import { Resend } from 'resend';
import PropTypes from 'prop-types';
const resend = new Resend(process.env.RESEND_API_KEY);

const EmailTemplate = ({ name, email, subject, category, message }) => {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#ffffff',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#E04F00',
        padding: '30px 20px',
        borderRadius: '8px 8px 0 0',
        textAlign: 'center',
        marginBottom: '30px',
      }}>
        <h1 style={{
          color: '#ffffff',
          margin: '0',
          fontSize: '24px',
          fontWeight: '600',
        }}>
          New Contact Form Submission
        </h1>
      </div>

      {/* Content */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '30px',
        borderRadius: '8px',
        marginBottom: '20px',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}>
          <thead>
            <tr>
              <th style={{
                textAlign: 'left',
                padding: '12px 0',
                borderBottom: '2px solid #e9ecef',
                color: '#495057',
              }}>
                Contact Details
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{
                padding: '12px 0',
                borderBottom: '1px solid #e9ecef',
              }}>
                <strong style={{ color: '#495057' }}>Name:</strong>
                <div style={{
                  color: '#212529',
                  marginTop: '4px',
                }}>
                  {name}
                </div>
              </td>
            </tr>
            <tr>
              <td style={{
                padding: '12px 0',
                borderBottom: '1px solid #e9ecef',
              }}>
                <strong style={{ color: '#495057' }}>Email:</strong>
                <div style={{
                  color: '#212529',
                  marginTop: '4px',
                }}>
                  <a href={`mailto:${email}`} style={{
                    color: '#E04F00',
                    textDecoration: 'none',
                  }}>
                    {email}
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{
                padding: '12px 0',
                borderBottom: '1px solid #e9ecef',
              }}>
                <strong style={{ color: '#495057' }}>Subject:</strong>
                <div style={{
                  color: '#212529',
                  marginTop: '4px',
                }}>
                  {subject}
                </div>
              </td>
            </tr>
            <tr>
              <td style={{
                padding: '12px 0',
                borderBottom: '1px solid #e9ecef',
              }}>
                <strong style={{ color: '#495057' }}>Category:</strong>
                <div style={{
                  color: '#212529',
                  marginTop: '4px',
                }}>
                  {category}
                </div>
              </td>
            </tr>
            <tr>
              <td style={{
                padding: '12px 0',
              }}>
                <strong style={{ color: '#495057' }}>Message:</strong>
                <div style={{
                  color: '#212529',
                  marginTop: '4px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                }}>
                  {message}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '20px',
        color: '#6c757d',
        fontSize: '14px',
        borderTop: '1px solid #e9ecef',
      }}>
        <p style={{ margin: '0 0 10px 0' }}>
          This is an automated message from Suchitra Foods Contact Form.
        </p>
        <div style={{
          marginTop: '20px',
          borderTop: '1px solid #e9ecef',
          paddingTop: '20px',
        }}>
          <p style={{
            margin: '10px 0 0 0',
            color: '#495057',
          }}>
            Suchitra Foods | Authentic Flavors of Andhra & Telangana
          </p>
          <p style={{
            margin: '5px 0 0 0',
            fontSize: '12px',
          }}>
            © {new Date().getFullYear()} Suchitra Foods. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
EmailTemplate.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, subject, category, message } = req.body;

    try {
      await resend.emails.send({
        from: 'connect@suchitrafoods.com',
        to: ['connect@suchitrafoods.com', email],
        subject: `New Contact Form Submission: ${subject}`,
        react: EmailTemplate({
          name,
          email,
          subject,
          category,
          message,
        }),
      });

      res
        .status(200)
        .json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
      console.error('Resend error:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to send message' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
