import { t } from 'i18next';
import { useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Form, Input, Row, Switch } from 'antd';
import {
  PrimaryButton,
  TurtleDivider,
  TurtleFormInput,
  TurtleFormSearchInput,
  TurtleFormSelect,
  TurtleNumberInput,
} from '@components/element';

import { message } from '@utils/message';
import { pricePattern } from '@utils/pattern';
import { TextWithTooltip, TurtleContentModal } from '@components/combine';
import { css } from '@emotion/react';
import useModal from '@hooks/useModal';

import mistransferAPI from '@apis/mistransferAPI';
import React from 'react';
import useStore from '@hooks/useStore';
import SearchClearingModal from './SearchClearingModal';
import { ClearingItemShow } from '@apis/clearingAPI';
import moment from 'moment';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function MistransferAddModal({ visible, closeModal }: Props) {
  const [form] = Form.useForm();
  const { store } = useStore();

  const queryClient = useQueryClient();
  const [vendorModalVisible, openVendorModal, closeVendorModal] = useModal();

  const createMutation = useMutation(mistransferAPI.create, {
    onSuccess: () => {
      message.success(t('message.success create mistransfer'));
      queryClient.refetchQueries(['getMistransferQuery'], { active: true });
      closeModal();
    },
  });

  const selectClearingItem = (record: ClearingItemShow) => {
    form.setFieldsValue({
      ...form.getFieldsValue(),
      clearing_item_id: record.id,
      ws_store_id: record.ws_info.id,
      vendor_name: record.vendor_name,
      vendor_phone: record.ws_info.store_phone[0].phone,
      vendor_address: {
        building: record.ws_info.building,
        floor: record.ws_info.floor,
        col: record.ws_info.col,
        loc: record.ws_info.loc,
        loc_col: `${record.ws_info.loc}/${record.ws_info.col}`,
        ext: record.ws_info.ext,
      },
      vendor_account: {
        bank: record.bank,
        account_number: record.account_number,
        account_holder: record.account_holder,
      },
      is_vat_included: record.is_vat_included,
    });
    closeVendorModal();
  };

  // 0원 유효성검사
  const refundAmountValidator = (_: unknown, value: number) => {
    if (!value) {
      return Promise.reject(new Error('금액을 확인해 주세요.'));
    }

    return Promise.resolve();
  };

  useEffect(() => {
    if (!visible) return;
    form.resetFields();
  }, [form, visible]);

  return (
    <>
      {/*
       * 정산내역 검색 모달
       */}
      <SearchClearingModal
        visible={vendorModalVisible}
        closeModal={closeVendorModal}
        onClickSelect={selectClearingItem}
      />

      <TurtleContentModal
        title={t('mistransfer.create')}
        visible={visible}
        onClose={closeModal}
      >
        <Form
          initialValues={{
            rt_store_id: store.selected?.id,
            store_account: {
              bank: store.selected?.store_account[0].bank,
              account_number: store.selected?.store_account[0].account_number,
              account_holder: store.selected?.store_account[0].account_holder,
            },
            recipient_print:
              store.selected?.recipient_print ||
              `${moment().format('MMDD')}터틀환불`,
          }}
          layout="horizontal"
          form={form}
          colon={false}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          onFinish={(value) => {
            createMutation.mutate({
              rt_store_id: store.selected?.id as number,
              clearing_item_id: value.clearing_item_id,
              ws_store_id: value.ws_store_id,
              recipient_print: value.recipient_print,
              is_vat_included: value.is_vat_included,
              memo: value.memo,
              refund_amt: value.refund_amt,
            });
          }}
        >
          {/*
           * 정산아이템 정보
           */}
          <Form.Item name="clearing_item_id" hidden>
            <Input hidden />
          </Form.Item>
          <Form.Item name="ws_store_id" hidden>
            <Input hidden />
          </Form.Item>

          <Form.Item
            name="vendor_name"
            rules={[{ required: true }]}
            label="거래처명"
          >
            <TurtleFormSearchInput
              readOnly
              onClick={openVendorModal}
              onSearch={openVendorModal}
              placeholder={t('please input vendor name')}
            />
          </Form.Item>

          <Form.Item label={t('table.mobile')} name="vendor_phone">
            <TurtleFormInput
              disabled
              placeholder="휴대전화 번호를 입력해주세요"
            />
          </Form.Item>

          <Form.Item label={t('table.vendorAddress')}>
            <div css={flexGap}>
              <div css={{ flexBasis: '50%' }}>
                <Form.Item name={['vendor_address', 'building']} noStyle>
                  <TurtleFormSelect placeholder="상가" disabled />
                </Form.Item>
              </div>
              <div css={{ flexBasis: '20%' }}>
                <Form.Item name={['vendor_address', 'floor']} noStyle>
                  <TurtleFormInput placeholder="층" disabled />
                </Form.Item>
              </div>
              <div css={{ flexBasis: '30%' }}>
                <Form.Item name={['vendor_address', 'loc_col']} noStyle>
                  <TurtleFormInput placeholder="열/호" disabled />
                </Form.Item>
              </div>
            </div>
          </Form.Item>

          <Form.Item
            name={['vendor_address', 'ext']}
            label={t('table.vendorEtcAddress')}
          >
            <TurtleFormInput placeholder="기타 주소를 입력해주세요" disabled />
          </Form.Item>

          <Form.Item label={t('table.accountInfo')}>
            <div css={flexGap}>
              <Form.Item name={['vendor_account', 'bank']} noStyle>
                <TurtleFormSelect placeholder="은행" disabled />
              </Form.Item>

              <Form.Item name={['vendor_account', 'account_number']} noStyle>
                <TurtleFormInput placeholder="계좌번호" disabled />
              </Form.Item>

              <Form.Item name={['vendor_account', 'account_holder']} noStyle>
                <TurtleFormInput placeholder="예금주명" disabled />
              </Form.Item>
            </div>
          </Form.Item>

          <TurtleDivider marginTop={32} marginBottom={32} />

          {/*
           * 유저정보
           */}
          <Form.Item
            name="is_vat_included"
            label={
              <TextWithTooltip
                tooltipContent={['당일결제 시, 부가세도 당일에 함께 전달']}
              >
                {t('table.vatIncluded')}
              </TextWithTooltip>
            }
            valuePropName="checked"
          >
            <Switch css={$switch} disabled />
          </Form.Item>
          <Form.Item label={t('mistransfer.recipient_accountInfo')}>
            <div css={flexGap}>
              <Form.Item name={['store_account', 'bank']} noStyle>
                <TurtleFormSelect placeholder="은행" disabled />
              </Form.Item>

              <Form.Item name={['store_account', 'account_number']} noStyle>
                <TurtleFormInput placeholder="계좌번호" disabled />
              </Form.Item>

              <Form.Item name={['store_account', 'account_holder']} noStyle>
                <TurtleFormInput placeholder="예금주명" disabled />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item name="recipient_print" label="받는분 통장인쇄">
            <TurtleFormInput disabled />
          </Form.Item>

          <Form.Item
            name="refund_amt"
            label={t('mistransfer.request price')}
            rules={[
              {
                required: true,
                validator: refundAmountValidator,
              },
            ]}
          >
            <TurtleNumberInput
              placeholder={t('placeholder.mistransfer refundAmt')}
              step={1000}
              min={0}
              formatter={(value) => `${value}`.replace(pricePattern, ',')}
            />
          </Form.Item>

          <Form.Item name="memo" label={t('mistransfer.request memo')} required>
            <TurtleFormInput placeholder={t('placeholder.request memo')} />
          </Form.Item>

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => (
              <Row css={{ marginTop: 40 }}>
                <PrimaryButton
                  disabled={
                    !getFieldValue('refund_amt') ||
                    !getFieldValue('memo') ||
                    !getFieldValue('vendor_name')
                  }
                  size="large"
                  htmlType="submit"
                  loading={createMutation.isLoading}
                >
                  오입금 환불 요청하기
                </PrimaryButton>
              </Row>
            )}
          </Form.Item>
        </Form>
      </TurtleContentModal>
    </>
  );
}

const flexGap = css`
  display: flex;
  gap: 4px;
`;

const $switch = css`
  min-width: 30px;
  width: 30px;
  height: 20px;

  &.ant-switch-checked {
    background-color: #1a66f9;
  }

  .ant-switch-handle {
    width: 14px;
    height: 14px;
  }
`;

export default MistransferAddModal;
