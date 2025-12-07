import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { ItemCard } from '../../components/common/ItemCard';
import UserManagement from './UserManagement';
import { Shield, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function Admin() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [action, setAction] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Mock data - replace with actual API calls
  const currentUserEmail = localStorage.getItem('userEmail') || 'admin@cit.edu';
  const items = []; // TODO: Fetch from API
  const users = []; // TODO: Fetch from API
  const claims = []; // TODO: Fetch from API

  const pendingItems = items.filter((item) => item.status === 'pending');
  const activeItems = items.filter((item) => item.status === 'active');
  const claimedItems = items.filter((item) => item.status === 'claimed');

  const stats = {
    total: items.length,
    pending: pendingItems.length,
    active: activeItems.length,
    claimed: claimedItems.length,
    lost: items.filter((i) => i.type === 'lost').length,
    found: items.filter((i) => i.type === 'found').length,
  };

  const handleAction = (item, actionType) => {
    setSelectedItem(item);
    setAction(actionType);
  };

  const confirmAction = () => {
    if (!selectedItem || !action) return;

    switch (action) {
      case 'approve':
        console.log('Approving item:', selectedItem.id);
        toast.success('Item approved successfully!');
        break;
      case 'reject':
        console.log('Rejecting item:', selectedItem.id);
        toast.success('Item rejected');
        break;
      case 'delete':
        console.log('Deleting item:', selectedItem.id);
        toast.success('Item deleted');
        break;
      default:
        break;
    }

    setSelectedItem(null);
    setAction(null);
  };

  const handleSuspendUser = (email, reason) => {
    console.log('Suspending user:', email, reason);
    toast.success('User suspended');
  };

  const handleUnsuspendUser = (email) => {
    console.log('Unsuspending user:', email);
    toast.success('User unsuspended');
  };

  const handleDeleteUser = (email) => {
    console.log('Deleting user:', email);
    toast.success('User deleted');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Admin Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={24} color="white" />
          </Box>
          <Box>
            <Typography variant="h4" color="primary">
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Moderate and manage lost & found items
            </Typography>
          </Box>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="primary">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Items
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: '#f59e0b' }}>
                  {stats.pending}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: '#16a34a' }}>
                  {stats.active}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: '#3b82f6' }}>
                  {stats.claimed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Claimed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="error">
                  {stats.lost}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lost
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="secondary">
                  {stats.found}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Found
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Pending Review Alert */}
        {pendingItems.length > 0 && (
          <Alert
            icon={<Clock size={20} />}
            severity="warning"
            sx={{
              bgcolor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
            }}
          >
            You have {pendingItems.length} {pendingItems.length === 1 ? 'item' : 'items'} awaiting review
          </Alert>
        )}

        {/* Items Management */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Manage Items
            </Typography>

            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Pending
                    <Chip label={pendingItems.length} size="small" color="secondary" />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Active
                    <Chip label={activeItems.length} size="small" color="secondary" />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Claimed
                    <Chip label={claimedItems.length} size="small" color="secondary" />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Users size={16} />
                    Users
                    <Chip label={users.length} size="small" color="secondary" />
                  </Box>
                }
              />
            </Tabs>

            <Box sx={{ mt: 3 }}>
              {activeTab === 0 && (
                <>
                  {pendingItems.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <CheckCircle size={48} color="#737373" style={{ marginBottom: 16 }} />
                      <Typography variant="body1" color="text.secondary">
                        No pending items to review
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {pendingItems.map((item) => (
                        <Card key={item.id} variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                              <Box
                                sx={{
                                  flexShrink: 0,
                                  width: 128,
                                  height: 128,
                                  bgcolor: '#f8f8f8',
                                  borderRadius: 2,
                                  overflow: 'hidden',
                                }}
                              >
                                {item.imageUrl ? (
                                  <Box component="img" src={item.imageUrl} alt={item.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>📦</Box>
                                )}
                              </Box>
                              <Box sx={{ flexGrow: 1 }}>
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="h6" color="primary">
                                    {item.name}
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <Chip label={item.type} size="small" sx={{ bgcolor: item.type === 'lost' ? 'error.main' : 'success.main', color: 'white' }} />
                                    <Chip label={item.category} size="small" variant="outlined" />
                                  </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  {item.description}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
                                  <Typography variant="body2">
                                    <strong>Location:</strong> {item.location}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Reported by:</strong> {item.reportedBy}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Button
                                    onClick={() => handleAction(item, 'approve')}
                                    variant="contained"
                                    startIcon={<CheckCircle size={16} />}
                                    sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}
                                  >
                                    Approve
                                  </Button>
                                  <Button onClick={() => handleAction(item, 'reject')} variant="contained" color="error" startIcon={<XCircle size={16} />}>
                                    Reject
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </>
              )}

              {activeTab === 1 && (
                <>
                  {activeItems.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        No active items
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {activeItems.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                          <Box sx={{ position: 'relative' }}>
                            <ItemCard item={item} onClaim={() => {}} showClaimButton={false} />
                            <Button
                              onClick={() => handleAction(item, 'delete')}
                              variant="contained"
                              color="error"
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                              }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </>
              )}

              {activeTab === 2 && (
                <>
                  {claimedItems.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        No claimed items
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {claimedItems.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                          <ItemCard item={item} onClaim={() => {}} showClaimButton={false} />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </>
              )}

              {activeTab === 3 && (
                <Box sx={{ mt: -3, mx: -3 }}>
                  <UserManagement
                    users={users}
                    items={items}
                    claims={claims}
                    onSuspendUser={handleSuspendUser}
                    onUnsuspendUser={handleUnsuspendUser}
                    onDeleteUser={handleDeleteUser}
                    currentUserEmail={currentUserEmail}
                  />
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog
          open={!!selectedItem && !!action}
          onClose={() => {
            setSelectedItem(null);
            setAction(null);
          }}
        >
          <DialogTitle>
            {action === 'approve' && 'Approve Item?'}
            {action === 'reject' && 'Reject Item?'}
            {action === 'delete' && 'Delete Item?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {action === 'approve' && 'This item will be published and visible to all users.'}
              {action === 'reject' && 'This item will be rejected and the reporter will be notified.'}
              {action === 'delete' && 'This action cannot be undone. The item will be permanently deleted.'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setSelectedItem(null);
                setAction(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              variant="contained"
              color={action === 'delete' ? 'error' : action === 'approve' ? 'success' : 'primary'}
              autoFocus
            >
              {action === 'approve' && 'Approve'}
              {action === 'reject' && 'Reject'}
              {action === 'delete' && 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
