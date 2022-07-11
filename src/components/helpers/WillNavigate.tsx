import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { emitter, ShouldNavigateEvent } from '../../Events';

/*
  Navigates on shouldNavigate events until unmounted
*/
export function WillNavigate() {
  const navigate = useNavigate();

  useEffect(() => {
    const navListener = (event: ShouldNavigateEvent) => {
      navigate(event.location, { replace: true });
    };
    emitter.on('shouldNavigate', navListener);
    return () => emitter.off('shouldNavigate', navListener);
  });

  return <></>;
}
