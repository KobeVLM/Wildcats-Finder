import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import { Mail, Lock } from "lucide-react";

export function LoginPage({ onLogin, onNavigateToRegister, registeredUsers }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate CIT-U email
    if (!email.endsWith("@cit.edu") && !email.endsWith("@citu.edu.ph")) {
      setError("Please use your CIT-U school email (@cit.edu or @citu.edu.ph)");
      return;
    }

    // Check if user is registered
    const user = registeredUsers.find((u) => u.email === email);

    if (user) {
      // Verify password for registered users
      if (user.password !== password) {
        setError("Incorrect password");
        return;
      }
    } else if (password.length === 0) {
      // For demo purposes, allow new users without password
      // In production, they should register first
      setError("Account not found. Please register first.");
      return;
    }

    // Mock login - check if admin
    const role = email.includes("admin") ? "admin" : "student";
    onLogin(email, role);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #800020 0%, rgba(128, 0, 32, 0.9) 50%, rgba(128, 0, 32, 0.8) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                background:
                  "linear-gradient(135deg, #800020 0%, rgba(128, 0, 32, 0.8) 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
            >
              <Typography sx={{ fontSize: "2.5rem" }}>🐾</Typography>
            </Box>
            <Typography variant="h5" color="primary" gutterBottom>
              Wildcats Finder
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cebu Institute of Technology - University
              <br />
              Lost & Found System
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                  School Email
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  placeholder="yourname@cit.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={16} color="#737373" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Password
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={16} color="#737373" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {error && <Alert severity="error">{error}</Alert>}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Sign In
              </Button>

              <Box sx={{ position: "relative", my: 2 }}>
                <Divider />
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    px: 2,
                    color: "text.secondary",
                    textTransform: "uppercase",
                  }}
                >
                  Don't have an account?
                </Typography>
              </Box>

              <Button
                type="button"
                onClick={onNavigateToRegister}
                variant="outlined"
                color="primary"
                size="large"
                fullWidth
              >
                Create New Account
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                Use 'admin@cit.edu' to access admin features
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
