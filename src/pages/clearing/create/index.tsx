import { PageHeader } from '@layout/page';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';
import React from 'react';
import SubscriptionBar from '@layout/page/SubscriptionBar';
import { useQuery } from 'react-query';
import userAPI from '@apis/userAPI';
import useUser from '@hooks/useUser';

function ClearingCreatePage() {
  const { user } = useUser();
  const getSubscriptionCheckQuery = useQuery('getSubscriptionCheckQuery', () =>
    userAPI.getSubscriptionCheck({ company_id: user?.company_id ?? -1 }),
  );
  return (
    <>
      <Helmet title={`${t('turtleChain')} - ${t('clearing.create')}`} />
      {getSubscriptionCheckQuery.data?.data.is_new ? <SubscriptionBar /> : null}
      <PageHeader title={t('clearing.create')} />
      <PageBody />
    </>
  );
}

export default ClearingCreatePage;
