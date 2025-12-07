import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import { ItemCard, type Item } from './ItemCard';
import { Search, TrendingUp } from 'lucide-react';

interface HomePageProps {
  items: Item[];
  onClaim: (item: Item) => void;
}

export function HomePage({ items, onClaim }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabValue = activeTab === 0 ? 'all' : activeTab === 1 ? 'lost' : 'found';

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = tabValue === 'all' || item.type === tabValue;
    return matchesSearch && matchesTab && item.status === 'active';
  });

  const stats = {
    total: items.filter((i) => i.status === 'active').length,
    lost: items.filter((i) => i.type === 'lost' && i.status === 'active').length,
    found: items.filter((i) => i.type === 'found' && i.status === 'active').length,
    claimed: items.filter((i) => i.status === 'claimed').length,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Hero Section */}
        <Paper
          elevation={3}
          sx={{
            background: 'linear-gradient(to right, #800020, rgba(128, 0, 32, 0.8))',
            color: 'white',
            p: 4,
            borderRadius: 3,
          }}
        >
          <Box sx={{ maxWidth: 768 }}>
            <Typography variant="h4" sx={{ mb: 1, color: 'white' }}>
              Welcome to Wildcats Finder
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.9)' }}>
              CIT-U's Lost & Found platform helping students reunite with their belongings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h5" sx={{ color: '#FFD700' }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Active Items
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h5" sx={{ color: 'white' }}>
                    {stats.lost}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Lost Items
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h5" sx={{ color: '#FFD700' }}>
                    {stats.found}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Found Items
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h5" sx={{ color: '#FFD700' }}>
                    {stats.claimed}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Reunited
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search for items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#737373" />
              </InputAdornment>
            ),
          }}
          sx={{
            bgcolor: 'white',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          }}
        />

        {/* Tabs */}
        <Box>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: 48,
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  All Items
                  <Chip label={stats.total} size="small" color="secondary" />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Lost
                  <Chip label={stats.lost} size="small" color="secondary" />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Found
                  <Chip label={stats.found} size="small" color="secondary" />
                </Box>
              }
            />
          </Tabs>

          <Box sx={{ mt: 3 }}>
            {filteredItems.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Box
                  sx={{
                    width: 96,
                    height: 96,
                    bgcolor: '#f8f8f8',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Search size={48} color="#737373" />
                </Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No items found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchQuery ? 'Try adjusting your search terms' : 'Be the first to report an item!'}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredItems.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <ItemCard item={item} onClaim={onClaim} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>

        {/* Quick Tips */}
        <Alert
          icon={<TrendingUp size={20} />}
          severity="info"
          sx={{
            bgcolor: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            '& .MuiAlert-icon': {
              color: 'primary.main',
            },
          }}
        >
          <Typography variant="h6" color="primary" gutterBottom>
            Tips for Better Results
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, color: 'text.secondary' }}>
            <li>Be as detailed as possible when reporting items</li>
            <li>Upload clear photos to increase chances of matching</li>
            <li>Check the app regularly for new matches</li>
            <li>Contact Security Office for high-value items</li>
          </Box>
        </Alert>
      </Box>
    </Container>
  );
}
