import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Badge from "@mui/material/Badge";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { ItemCard } from "./ItemCard";
import {
  User,
  Mail,
  Shield,
  Bell,
  History,
  LogOut,
  Edit,
  Trash2,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ProfilePage({
  userEmail,
  userRole,
  items,
  notifications,
  onClaim,
  onLogout,
  onPasswordChange,
  onDeleteAccount,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const userItems = items.filter((item) => item.reportedBy === userEmail);
  const myReports = userItems.filter((item) => item.status === "active");
  const myClaimed = userItems.filter((item) => item.status === "claimed");
  const myPending = userItems.filter((item) => item.status === "pending");

  const unreadNotifications = notifications.filter((n) => !n.read);

  const handlePasswordChange = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (onPasswordChange) {
      onPasswordChange(oldPassword, newPassword);
      setEditDialogOpen(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully");
    }
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText.toLowerCase() !== "delete my account") {
      toast.error('Please type "delete my account" to confirm');
      return;
    }

    if (onDeleteAccount) {
      onDeleteAccount();
      toast.success("Account deleted successfully");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Profile Header */}
        <Card>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    background:
                      "linear-gradient(135deg, #800020 0%, rgba(128, 0, 32, 0.8) 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User size={32} color="white" />
                </Box>
                <Box>
                  <Typography variant="h5" color="primary" gutterBottom>
                    {userEmail.split("@")[0]}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Mail size={16} color="#737373" />
                    <Typography variant="body2" color="text.secondary">
                      {userEmail}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {userRole === "admin" ? (
                      <>
                        <Shield size={16} color="#800020" />
                        <Chip
                          label="Administrator"
                          color="primary"
                          size="small"
                        />
                      </>
                    ) : (
                      <>
                        <User size={16} color="#737373" />
                        <Chip label="Student" color="secondary" size="small" />
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  color="primary"
                  onClick={() => setEditDialogOpen(true)}
                  sx={{ border: "1px solid #e5e5e5" }}
                >
                  <Settings size={20} />
                </IconButton>
                <Button
                  variant="outlined"
                  startIcon={<LogOut size={16} />}
                  onClick={onLogout}
                >
                  Logout
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={4}>
                <Box
                  sx={{
                    bgcolor: "rgba(248, 248, 248, 0.5)",
                    borderRadius: 2,
                    p: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h5" color="primary">
                    {myReports.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Reports
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box
                  sx={{
                    bgcolor: "rgba(248, 248, 248, 0.5)",
                    borderRadius: 2,
                    p: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h5" color="secondary">
                    {myClaimed.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Claimed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box
                  sx={{
                    bgcolor: "rgba(248, 248, 248, 0.5)",
                    borderRadius: 2,
                    p: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h5" color="primary">
                    {myPending.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Notifications */}
        {unreadNotifications.length > 0 && (
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Bell size={20} color="#800020" />
                <Typography variant="h6">Notifications</Typography>
                <Badge
                  badgeContent={unreadNotifications.length}
                  color="error"
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {unreadNotifications.slice(0, 3).map((notification) => (
                  <Alert key={notification.id} severity="info">
                    <Box>
                      <Typography variant="body2">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notification.date).toLocaleString()}
                      </Typography>
                    </Box>
                  </Alert>
                ))}
                {unreadNotifications.length > 3 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                  >
                    +{unreadNotifications.length - 3} more notifications
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* My Reports */}
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <History size={20} color="#800020" />
              <Typography variant="h6">My Reports</Typography>
            </Box>

            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Active
                    <Chip
                      label={myReports.length}
                      size="small"
                      color="secondary"
                    />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Pending
                    <Chip
                      label={myPending.length}
                      size="small"
                      color="secondary"
                    />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    Claimed
                    <Chip
                      label={myClaimed.length}
                      size="small"
                      color="secondary"
                    />
                  </Box>
                }
              />
            </Tabs>

            <Box sx={{ mt: 3 }}>
              {activeTab === 0 && (
                <>
                  {myReports.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        No active reports
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {myReports.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                          <ItemCard
                            item={item}
                            onClaim={onClaim}
                            showClaimButton={false}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </>
              )}

              {activeTab === 1 && (
                <>
                  {myPending.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        No pending claims
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {myPending.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                          <ItemCard
                            item={item}
                            onClaim={onClaim}
                            showClaimButton={false}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </>
              )}

              {activeTab === 2 && (
                <>
                  {myClaimed.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        No claimed items yet
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {myClaimed.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                          <ItemCard
                            item={item}
                            onClaim={onClaim}
                            showClaimButton={false}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Settings size={24} color="#800020" />
            <Typography variant="h6">Account Settings</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
            {/* Account Info */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mb: 2, color: "#800020" }}
              >
                Account Information
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Mail size={16} color="#737373" />
                  <Typography variant="body2" color="text.secondary">
                    Email: <strong>{userEmail}</strong>
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Shield size={16} color="#737373" />
                  <Typography variant="body2" color="text.secondary">
                    Role:{" "}
                    <strong>
                      {userRole === "admin" ? "Administrator" : "Student"}
                    </strong>
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider />

            {/* Change Password */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mb: 2, color: "#800020" }}
              >
                Change Password
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Current Password"
                  type="password"
                  fullWidth
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  size="small"
                />
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  size="small"
                  helperText="Must be at least 6 characters"
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={handlePasswordChange}
                  startIcon={<Edit size={16} />}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Update Password
                </Button>
              </Box>
            </Box>

            <Divider />

            {/* Delete Account */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mb: 1, color: "#dc2626" }}
              >
                Danger Zone
              </Typography>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Deleting your account is permanent and cannot be undone. All
                your reports and data will be lost.
              </Alert>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Trash2 size={16} />}
                onClick={() => {
                  setEditDialogOpen(false);
                  setDeleteDialogOpen(true);
                }}
              >
                Delete Account
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AlertTriangle size={24} color="#dc2626" />
            <Typography variant="h6" color="error">
              Delete Account
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <Alert severity="error">
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Warning: This action is irreversible!
              </Typography>
              <Typography variant="body2">
                • All your reported items will be deleted
                <br />
                • Your account information will be permanently removed
                <br />• You will lose access to all notifications and claims
              </Typography>
            </Alert>

            <Typography variant="body2" color="text.secondary">
              To confirm deletion, please type{" "}
              <strong>"delete my account"</strong> below:
            </Typography>

            <TextField
              fullWidth
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type: delete my account"
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setDeleteConfirmText("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
            disabled={deleteConfirmText.toLowerCase() !== "delete my account"}
          >
            Delete Account Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
