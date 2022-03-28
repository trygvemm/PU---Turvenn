import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import moment from 'moment';
import 'moment/locale/nb';
import { ToastContainer } from 'react-toastify';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateTrip from './pages/CreateTrip';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import ViewTrip from './pages/ViewTrip';
import User from './pages/User';
import 'react-toastify/dist/ReactToastify.css';
import EditTrip from './pages/EditTrip';
import Calendar from './pages/Calendar';

const theme = createTheme({
  palette: {
    primary: {
      light: '#85bb5c',
      main: '#558b2f',
      dark: '#00897b',
      contrastText: '#000000'
    },
    secondary: {
      light: '#4ebaaa',
      main: '#00897b',
      dark: '#005b4f',
      contrastText: '#fff'
    },
    test: blue
  }
});

function App() {
  moment.locale('nb');

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-trip" element={<PrivateRoute />}>
            <Route path="/create-trip" element={<CreateTrip />} />
          </Route>
          <Route path="/home" element={<Home />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/users/:id/edit" element={<PrivateRoute />}>
            <Route path="/users/:id/edit" element={<ProfilePage />} />
          </Route>
          <Route path="/trips/:id" element={<ViewTrip />} />
          <Route path="/trips/:id/edit" element={<PrivateRoute />}>
            <Route path="/trips/:id/edit" element={<EditTrip />} />
          </Route>
          <Route path="/calendar" element={<PrivateRoute />}>
            <Route path="/calendar" element={<Calendar />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
