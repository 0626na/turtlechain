import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';

import { PageHeader } from '@layout/page';
import PageBody from './PageBody';
import {
  TurtlePrimaryRangePicker,
  TurtleSecondaryRangePicker,
} from '@components/element';
import TurtleDatePicker from '@components/element/rangePicker/TurtleDatePicker';
import useOrderCart from '@hooks/useOrderCart';

function PickerOrder() {
  const { date, setDate } = useOrderCart();
  return (
    <>
      <Helmet
        title={`${t('turtleChain')} - ${t('picker')} - ${t('order.create')}`}
      />
      <PageHeader
        title={t('order.create')}
        button={
          <TurtleDatePicker
            date={date.selectedDate}
            onchange={(value) => setDate({ selectedDate: value })}
          />
        }
      />
      <PageBody />
    </>
  );
}

export default PickerOrder;
