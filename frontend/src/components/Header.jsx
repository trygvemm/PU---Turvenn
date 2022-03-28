import ClickAwayListener from '@mui/base/ClickAwayListener';
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EventIcon from '@mui/icons-material/Event';
import ListItemIcon from '@mui/material/ListItemIcon';
import MuiAppBar from '@mui/material/AppBar';
import HomeIcon from '@mui/icons-material/Home';
import { Drawer, ListItem, List, ListItemText, CssBaseline } from '@mui/material';
import { logout, reset } from '../features/auth/authSlice';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}));

function Header() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const pathMatchRoute = (route) => route === location.pathname;

  const onLogout = async () => {
    await Promise.all([dispatch(logout()), dispatch(reset())]);
    navigate('/');
  };

  const onLogin = () => {
    navigate('/');
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  return (
    <ClickAwayListener onClickAway={handleDrawerClose}>
      <Box>
        <CssBaseline />
        <AppBar position="static" open={open}>
          <Toolbar>
            {user && (
              <IconButton
                size="large"
                aria-label="menu"
                edge="start"
                color="inherit"
                onClick={handleDrawerOpen}
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} role="heading">
              {user ? `Hei ${user.firstName}!` : 'Turvenn'}
            </Typography>
            {user ? (
              <Button color="inherit" onClick={onLogout}>
                Logg Ut
              </Button>
            ) : (
              <Button color="inherit" onClick={onLogin}>
                Logg Inn
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box'
            }
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <Divider />
          <List>
            <Link to="/home" style={{ textDecoration: 'none' }}>
              <ListItem button key="Hjem">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Hjem" />
              </ListItem>
            </Link>
            <Link to="/create-trip" style={{ textDecoration: 'none' }}>
              <ListItem button key="Opprett Tur">
                <ListItemIcon>
                  <AddCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Opprett Tur" />
              </ListItem>
            </Link>
            <Link to="/calendar" style={{ textDecoration: 'none' }}>
              <ListItem button key="Turkalender">
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Turkalender" />
              </ListItem>
            </Link>
            <Link to={user ? `/users/${user.id}` : '/'} style={{ textDecoration: 'none' }}>
              <ListItem button key="Profil">
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Profil" />
              </ListItem>
            </Link>
          </List>
        </Drawer>
      </Box>
    </ClickAwayListener>
  );
}

export default Header;
