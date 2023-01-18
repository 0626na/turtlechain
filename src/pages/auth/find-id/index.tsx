import { Helmet } from 'react-helmet';
import { t } from 'i18next';
import FoundUserList from './FoundUserList';
import { FindPageBody } from '@layout/auth';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PhoneAuthCard } from '@components/combine';

function FindIdPage() {
  const title = `${t('turtleChain')} - ${t('description.findId')}`;
  const [params, _] = useSearchParams();

  return (
    <>
      <Helmet title={title} />
      <FindPageBody>
        {params.get('phone') ? (
          <FoundUserList />
        ) : (
          <PhoneAuthCard type="find-id" />
        )}
      </FindPageBody>
    </>
  );
}

export default FindIdPage;
