import { Helmet } from 'react-helmet';
import { t } from 'i18next';
import FindIdForm from './FindIdForm';
import { FindIdPageBody } from '@layout/login';
import React from 'react';

function FindIdPage() {
  const title = `${t('turtlechain')} - ${t('find id')}`;

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
