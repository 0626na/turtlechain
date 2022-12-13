import clearingAPI from '@apis/clearingAPI';

import { SecondaryIconButton } from '@components/element';
import { css } from '@emotion/react';

import useExelClearingCart from '@hooks/useExelClearingCart';
import useModal from '@hooks/useModal';
import useStore from '@hooks/useStore';

import { theme } from '@styles/theme';
import { message } from '@utils/message';
import { Button, Col, DatePicker, Row, Tooltip, Upload } from 'antd';
import { AxiosError } from 'axios';
import { t } from 'i18next';

import moment from 'moment';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import ExelModal from './modals/ExelModal';

// 대행서비스
function AgencyService() {
  const { store } = useStore();
  const { cart, separate, selectDate } = useExelClearingCart();
  const [tooltipVisible, setTooltipVisible] = useState(true);
  const [modalVisible, openModallModal, closeModal] = useModal();
  const closeToolTip = () => {
    setTooltipVisible(false);
  };

  const excelMutation = useMutation(clearingAPI.parseExcel, {
    onSuccess: (data) => {
      separate(data.success, data.fail);
      openModallModal();
      closeToolTip();
    },
    onError: (error: AxiosError) => {
      message.warn(error.response?.data.msg, 10);
    },
  });

  const isToday =
    moment(cart.clearingRequestDate).format('YYYY-MM-DD') ===
    moment().format('YYYY-MM-DD');

  const isOtherDay =
    moment(cart.clearingRequestDate).format('YYYY-MM-DD') !==
    moment().format('YYYY-MM-DD');

  return (
    <>
      {/*
       * 파싱 결과 모달
       */}
      <ExelModal visible={modalVisible} onClose={closeModal} />

      <div css={inner}>
        <span css={clearingDate}>결제요청 일자</span>
        <Row justify="space-between">
          <Row>
            <Col>
              <Button
                css={[$button, isToday && greenButton]}
                onClick={() => {
                  selectDate(moment().format('YYYY-MM-DD'));
                }}
              >
                오늘
              </Button>
            </Col>

            <Col>
              <Tooltip
                visible={tooltipVisible}
                placement="bottom"
                title={<span>지난 일자의 결제요청도 진행할 수 있어요!</span>}
              >
                <DatePicker
                  defaultValue={
                    isOtherDay ? moment(cart.clearingRequestDate) : undefined
                  }
                  onChange={(_, date) => {
                    selectDate(date);
                  }}
                  css={[$datePicker, isOtherDay && greenDatePicker]}
                  onClick={() => closeToolTip()}
                  allowClear={false}
                  placeholder={t('placeholder.select different date')}
                />
              </Tooltip>
            </Col>
          </Row>

          <Col>
            <Upload
              maxCount={1}
              accept=".csv, .xls, .xlsx"
              beforeUpload={(file) => {
                excelMutation.mutate({
                  file,
                  rt_store_id: Number(store.selected?.id),
                });

                return false;
              }}
              fileList={[]}
            >
              <SecondaryIconButton loading={excelMutation.isLoading}>
                정산서 업로드
              </SecondaryIconButton>
            </Upload>
          </Col>
        </Row>
      </div>
    </>
  );
}

const inner = css({
  padding: '18px 36px',
});

const clearingDate = css({
  display: 'inline-block',
  marginBottom: 8,
  fontWeight: 500,
  fontSize: 14,
  color: theme.grey600,
});

const $button = css({
  width: 60,
  height: 40,
  marginRight: 8,
  color: theme.grey500,
  backgroundColor: '#f0f3f6',

  '&:hover': {
    color: theme.grey600,
    backgroundColor: '#d9dbde',
  },

  '&:focus': {
    color: theme.grey500,
    backgroundColor: '#d9dbde',
  },
});

const greenButton = css`
  color: #fff;
  background-color: #00b3be;

  &:hover {
    color: #fff;
    background-color: #00b3be;
  }

  &:focus {
    color: #fff;
    background-color: #00b3be;
  }
`;

const $datePicker = css`
  width: 137px;
  height: 40px;
  background-color: #f0f3f6;
  color: #6b6d73;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  &:hover {
    color: #6b6d73;
    background-color: #d9dbde;
  }
`;

const greenDatePicker = css`
  background-color: #00b3be;

  &:hover {
    color: #fff;
    background-color: #00b3be;
  }

  input,
  .ant-picker-suffix {
    color: #fff;
  }
`;

export default AgencyService;
