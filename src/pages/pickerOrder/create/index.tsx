import React, { useEffect, useState } from 'react';
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
import moment from 'moment';
import { Tooltip } from 'antd';

function PickerOrder() {
  const { cart, setCart } = useOrderCart();
  const [dateTooltipvisible, setdateToolipVisible] = useState(true);

  return (
    <>
      <Helmet
        title={`${t('turtleChain')} - ${t('picker')} - ${t('order.create')}`}
      />
      <PageHeader
        title={t('order.create')}
        button={
          <Tooltip
            visible={dateTooltipvisible}
            title={t('description.you can change the order request date')}
            placement="bottom"
            zIndex={1}
          >
            <div onClick={() => setdateToolipVisible(false)}>
              <TurtleDatePicker
                date={cart.selectedDate}
                disabledDate={(current) => {
                  const yesterday = moment().subtract(1, 'day');

                  return (
                    yesterday.date() > current.date() ||
                    moment().date() < current.date()
                  );
                }}
                onchange={(value) => {
                  setCart({ ...cart, selectedDate: value });
                }}
              />
            </div>
          </Tooltip>
        }
      />
      <PageBody />
    </>
  );
}

export default PickerOrder;
