import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import {
  Calendar,
  MapPin,
  User as UserIcon,
  Package,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Item } from "./ItemCard";

export function ClaimManagementPage({
  userEmail,
  items,
  claims,
  onApproveClaim,
  onRejectClaim,
  onMarkAsReturned,
}) {
  const [tabValue, setTabValue] = useState(0);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter user's items that have claims
  const myItemsWithClaims = items.filter(
    (item) =>
      item.reportedBy === userEmail &&
      claims.some((claim) => claim.itemId === item.id)
  );

  // Filter claims on user's items
  const claimsOnMyItems = claims.filter((claim) =>
    items.some(
      (item) => item.id === claim.itemId && item.reportedBy === userEmail
    )
  );

  // Filter user's own claims
  const myOwnClaims = claims.filter(
    (claim) => claim.claimantEmail === userEmail
  );

  const pendingClaims = claimsOnMyItems.filter((c) => c.status === "pending");
  const approvedClaims = claimsOnMyItems.filter((c) => c.status === "approved");
  const rejectedClaims = claimsOnMyItems.filter((c) => c.status === "rejected");

  const getItemById = (itemId) => items.find((item) => item.id === itemId);

  const handleRejectClick = (claim) => {
    setSelectedClaim(claim);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (selectedClaim && rejectionReason.trim()) {
      onRejectClaim(selectedClaim.id, rejectionReason);
      setRejectDialogOpen(false);
      setSelectedClaim(null);
      setRejectionReason("");
    }
  };

  const handleViewDetails = (claim) => {
    const item = getItemById(claim.itemId);
    setSelectedItem(item || null);
    setSelectedClaim(claim);
    setDetailsDialogOpen(true);
  };

  const renderClaimCard = (claim, showActions = true) => {
    const item = getItemById(claim.itemId);
    if (!item) return null;

    return (
      <Card key={claim.id} sx={{ mb: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                {item.name}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
                <Chip
                  label={item.type === "lost" ? "Lost" : "Found"}
                  size="small"
                  sx={{
                    bgcolor:
                      item.type === "lost" ? "error.main" : "success.main",
                    color: "white",
                  }}
                />
                <Chip
                  label={claim.status}
                  size="small"
                  color={
                    claim.status === "approved"
                      ? "success"
                      : claim.status === "rejected"
                      ? "error"
                      : "warning"
                  }
                  sx={{ textTransform: "capitalize" }}
                />
              </Box>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <UserIcon size={16} color="#737373" />
                <Typography variant="body2" color="text.secondary">
                  Claimant: {claim.claimantName}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Mail size={16} color="#737373" />
                <Typography variant="body2" color="text.secondary">
                  {claim.claimantEmail}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Clock size={16} color="#737373" />
                <Typography variant="body2" color="text.secondary">
                  Claimed: {new Date(claim.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Package size={16} color="#737373" />
                <Typography variant="body2" color="text.secondary">
                  {item.category}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <MapPin size={16} color="#737373" />
                <Typography variant="body2" color="text.secondary">
                  {item.location}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone size={16} color="#737373" />
                <Typography variant="body2" color="text.secondary">
                  {claim.contactInfo}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Verification Answer:</strong>
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              "{claim.answer}"
            </Typography>
          </Box>

          {claim.status === "rejected" && claim.rejectionReason && (
            <Box sx={{ mb: 2, p: 2, bgcolor: "#fee2e2", borderRadius: 1 }}>
              <Typography variant="body2" sx={{ color: "#dc2626" }}>
                <strong>Rejection Reason:</strong> {claim.rejectionReason}
              </Typography>
            </Box>
          )}

          {claim.status === "approved" && (
            <Box sx={{ mb: 2, p: 2, bgcolor: "#dcfce7", borderRadius: 1 }}>
              <Typography variant="body2" sx={{ color: "#16a34a" }}>
                <strong>Status:</strong> Claim approved! Contact the claimant to
                arrange item return.
              </Typography>
            </Box>
          )}

          {showActions && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleViewDetails(claim)}
                startIcon={<MessageCircle size={16} />}
              >
                View Details
              </Button>
              {claim.status === "pending" && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => onApproveClaim(claim.id)}
                    startIcon={<CheckCircle size={16} />}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleRejectClick(claim)}
                    startIcon={<XCircle size={16} />}
                  >
                    Reject
                  </Button>
                </>
              )}
              {claim.status === "approved" && item.status !== "claimed" && (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => onMarkAsReturned(item.id)}
                >
                  Mark as Returned
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderMyOwnClaimCard = (claim) => {
    const item = getItemById(claim.itemId);
    if (!item) return null;

    return (
      <Card key={claim.id} sx={{ mb: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                {item.name}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
                <Chip
                  label={item.type === "lost" ? "Lost" : "Found"}
                  size="small"
                  sx={{
                    bgcolor:
                      item.type === "lost" ? "error.main" : "success.main",
                    color: "white",
                  }}
                />
                <Chip
                  label={claim.status}
                  size="small"
                  color={
                    claim.status === "approved"
                      ? "success"
                      : claim.status === "rejected"
                      ? "error"
                      : "warning"
                  }
                  sx={{ textTransform: "capitalize" }}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <UserIcon size={16} color="#737373" />
              <Typography variant="body2" color="text.secondary">
                Owner: {item.reportedBy.split("@")[0]}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Clock size={16} color="#737373" />
              <Typography variant="body2" color="text.secondary">
                Claimed on: {new Date(claim.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          {claim.status === "approved" && (
            <Box sx={{ p: 2, bgcolor: "#dcfce7", borderRadius: 1 }}>
              <Typography variant="body2" sx={{ color: "#16a34a", mb: 1 }}>
                <strong>Your claim has been approved!</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Contact the owner at: <strong>{item.reportedBy}</strong>
              </Typography>
            </Box>
          )}

          {claim.status === "rejected" && claim.rejectionReason && (
            <Box sx={{ p: 2, bgcolor: "#fee2e2", borderRadius: 1 }}>
              <Typography variant="body2" sx={{ color: "#dc2626", mb: 1 }}>
                <strong>Your claim was rejected</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reason: {claim.rejectionReason}
              </Typography>
            </Box>
          )}

          {claim.status === "pending" && (
            <Box sx={{ p: 2, bgcolor: "#fef3c7", borderRadius: 1 }}>
              <Typography variant="body2" sx={{ color: "#92400e" }}>
                <strong>Pending Review:</strong> Waiting for owner's approval
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Claim Management
      </Typography>

      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              Claims on My Items
              {pendingClaims.length > 0 && (
                <Chip
                  label={pendingClaims.length}
                  size="small"
                  color="warning"
                />
              )}
            </Box>
          }
        />
        <Tab label="My Claims" />
      </Tabs>

      {tabValue === 0 && (
        <Box>
          {claimsOnMyItems.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: "center", py: 6 }}>
                <Typography color="text.secondary">
                  No claims received yet
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <>
              {pendingClaims.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Clock size={20} />
                    Pending Claims ({pendingClaims.length})
                  </Typography>
                  {pendingClaims.map((claim) => renderClaimCard(claim))}
                </Box>
              )}

              {approvedClaims.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <CheckCircle size={20} />
                    Approved Claims ({approvedClaims.length})
                  </Typography>
                  {approvedClaims.map((claim) => renderClaimCard(claim))}
                </Box>
              )}

              {rejectedClaims.length > 0 && (
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <XCircle size={20} />
                    Rejected Claims ({rejectedClaims.length})
                  </Typography>
                  {rejectedClaims.map((claim) => renderClaimCard(claim, false))}
                </Box>
              )}
            </>
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          {myOwnClaims.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: "center", py: 6 }}>
                <Typography color="text.secondary">
                  You haven't claimed any items yet
                </Typography>
              </CardContent>
            </Card>
          ) : (
            myOwnClaims.map((claim) => renderMyOwnClaimCard(claim))
          )}
        </Box>
      )}

      {/* Rejection Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Claim</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this claim. This will help the
            claimant understand why their claim was not approved.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g., The verification answer doesn't match our records..."
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRejectConfirm}
            variant="contained"
            color="error"
            disabled={!rejectionReason.trim()}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Claim Details</DialogTitle>
        <DialogContent>
          {selectedItem && selectedClaim && (
            <Box>
              <Typography variant="h6" color="primary" gutterBottom>
                {selectedItem.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedItem.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Category:</strong> {selectedItem.category}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Location:</strong> {selectedItem.location}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedItem.date).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Claimant:</strong> {selectedClaim.claimantName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {selectedClaim.claimantEmail}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Contact:</strong> {selectedClaim.contactInfo}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Verification Answer:</strong>
              </Typography>
              <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                <Typography variant="body2">{selectedClaim.answer}</Typography>
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
