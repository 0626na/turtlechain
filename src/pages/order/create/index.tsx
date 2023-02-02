import React, { useState } from 'react';
import { PageHeader } from '@layout/page';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import PageBody from './PageBody';
import TurtleDatePicker from '@components/element/rangePicker/TurtleDatePicker';
import useOrderCart from '@hooks/useOrderCart';
import moment from 'moment';
import { css } from '@emotion/react';
import Tooltip from '@components/element/Tooltip';

function index() {
  const { cart, setCart } = useOrderCart();
  const [dateTooltipvisible, setdateToolipVisible] = useState(true);
  return (
    <>
      <Helmet title={`${t('turtleChain')} - ${t('title.orderCreate')}`} />
      <PageHeader
        title={`${t('title.orderCreate')}`}
        button={
          <div onClick={() => setdateToolipVisible(false)}>
            <Tooltip message="발주요청 일자를 변경할 수 있어요">
              <div>
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
          </div>
        }
      />
      <PageBody />
    </>
  );
}

export default index;
