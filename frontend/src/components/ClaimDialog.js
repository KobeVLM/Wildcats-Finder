import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function ClaimDialog({ item, open, onClose, onSubmit }) {
  const [answer, setAnswer] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (item) {
      onSubmit(item.id, answer, contactInfo);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setAnswer("");
        setContactInfo("");
        onClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setAnswer("");
    setContactInfo("");
    setSubmitted(false);
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      {submitted ? (
        <DialogContent>
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                bgcolor: "rgba(22, 163, 74, 0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <CheckCircle2 size={32} color="#16a34a" />
            </Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Claim Submitted!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The item owner will review your claim and contact you soon.
            </Typography>
          </Box>
        </DialogContent>
      ) : (
        <>
          <DialogTitle>Claim Item</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please verify your claim by answering the question below
            </Typography>

            <Alert
              icon={<AlertCircle size={20} />}
              severity="info"
              sx={{ mb: 3 }}
            >
              <strong>{item.name}</strong> -{" "}
              {item.type === "lost" ? "Lost" : "Found"} at {item.location}
            </Alert>

            <form onSubmit={handleSubmit} id="claim-form">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    Verification Question *
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {item.type === "lost"
                      ? "Describe a distinctive feature of the item that only the owner would know"
                      : "Where and when did you lose this item?"}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Your answer..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    Contact Information *
                  </Typography>
                  <TextField
                    fullWidth
                    type="text"
                    placeholder="Phone number or Telegram/Viber username"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    required
                  />
                </Box>

                <Alert
                  severity="info"
                  sx={{
                    bgcolor: "rgba(255, 215, 0, 0.1)",
                    border: "1px solid rgba(255, 215, 0, 0.2)",
                  }}
                >
                  The item reporter will receive your claim and contact you
                  directly to verify ownership.
                </Alert>
              </Box>
            </form>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              form="claim-form"
              variant="contained"
              color="primary"
            >
              Submit Claim
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
