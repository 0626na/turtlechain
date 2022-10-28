import { Helmet } from 'react-helmet';
import { t } from 'i18next';
import FindIdForm from './FindIdForm';
import { FindIdPageBody } from '@layout/auth';
import React from 'react';

function FindIdPage() {
  const title = `${t('turtleChain')} - ${t('auth.findId')}`;

  return (
    <>
      <Helmet title={title} />
      <FindIdPageBody>
        <FindIdForm />
      </FindIdPageBody>
    </>
  );
}

export default FindIdPage;
