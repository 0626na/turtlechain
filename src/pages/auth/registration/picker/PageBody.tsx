
import React from 'react';

import UserStep from './step/UserStep';
import CompletedStep from './step/CompletedStep';
import { useSearchParams } from 'react-router-dom';
import { COMPLETED, USER } from '@constant/index';

function Pagebody() {
  const [searchParams, setSerachParmas] = useSearchParams();

  const isUserStep = searchParams.get('step') === USER;
  const isCompletedStep = searchParams.get('step') === COMPLETED;

  return (
    <>
      {isUserStep && (
        <UserStep
          goCompletedStep={() => {
            setSerachParmas({ step: COMPLETED });
          }}
        />
      )}

      {isCompletedStep && <CompletedStep />}
    </>
  );
}

export default Pagebody;
