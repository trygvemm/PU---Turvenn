import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const useSignedUpStatus = () => {
  const [signedUp, setSignedUp] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const { trip } = useSelector((state) => state.trips);

  useEffect(() => {
    // Vil ikke oppdateres på signup/signoff fordi backend ikke returnerer tur
    if (user && trip && trip.participators.filter((p) => p.id === user.id).length > 0) {
      setSignedUp(true);
    } else {
      setSignedUp(false);
    }
    setCheckingStatus(false);
  }, [user, trip]);
  return [
    [signedUp, setSignedUp],
    [checkingStatus, setCheckingStatus]
  ];
};

export default useSignedUpStatus;
