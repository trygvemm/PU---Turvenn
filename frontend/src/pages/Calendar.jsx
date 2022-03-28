/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  MonthView,
  Appointments,
  Toolbar,
  DateNavigator,
  AppointmentTooltip
} from '@devexpress/dx-react-scheduler-material-ui';
import Grid from '@mui/material/Grid';
import Room from '@mui/icons-material/Room';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { getTripsParticipatedIn, reset } from '../features/trips/tripSlice';
import Spinner from '../components/Spinner';

const PREFIX = 'Demo';

const classes = {
  icon: `${PREFIX}-icon`,
  textCenter: `${PREFIX}-textCenter`,
  todayCell: `${PREFIX}-todayCell`,
  weekendCell: `${PREFIX}-weekendCell`,
  today: `${PREFIX}-today`,
  weekend: `${PREFIX}-weekend`,
  header: `${PREFIX}-header`,
  commandButton: `${PREFIX}-commandButton`
};

const StyledGrid = styled(Grid)(() => ({
  [`&.${classes.textCenter}`]: {
    textAlign: 'center'
  }
}));

const StyledRoom = styled(Room)(({ theme: { palette } }) => ({
  [`&.${classes.icon}`]: {
    color: palette.action.active
  }
}));

const StyledIconButton = styled(IconButton)(() => ({
  [`&.${classes.commandButton}`]: {
    backgroundColor: 'rgba(255,255,255,0.65)'
  }
}));

function Content({ children, appointmentData, ...restProps }) {
  return (
    <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
      <Grid container alignItems="center">
        {appointmentData.start && (
          <>
            <StyledGrid item xs={2} className={classes.textCenter}>
              <StyledRoom className={classes.icon} />
            </StyledGrid>
            <Grid item xs={10}>
              <span>{appointmentData.start}</span>
            </Grid>
          </>
        )}
      </Grid>
    </AppointmentTooltip.Content>
  );
}

function Header({ children, appointmentData, ...restProps }) {
  const navigate = useNavigate();
  return (
    <AppointmentTooltip.Header {...restProps} appointmentData={appointmentData}>
      <StyledIconButton
        /* eslint-disable-next-line no-alert */
        onClick={() => navigate(`/trips/${appointmentData.id}`)}
        className={classes.commandButton}
        size="large"
      >
        <InfoIcon />
      </StyledIconButton>
    </AppointmentTooltip.Header>
  );
}

function Calendar() {
  const { user } = useSelector((state) => state.auth);
  const { userParticipatedIn, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.trips
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
    }
  }, [dispatch, isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      navigate('/notfound');
      dispatch(reset());
      return;
    }

    if (user) {
      dispatch(getTripsParticipatedIn(user.id));
    }
  }, [isError, message, user]);

  const data = userParticipatedIn.map((item) => ({
    id: item.id,
    title: item.name,
    startDate: item.startDate,
    endDate: item.endDate,
    start: item.start
  }));

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Paper>
      <Scheduler data={data} height={800} locale="no-NB">
        <ViewState />
        <MonthView
        // startDayHour={0}
        // endDayHour={24}
        // timeTableCellComponent={TimeTableCell}
        // dayScaleCellComponent={DayScaleCell}
        />
        <Toolbar />
        <DateNavigator />
        <Appointments />
        <AppointmentTooltip showCloseButton contentComponent={Content} headerComponent={Header} />
      </Scheduler>
    </Paper>
  );
}

export default Calendar;
