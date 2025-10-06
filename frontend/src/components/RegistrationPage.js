import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import { MuiOtpInput } from "mui-one-time-password-input";
import { ArrowLeft, Mail, Lock, User, IdCard, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function RegistrationPage({ onRegister, onBackToLogin }) {
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const validDomains = ["@cit.edu", "@citu.edu.ph"];
    return validDomains.some((domain) => email.endsWith(domain));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email =
        "Please use a valid CIT-U email (@cit.edu or @citu.edu.ph)";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpCode);

    // In a real app, this would send an email
    // For demo purposes, we'll show the OTP in a toast
    toast.success(`OTP sent to ${formData.email}`, {
      description: `Your verification code is: ${otpCode}`,
      duration: 10000,
    });

    setStep("otp");
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      toast.success("Email verified successfully!");
      onRegister(
        formData.email,
        formData.password,
        formData.name,
        formData.studentId
      );
    } else {
      toast.error("Invalid OTP. Please try again.");
      setOtp("");
    }
  };

  const handleResendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtp("");

    toast.success(`New OTP sent to ${formData.email}`, {
      description: `Your verification code is: ${newOtp}`,
      duration: 10000,
    });
  };

  if (step === "otp") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, rgba(128, 0, 32, 0.05) 0%, #ffffff 50%, rgba(255, 215, 0, 0.05) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Card sx={{ maxWidth: 450, width: "100%" }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "rgba(128, 0, 32, 0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Mail size={32} color="#800020" />
              </Box>
              <Typography variant="h5" gutterBottom>
                Verify Your Email
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We've sent a 6-digit code to
                <br />
                <Box
                  component="span"
                  sx={{ color: "primary.main", fontWeight: 500 }}
                >
                  {formData.email}
                </Box>
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ mb: 1.5, textAlign: "center", fontWeight: 500 }}
                >
                  Enter OTP Code
                </Typography>
                <MuiOtpInput
                  value={otp}
                  onChange={setOtp}
                  length={6}
                  TextFieldsProps={{
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#800020",
                          borderWidth: 2,
                        },
                      },
                    },
                  }}
                />
              </Box>

              <Alert severity="info" icon={<CheckCircle size={20} />}>
                Check your email for the verification code. The code is valid
                for 10 minutes.
              </Alert>

              <Button
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6}
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Verify Email
              </Button>

              <Button
                onClick={handleResendOtp}
                variant="outlined"
                size="large"
                fullWidth
              >
                Resend Code
              </Button>

              <Button
                onClick={() => setStep("form")}
                variant="text"
                startIcon={<ArrowLeft size={16} />}
                fullWidth
              >
                Back to Registration
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgba(128, 0, 32, 0.05) 0%, #ffffff 50%, rgba(255, 215, 0, 0.05) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 450, width: "100%" }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                bgcolor: "primary.main",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <Typography sx={{ fontSize: "2rem" }}>🐱</Typography>
            </Box>
            <Typography variant="h5" gutterBottom>
              Create Your Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join Wildcats Finder to report and find lost items
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                  <User
                    size={16}
                    style={{ verticalAlign: "middle", marginRight: 8 }}
                  />
                  Full Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Juan Dela Cruz"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                  <IdCard
                    size={16}
                    style={{ verticalAlign: "middle", marginRight: 8 }}
                  />
                  Student ID
                </Typography>
                <TextField
                  fullWidth
                  placeholder="12-3456-678"
                  value={formData.studentId}
                  onChange={(e) =>
                    setFormData({ ...formData, studentId: e.target.value })
                  }
                  error={!!errors.studentId}
                  helperText={errors.studentId}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                  <Mail
                    size={16}
                    style={{ verticalAlign: "middle", marginRight: 8 }}
                  />
                  CIT-U Email
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  placeholder="student@cit.edu"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                  <Lock
                    size={16}
                    style={{ verticalAlign: "middle", marginRight: 8 }}
                  />
                  Password
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                  <Lock
                    size={16}
                    style={{ verticalAlign: "middle", marginRight: 8 }}
                  />
                  Confirm Password
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </Box>

              <Alert severity="info">
                Use your official CIT-U email address (@cit.edu or @citu.edu.ph)
                to register.
              </Alert>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Continue to Verification
              </Button>

              <Button
                type="button"
                onClick={onBackToLogin}
                variant="text"
                startIcon={<ArrowLeft size={16} />}
                fullWidth
              >
                Back to Login
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
