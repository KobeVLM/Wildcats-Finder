/**
 * Wildcats Finder - Material UI Version
 * This version uses ONLY Material UI components and React
 * No Radix UI or Shadcn dependencies
 */

import { useState, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import { WelcomePage } from "./components/WelcomePage";
import { Navigation } from "./components/Navigation";
import { LoginPage } from "./components/LoginPage";
import { RegistrationPage } from "./components/RegistrationPage";
import { HomePage } from "./components/HomePage";
import { ReportForm } from "./components/ReportForm";
import { SearchPage } from "./components/SearchPage";
import { ProfilePage } from "./components/ProfilePage";
import { AdminPage } from "./components/AdminPage";
import { ClaimDialog } from "./components/ClaimDialog";
import { ClaimManagementPage } from "./components/ClaimManagementPage";
import { Toaster, toast } from "sonner";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [authView, setAuthView] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("student");
  const [currentPage, setCurrentPage] = useState("home");
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [items, setItems] = useState([
    {
      id: "1",
      type: "lost",
      name: "iPhone 13 Pro",
      description:
        "Blue iPhone 13 Pro with a cracked screen protector. Has a black case with card holder.",
      category: "Electronics",
      location: "Main Campus - Library",
      date: "2025-09-28",
      imageUrl: undefined,
      reportedBy: "student1@cit.edu",
      status: "active",
    },
    {
      id: "2",
      type: "found",
      name: "Student ID",
      description: "CIT-U student ID for John Doe, Computer Science Department",
      category: "IDs & Cards",
      location: "Main Campus - Cafeteria",
      date: "2025-09-29",
      imageUrl: undefined,
      reportedBy: "student2@cit.edu",
      status: "active",
    },
    {
      id: "3",
      type: "lost",
      name: "Blue Backpack",
      description:
        "Navy blue Jansport backpack with laptop compartment. Contains notebooks and a power bank.",
      category: "Accessories",
      location: "Main Campus - Building A",
      date: "2025-09-30",
      imageUrl: undefined,
      reportedBy: "student3@cit.edu",
      status: "active",
    },
    {
      id: "4",
      type: "found",
      name: "Calculator",
      description: "Scientific calculator, Casio fx-991EX model",
      category: "Electronics",
      location: "Main Campus - Building B",
      date: "2025-10-01",
      imageUrl: undefined,
      reportedBy: "student4@cit.edu",
      status: "active",
    },
    {
      id: "5",
      type: "lost",
      name: "Textbook - Data Structures",
      description:
        "Data Structures and Algorithms textbook by Cormen. Has my name written inside.",
      category: "Books",
      location: "Main Campus - Library",
      date: "2025-09-27",
      imageUrl: undefined,
      reportedBy: "student5@cit.edu",
      status: "claimed",
    },
    {
      id: "6",
      type: "found",
      name: "Set of Keys",
      description:
        "Set of 3 keys on a red keychain with a small stuffed toy attached",
      category: "Keys",
      location: "Main Campus - Parking Area",
      date: "2025-10-02",
      imageUrl: undefined,
      reportedBy: "student6@cit.edu",
      status: "pending",
    },
  ]);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "match",
      message: "A possible match found for your lost iPhone!",
      date: "2025-10-01T10:30:00",
      read: false,
    },
    {
      id: "2",
      type: "claim",
      message: "Someone has claimed your found item: Student ID",
      date: "2025-10-01T14:20:00",
      read: false,
    },
  ]);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleRegister = (email, password, name, studentId) => {
    const newUser = {
      email,
      password,
      name,
      studentId,
      suspended: false,
      joinedAt: new Date().toISOString(),
    };
    setRegisteredUsers([...registeredUsers, newUser]);

    // Auto login after registration
    const role = email.includes("admin") ? "admin" : "student";
    setUserEmail(email);
    setUserRole(role);
    setIsLoggedIn(true);
    toast.success(`Welcome to Wildcats Finder, ${name}!`);
  };

  const handleLogin = (email, role) => {
    const user = registeredUsers.find((u) => u.email === email);

    // Check if user is suspended
    if (user?.suspended) {
      toast.error(
        `Account suspended: ${
          user.suspensionReason || "Contact admin for details"
        }`
      );
      return;
    }

    setUserEmail(email);
    setUserRole(role);
    setIsLoggedIn(true);

    const displayName = user ? user.name : email.split("@")[0];
    toast.success(`Welcome back, ${displayName}!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setUserRole("student");
    setCurrentPage("home");
    toast.info("Logged out successfully");
  };

  const handlePasswordChange = (oldPassword, newPassword) => {
    // Find the user and update their password
    const updatedUsers = registeredUsers.map((user) => {
      if (user.email === userEmail) {
        if (user.password !== oldPassword) {
          toast.error("Current password is incorrect");
          return user;
        }
        return { ...user, password: newPassword };
      }
      return user;
    });
    setRegisteredUsers(updatedUsers);
  };

  const handleDeleteAccount = () => {
    // Remove user's items
    const filteredItems = items.filter((item) => item.reportedBy !== userEmail);
    setItems(filteredItems);

    // Remove user from registered users
    const filteredUsers = registeredUsers.filter(
      (user) => user.email !== userEmail
    );
    setRegisteredUsers(filteredUsers);

    // Logout
    setIsLoggedIn(false);
    setUserEmail("");
    setUserRole("student");
    setCurrentPage("home");
    setShowWelcome(true);
  };

  const handleReportSubmit = (newItem) => {
    const item = {
      ...newItem,
      id: Date.now().toString(),
      status: "pending",
      reportedBy: userEmail,
    };
    setItems([item, ...items]);
    toast.success("Report submitted! Waiting for admin approval.");
    setCurrentPage("profile");
  };

  const handleClaim = (item) => {
    setSelectedItem(item);
    setClaimDialogOpen(true);
  };

  const handleClaimSubmit = (itemId, answer, contactInfo) => {
    const user = registeredUsers.find((u) => u.email === userEmail);

    const newClaim = {
      id: Date.now().toString(),
      itemId,
      claimantEmail: userEmail,
      claimantName: user?.name || userEmail.split("@")[0],
      answer,
      contactInfo,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setClaims([newClaim, ...claims]);

    const item = items.find((i) => i.id === itemId);
    const newNotification = {
      id: Date.now().toString(),
      type: "claim",
      message: `New claim received for your item: ${item?.name}`,
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications([newNotification, ...notifications]);

    toast.success(
      "Claim submitted successfully! The owner will review your claim."
    );
  };

  const handleApprove = (itemId) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, status: "active" } : item
      )
    );
    toast.success("Item approved and published");
  };

  const handleReject = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
    toast.error("Item rejected and removed");
  };

  const handleDelete = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
    // Also delete related claims
    setClaims(claims.filter((claim) => claim.itemId !== itemId));
    toast.error("Item deleted");
  };

  const handleApproveClaim = (claimId) => {
    const claim = claims.find((c) => c.id === claimId);
    if (!claim) return;

    setClaims(
      claims.map((c) =>
        c.id === claimId
          ? { ...c, status: "approved", reviewedAt: new Date().toISOString() }
          : c
      )
    );

    // Notify claimant
    const newNotification = {
      id: Date.now().toString(),
      type: "claim",
      message: `Your claim has been approved! Contact the owner for item pickup.`,
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications([newNotification, ...notifications]);

    toast.success("Claim approved successfully");
  };

  const handleRejectClaim = (claimId, reason) => {
    const claim = claims.find((c) => c.id === claimId);
    if (!claim) return;

    setClaims(
      claims.map((c) =>
        c.id === claimId
          ? {
              ...c,
              status: "rejected",
              reviewedAt: new Date().toISOString(),
              rejectionReason: reason,
            }
          : c
      )
    );

    // Notify claimant
    const newNotification = {
      id: Date.now().toString(),
      type: "claim",
      message: `Your claim was rejected: ${reason}`,
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications([newNotification, ...notifications]);

    toast.info("Claim rejected");
  };

  const handleMarkAsReturned = (itemId) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, status: "claimed" } : item
      )
    );

    toast.success("Item marked as returned!");
  };

  const handleSuspendUser = (email, reason) => {
    setRegisteredUsers(
      registeredUsers.map((user) =>
        user.email === email
          ? { ...user, suspended: true, suspensionReason: reason }
          : user
      )
    );
    toast.warning(`User ${email} has been suspended`);
  };

  const handleUnsuspendUser = (email) => {
    setRegisteredUsers(
      registeredUsers.map((user) =>
        user.email === email
          ? { ...user, suspended: false, suspensionReason: undefined }
          : user
      )
    );
    toast.success(`User ${email} has been unsuspended`);
  };

  const handleDeleteUser = (email) => {
    // Remove user's items
    const filteredItems = items.filter((item) => item.reportedBy !== email);
    setItems(filteredItems);

    // Remove user's claims
    const filteredClaims = claims.filter(
      (claim) => claim.claimantEmail !== email
    );
    setClaims(filteredClaims);

    // Remove user from registered users
    const filteredUsers = registeredUsers.filter(
      (user) => user.email !== email
    );
    setRegisteredUsers(filteredUsers);

    toast.error(`User ${email} has been permanently deleted`);
  };

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const pendingClaimsOnMyItems = useMemo(
    () =>
      claims.filter((claim) => {
        const item = items.find((i) => i.id === claim.itemId);
        return item?.reportedBy === userEmail && claim.status === "pending";
      }).length,
    [claims, items, userEmail]
  );

  const userProfiles = useMemo(
    () =>
      registeredUsers.map((user) => ({
        email: user.email,
        name: user.name,
        studentId: user.studentId,
        suspended: user.suspended || false,
        suspensionReason: user.suspensionReason,
        joinedAt: user.joinedAt,
      })),
    [registeredUsers]
  );

  // Show Welcome Page first
  if (showWelcome) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <WelcomePage
          onGetStarted={() => {
            setShowWelcome(false);
            setAuthView("register");
          }}
          onLogin={() => {
            setShowWelcome(false);
            setAuthView("login");
          }}
        />
        <Toaster position="top-right" />
      </ThemeProvider>
    );
  }

  if (!isLoggedIn) {
    if (authView === "register") {
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RegistrationPage
            onRegister={handleRegister}
            onBackToLogin={() => setAuthView("login")}
          />
          <Toaster position="top-right" />
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginPage
          onLogin={handleLogin}
          onNavigateToRegister={() => setAuthView("register")}
          registeredUsers={registeredUsers}
        />
        <Toaster position="top-right" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
        <Navigation
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          userRole={userRole}
          notificationCount={unreadNotifications}
          claimsCount={pendingClaimsOnMyItems}
        />

        <main>
          {currentPage === "home" && (
            <HomePage items={items} onClaim={handleClaim} />
          )}

          {currentPage === "report-lost" && (
            <div
              style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 16px" }}
            >
              <ReportForm
                type="lost"
                onSubmit={handleReportSubmit}
                userEmail={userEmail}
              />
            </div>
          )}

          {currentPage === "report-found" && (
            <div
              style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 16px" }}
            >
              <ReportForm
                type="found"
                onSubmit={handleReportSubmit}
                userEmail={userEmail}
              />
            </div>
          )}

          {currentPage === "search" && (
            <SearchPage items={items} onClaim={handleClaim} />
          )}

          {currentPage === "claims" && (
            <ClaimManagementPage
              userEmail={userEmail}
              items={items}
              claims={claims}
              onApproveClaim={handleApproveClaim}
              onRejectClaim={handleRejectClaim}
              onMarkAsReturned={handleMarkAsReturned}
            />
          )}

          {currentPage === "profile" && (
            <ProfilePage
              userEmail={userEmail}
              userRole={userRole}
              items={items}
              notifications={notifications}
              onClaim={handleClaim}
              onLogout={handleLogout}
              onPasswordChange={handlePasswordChange}
              onDeleteAccount={handleDeleteAccount}
            />
          )}

          {currentPage === "admin" && userRole === "admin" && (
            <AdminPage
              items={items}
              users={userProfiles}
              claims={claims}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
              onSuspendUser={handleSuspendUser}
              onUnsuspendUser={handleUnsuspendUser}
              onDeleteUser={handleDeleteUser}
              currentUserEmail={userEmail}
            />
          )}
        </main>

        <ClaimDialog
          item={selectedItem}
          open={claimDialogOpen}
          onClose={() => {
            setClaimDialogOpen(false);
            setSelectedItem(null);
          }}
          onSubmit={handleClaimSubmit}
        />

        <Toaster position="top-right" />
      </div>
    </ThemeProvider>
  );
}
