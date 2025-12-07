import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import { UserX, UserCheck, Trash2, AlertTriangle, Mail, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function UserManagement({
  users,
  items,
  claims,
  onSuspendUser,
  onUnsuspendUser,
  onDeleteUser,
  currentUserEmail,
}) {
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const getUserStats = (userEmail) => {
    const userItems = items.filter((item) => item.reportedBy === userEmail);
    const userClaims = claims.filter((claim) => claim.claimantEmail === userEmail);
    const rejectedClaims = userClaims.filter((claim) => claim.status === 'rejected');
    const approvedClaims = userClaims.filter((claim) => claim.status === 'approved');

    return {
      itemsReported: userItems.length,
      claimsMade: userClaims.length,
      claimsApproved: approvedClaims.length,
      claimsRejected: rejectedClaims.length,
      rejectionRate: userClaims.length > 0 ? (rejectedClaims.length / userClaims.length) * 100 : 0,
    };
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuspendClick = (user) => {
    setSelectedUser(user);
    setSuspensionReason('');
    setSuspendDialogOpen(true);
  };

  const handleSuspendConfirm = () => {
    if (selectedUser && suspensionReason.trim()) {
      onSuspendUser(selectedUser.email, suspensionReason);
      setSuspendDialogOpen(false);
      setSelectedUser(null);
      setSuspensionReason('');
    } else {
      toast.error('Please provide a suspension reason');
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      onDeleteUser(selectedUser.email);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDetailsDialogOpen(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        User Management
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, email, or student ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ p: 2, bgcolor: '#f0f9ff', borderRadius: 1, flex: 1, minWidth: 150 }}>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
              <Typography variant="h5" color="primary">
                {users.length}
              </Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: '#fef3c7', borderRadius: 1, flex: 1, minWidth: 150 }}>
              <Typography variant="body2" color="text.secondary">
                Suspended Users
              </Typography>
              <Typography variant="h5" sx={{ color: '#ea580c' }}>
                {users.filter((u) => u.suspended).length}
              </Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: '#dcfce7', borderRadius: 1, flex: 1, minWidth: 150 }}>
              <Typography variant="body2" color="text.secondary">
                Active Users
              </Typography>
              <Typography variant="h5" sx={{ color: '#16a34a' }}>
                {users.filter((u) => !u.suspended).length}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Alert severity="warning" sx={{ mb: 3 }}>
        <strong>Admin Guidance:</strong> Monitor users with high rejection rates (above 50%) - they may be making false claims. Consider suspending repeat offenders.
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell><strong>User</strong></TableCell>
              <TableCell><strong>Student ID</strong></TableCell>
              <TableCell align="center"><strong>Items</strong></TableCell>
              <TableCell align="center"><strong>Claims</strong></TableCell>
              <TableCell align="center"><strong>Approved</strong></TableCell>
              <TableCell align="center"><strong>Rejected</strong></TableCell>
              <TableCell align="center"><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No users found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const stats = getUserStats(user.email);
                const isCurrentUser = user.email === currentUserEmail;
                const isHighRisk = stats.rejectionRate > 50 && stats.claimsMade > 2;

                return (
                  <TableRow
                    key={user.email}
                    sx={{
                      bgcolor: user.suspended ? '#fee2e2' : isHighRisk ? '#fef3c7' : 'transparent',
                      '&:hover': { bgcolor: user.suspended ? '#fecaca' : isHighRisk ? '#fde68a' : '#f5f5f5' },
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{user.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                        {isHighRisk && (
                          <Box sx={{ mt: 0.5 }}>
                            <Chip
                              label="High Risk"
                              size="small"
                              color="warning"
                              icon={<AlertTriangle size={14} />}
                            />
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.studentId}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">{stats.itemsReported}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">{stats.claimsMade}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ color: '#16a34a' }}>
                        {stats.claimsApproved}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box>
                        <Typography variant="body2" sx={{ color: '#dc2626' }}>
                          {stats.claimsRejected}
                        </Typography>
                        {stats.claimsMade > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            ({stats.rejectionRate.toFixed(0)}%)
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {user.suspended ? (
                        <Tooltip title={user.suspensionReason || 'Suspended'}>
                          <Chip label="Suspended" size="small" color="error" />
                        </Tooltip>
                      ) : (
                        <Chip label="Active" size="small" color="success" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewDetails(user)}>
                            <TrendingUp size={18} />
                          </IconButton>
                        </Tooltip>
                        {!isCurrentUser && (
                          <>
                            {user.suspended ? (
                              <Tooltip title="Unsuspend User">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => onUnsuspendUser(user.email)}
                                >
                                  <UserCheck size={18} />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Suspend User">
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() => handleSuspendClick(user)}
                                >
                                  <UserX size={18} />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Delete User">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(user)}
                              >
                                <Trash2 size={18} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Suspend Dialog */}
      <Dialog open={suspendDialogOpen} onClose={() => setSuspendDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Suspend User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                You are about to suspend <strong>{selectedUser.name}</strong> ({selectedUser.email}).
                Suspended users cannot log in or access the system.
              </Alert>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Suspension Reason"
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="e.g., Multiple false claims detected. Violation of community guidelines."
                required
                helperText="This reason will be shown to the user"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuspendDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSuspendConfirm}
            variant="contained"
            color="warning"
            disabled={!suspensionReason.trim()}
          >
            Suspend User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Delete User Account</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Alert severity="error">
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Warning: This action cannot be undone!</strong>
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                You are about to permanently delete:
              </Typography>
              <Typography variant="body2">
                • User: <strong>{selectedUser.name}</strong> ({selectedUser.email})
              </Typography>
              <Typography variant="body2">
                • All items reported by this user
              </Typography>
              <Typography variant="body2">
                • All claims made by this user
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Permanently Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>User Activity Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedUser.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Mail size={16} color="#737373" />
                    <Typography variant="body2" color="text.secondary">
                      {selectedUser.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Student ID: {selectedUser.studentId}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={16} color="#737373" />
                    <Typography variant="body2" color="text.secondary">
                      Joined: {new Date(selectedUser.joinedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {selectedUser.suspended && selectedUser.suspensionReason && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    <strong>Suspended:</strong> {selectedUser.suspensionReason}
                  </Typography>
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                {(() => {
                  const stats = getUserStats(selectedUser.email);
                  return (
                    <>
                      <Box sx={{ p: 2, bgcolor: '#f0f9ff', borderRadius: 1, flex: 1, minWidth: 120 }}>
                        <Typography variant="body2" color="text.secondary">
                          Items Reported
                        </Typography>
                        <Typography variant="h6">{stats.itemsReported}</Typography>
                      </Box>
                      <Box sx={{ p: 2, bgcolor: '#f0f9ff', borderRadius: 1, flex: 1, minWidth: 120 }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Claims
                        </Typography>
                        <Typography variant="h6">{stats.claimsMade}</Typography>
                      </Box>
                      <Box sx={{ p: 2, bgcolor: '#dcfce7', borderRadius: 1, flex: 1, minWidth: 120 }}>
                        <Typography variant="body2" color="text.secondary">
                          Approved
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#16a34a' }}>
                          {stats.claimsApproved}
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2, bgcolor: '#fee2e2', borderRadius: 1, flex: 1, minWidth: 120 }}>
                        <Typography variant="body2" color="text.secondary">
                          Rejected
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#dc2626' }}>
                          {stats.claimsRejected}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: stats.rejectionRate > 50 ? '#fee2e2' : '#fef3c7',
                          borderRadius: 1,
                          flex: 1,
                          minWidth: 120,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Rejection Rate
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ color: stats.rejectionRate > 50 ? '#dc2626' : '#ea580c' }}
                        >
                          {stats.rejectionRate.toFixed(0)}%
                        </Typography>
                      </Box>
                    </>
                  );
                })()}
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {(() => {
                    const userItems = items
                      .filter((item) => item.reportedBy === selectedUser.email)
                      .slice(0, 3);
                    const userClaims = claims
                      .filter((claim) => claim.claimantEmail === selectedUser.email)
                      .slice(0, 3);

                    return (
                      <>
                        {userItems.length > 0 && (
                          <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Recent Items:</strong>
                            </Typography>
                            {userItems.map((item) => (
                              <Typography key={item.id} variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                                • {item.name} ({item.type}) - {item.status}
                              </Typography>
                            ))}
                          </Box>
                        )}
                        {userClaims.length > 0 && (
                          <Box>
                            <Typography variant="body2" sx={{ mb: 1, mt: 1 }}>
                              <strong>Recent Claims:</strong>
                            </Typography>
                            {userClaims.map((claim) => {
                              const item = items.find((i) => i.id === claim.itemId);
                              return (
                                <Typography key={claim.id} variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                                  • {item?.name || 'Unknown'} - {claim.status}
                                </Typography>
                              );
                            })}
                          </Box>
                        )}
                      </>
                    );
                  })()}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
