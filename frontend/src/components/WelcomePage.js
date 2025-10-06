import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import {
  Search,
  Shield,
  Heart,
  Bell,
  Lock,
  Zap,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export function WelcomePage({ onGetStarted, onLogin }) {
  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
      {/* Navigation Bar */}
      <Box
        sx={{
          borderBottom: "1px solid #e5e5e5",
          bgcolor: "white",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: "#800020",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Heart size={24} color="#FFD700" />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#800020",
                }}
              >
                Wildcats Finder
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="text"
                onClick={onLogin}
                sx={{
                  color: "#800020",
                  fontWeight: 600,
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={onGetStarted}
                sx={{
                  bgcolor: "#800020",
                  color: "white",
                  fontWeight: 600,
                  px: 3,
                  "&:hover": {
                    bgcolor: "#a0002a",
                  },
                }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "#800020",
          color: "white",
          position: "relative",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <Sparkles size={20} color="#FFD700" />
                <Typography
                  variant="overline"
                  sx={{
                    color: "#FFD700",
                    letterSpacing: 2,
                    fontWeight: 600,
                  }}
                >
                  CIT-U Lost & Found System
                </Typography>
              </Box>
              <Typography
                variant="h2"
                sx={{
                  mb: 3,
                  fontWeight: 800,
                  color: "white",
                  fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                  lineHeight: 1.2,
                }}
              >
                Reunite Wildcats with Their Belongings
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  maxWidth: 560,
                }}
              >
                A secure, community-driven platform exclusively for CIT-U
                students to report lost items, find belongings, and connect with
                fellow Wildcats.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ChevronRight size={20} />}
                  onClick={onGetStarted}
                  sx={{
                    bgcolor: "#FFD700",
                    color: "#800020",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    "&:hover": {
                      bgcolor: "#ffc700",
                    },
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={onLogin}
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                {[
                  { icon: Search, label: "Search Items", color: "#FFD700" },
                  { icon: Shield, label: "Secure Platform", color: "white" },
                  { icon: Heart, label: "Help Others", color: "#FFD700" },
                  { icon: Bell, label: "Get Notified", color: "white" },
                ].map((item, index) => (
                  <Grid item xs={6} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.15)",
                        borderRadius: 3,
                        p: 3,
                        textAlign: "center",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: "50%",
                          bgcolor: "rgba(255, 255, 255, 0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 2,
                        }}
                      >
                        <item.icon size={30} color={item.color} />
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "rgba(255, 255, 255, 0.95)",
                          fontWeight: 600,
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: "#800020",
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            How It Works
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 720, mx: "auto", fontWeight: 400 }}
          >
            Three simple steps to reunite with your belongings
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              icon: Search,
              title: "Report Your Item",
              description:
                "Lost something? Found an item? Create a detailed report with photos and descriptions to help identify your belongings.",
              step: "01",
            },
            {
              icon: Zap,
              title: "Get Matched Instantly",
              description:
                "Our smart matching system automatically searches for potential matches and sends you notifications when similar items are found.",
              step: "02",
            },
            {
              icon: Heart,
              title: "Connect & Reunite",
              description:
                "Verify ownership through security questions and connect with fellow students to safely reclaim your lost items.",
              step: "03",
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  border: "1px solid #e5e5e5",
                  borderRadius: 3,
                  position: "relative",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: 20,
                      fontSize: "4rem",
                      fontWeight: 800,
                      color: "rgba(255, 215, 0, 0.2)",
                      lineHeight: 1,
                    }}
                  >
                    {feature.step}
                  </Typography>
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      bgcolor: "rgba(128, 0, 32, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                    }}
                  >
                    <feature.icon size={36} color="#800020" />
                  </Box>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 700, color: "#800020" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Why Choose Us Section */}
      <Box sx={{ bgcolor: "#fafafa", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  color: "#800020",
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                Why Choose Wildcats Finder?
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.7 }}
              >
                Built exclusively for the CIT-U community, our platform ensures
                security, privacy, and trust among students helping each other.
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {[
                  {
                    icon: Lock,
                    title: "Secure & Private",
                    description:
                      "Only verified CIT-U students can access the platform",
                  },
                  {
                    icon: Bell,
                    title: "Real-time Notifications",
                    description:
                      "Get instant alerts when potential matches are found",
                  },
                  {
                    icon: Shield,
                    title: "Admin Moderation",
                    description:
                      "All posts are reviewed to ensure authenticity",
                  },
                ].map((item, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: "rgba(255, 215, 0, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <item.icon size={24} color="#800020" />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#800020", mb: 0.5 }}
                      >
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 4,
                  p: 6,
                  boxShadow: "0 8px 32px rgba(128, 0, 32, 0.08)",
                  border: "1px solid #e5e5e5",
                }}
              >
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      bgcolor: "#800020",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 3,
                    }}
                  >
                    <Heart size={50} color="#FFD700" />
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#800020", mb: 2 }}
                  >
                    Join the Community
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Help make CIT-U a more connected and caring community
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  endIcon={<ChevronRight size={20} />}
                  onClick={onGetStarted}
                  sx={{
                    bgcolor: "#800020",
                    py: 2,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "#a0002a",
                    },
                  }}
                >
                  Create Your Account
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#1a1a1a", color: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: "#800020",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Heart size={24} color="#FFD700" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Wildcats Finder
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                Cebu Institute of Technology – University
                <br />
                Lost & Found Management System
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ textAlign: { xs: "left", md: "right" } }}
            >
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                © 2025 Wildcats Finder. All rights reserved.
                <br />
                Made with ❤️ for CIT-U Wildcats
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
