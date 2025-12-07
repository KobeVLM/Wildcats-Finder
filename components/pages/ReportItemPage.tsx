import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { ReportForm } from './ReportForm';
import type { Item } from './ItemCard';

interface ReportItemPageProps {
  onSubmit: (item: Omit<Item, 'id' | 'status' | 'reportedBy'>) => void;
  userEmail: string;
}

export function ReportItemPage({ onSubmit, userEmail }: ReportItemPageProps) {
  const [selectedType, setSelectedType] = useState<'lost' | 'found' | null>(null);

  if (selectedType) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowLeft size={16} />}
            onClick={() => setSelectedType(null)}
            variant="text"
            sx={{ color: 'primary.main' }}
          >
            Back to Type Selection
          </Button>
        </Box>
        <ReportForm type={selectedType} onSubmit={onSubmit} userEmail={userEmail} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 700 }}>
          Report an Item
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Help reunite Wildcats with their belongings. Choose the type of report below.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ maxWidth: 900, mx: 'auto' }}>
        {/* Lost Item Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              cursor: 'pointer',
              border: '2px solid transparent',
              transition: 'all 0.3s',
              '&:hover': {
                borderColor: '#dc2626',
                boxShadow: '0 8px 16px rgba(220, 38, 38, 0.2)',
                transform: 'translateY(-4px)',
              },
            }}
            onClick={() => setSelectedType('lost')}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'rgba(220, 38, 38, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <AlertCircle size={40} color="#dc2626" />
              </Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#dc2626' }}>
                Lost Item
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                Report an item you've lost on campus. Provide details to help others identify and return it to you.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'left' }}>
                <Typography variant="body2" color="text.secondary">
                  • Describe what you lost
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Where you lost it
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Add photos if available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Get notified of matches
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  mt: 3,
                  bgcolor: '#dc2626',
                  '&:hover': {
                    bgcolor: '#b91c1c',
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedType('lost');
                }}
              >
                Report Lost Item
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Found Item Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              cursor: 'pointer',
              border: '2px solid transparent',
              transition: 'all 0.3s',
              '&:hover': {
                borderColor: '#16a34a',
                boxShadow: '0 8px 16px rgba(22, 163, 74, 0.2)',
                transform: 'translateY(-4px)',
              },
            }}
            onClick={() => setSelectedType('found')}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'rgba(22, 163, 74, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <CheckCircle size={40} color="#16a34a" />
              </Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#16a34a' }}>
                Found Item
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                Report an item you've found on campus. Help reunite it with its rightful owner by providing details.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'left' }}>
                <Typography variant="body2" color="text.secondary">
                  • Describe what you found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Where you found it
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Add photos for verification
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Help others claim it
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  mt: 3,
                  bgcolor: '#16a34a',
                  '&:hover': {
                    bgcolor: '#15803d',
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedType('found');
                }}
              >
                Report Found Item
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Tips */}
      <Box sx={{ mt: 5, maxWidth: 900, mx: 'auto' }}>
        <Card sx={{ bgcolor: 'rgba(255, 215, 0, 0.05)', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              💡 Tips for Better Results
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Be Specific:</strong> Include brand names, colors, and unique features
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Add Photos:</strong> Clear images help verify ownership and increase matches
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Location Matters:</strong> Specify the exact building and area
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Check Regularly:</strong> Monitor for matches and respond quickly to claims
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
