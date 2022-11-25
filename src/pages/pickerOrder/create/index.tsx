import React, { useState } from 'react';
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
            title="발주요청 일자를 변경할 수 있어요"
            placement="bottom"
            zIndex={1}
          >
            <div onClick={() => setdateToolipVisible(false)}>
              <TurtleDatePicker
                date={moment(cart.selectedDate)}
                onchange={(value) => setCart({ ...cart, selectedDate: value })}
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
