import React, { useState } from 'react';
import { PageHeader } from '@layout/page';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';
import { Tooltip } from 'antd';
import TurtleDatePicker from '@components/element/rangePicker/TurtleDatePicker';
import useOrderCart from '@hooks/useOrderCart';
import moment from 'moment';

function index() {
  const { cart, setCart } = useOrderCart();
  const [dateTooltipvisible, setdateToolipVisible] = useState(true);
  return (
    <>
      <Helmet title={`${t('turtleChain')} - ${t('title.orderCreate')}`} />
      <PageHeader
        title={`${t('title.orderCreate')}`}
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

export default index;
