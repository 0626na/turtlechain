import React from 'react';

import UserStep from './UserStep';
import { useSearchParams } from 'react-router-dom';
import { COMPLETED, USER } from '@constant/index';
import CompletedStep from '../CompletedStep';

function Pagebody() {
  const [searchParams] = useSearchParams();

  const isUserStep = searchParams.get('step') === USER;
  const isCompletedStep = searchParams.get('step') === COMPLETED;

  return (
    <>
      {isUserStep && <UserStep />}
      {isCompletedStep && <CompletedStep />}
    </>
  );
}

export default Pagebody;
