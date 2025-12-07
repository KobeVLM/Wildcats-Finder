import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Home, Search, User, FileText, ClipboardList } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole?: 'student' | 'admin';
  notificationCount?: number;
  claimsCount?: number;
}

export function Navigation({ currentPage, onNavigate, userRole, notificationCount = 0, claimsCount = 0 }: NavigationProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'report', label: 'Report Item', icon: FileText },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'claims', label: 'Claims', icon: ClipboardList },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar sx={{ maxWidth: 1280, width: '100%', mx: 'auto', px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: isMobile ? 1 : 0 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'secondary.main',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>W</Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: 'white', lineHeight: 1.2 }}>
              Wildcats Finder
            </Typography>
            <Typography variant="caption" sx={{ color: 'secondary.main', opacity: 0.9 }}>
              CIT-U Lost & Found
            </Typography>
          </Box>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  startIcon={<Icon size={16} />}
                  sx={{
                    color: 'white',
                    bgcolor: isActive ? 'secondary.main' : 'transparent',
                    '&:hover': {
                      bgcolor: isActive ? 'secondary.main' : 'rgba(255, 255, 255, 0.1)',
                    },
                    ...(isActive && {
                      color: 'primary.main',
                    }),
                    position: 'relative',
                  }}
                >
                  {item.label}
                  {item.id === 'profile' && notificationCount > 0 && (
                    <Badge
                      badgeContent={notificationCount}
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                      }}
                    />
                  )}
                  {item.id === 'claims' && claimsCount > 0 && (
                    <Badge
                      badgeContent={claimsCount}
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                      }}
                    />
                  )}
                </Button>
              );
            })}
            {userRole === 'admin' && (
              <Button
                onClick={() => onNavigate('admin')}
                sx={{
                  color: 'white',
                  bgcolor: currentPage === 'admin' ? 'secondary.main' : 'transparent',
                  '&:hover': {
                    bgcolor: currentPage === 'admin' ? 'secondary.main' : 'rgba(255, 255, 255, 0.1)',
                  },
                  ...(currentPage === 'admin' && {
                    color: 'primary.main',
                  }),
                }}
              >
                Admin
              </Button>
            )}
          </Box>
        )}
      </Toolbar>

      {/* Mobile Navigation */}
      {isMobile && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            borderTop: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            py: 1,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <IconButton
                key={item.id}
                onClick={() => onNavigate(item.id)}
                sx={{
                  flexDirection: 'column',
                  gap: 0.5,
                  color: isActive ? 'secondary.main' : 'rgba(255, 255, 255, 0.8)',
                  position: 'relative',
                }}
              >
                {item.id === 'profile' && notificationCount > 0 ? (
                  <Badge badgeContent={notificationCount} color="error">
                    <Icon size={20} />
                  </Badge>
                ) : item.id === 'claims' && claimsCount > 0 ? (
                  <Badge badgeContent={claimsCount} color="error">
                    <Icon size={20} />
                  </Badge>
                ) : (
                  <Icon size={20} />
                )}
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                  {item.label}
                </Typography>
              </IconButton>
            );
          })}
        </Box>
      )}
    </AppBar>
  );
}