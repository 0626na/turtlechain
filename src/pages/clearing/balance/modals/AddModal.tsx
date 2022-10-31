import { t } from 'i18next';
import { Form, Input } from 'antd';
import { message } from '@utils/message';
import React, { useEffect } from 'react';

import {
  PrimaryButton,
  TurtleDivider,
  TurtleFormInput,
  TurtleFormSearchInput,
  TurtleFormSelect,
  TurtleNumberInput,
} from '@components/element';
import { TurtleContentModal } from '@components/combine';

import { Vendor } from '@apis/vendorAPI';
import useModal from '@hooks/useModal';
import { css } from '@emotion/react';
import SearchVendorModal from '@components/combine/modal/SearchVendorModal';
import useStore from '@hooks/useStore';

import { useMutation, useQueryClient } from 'react-query';
import transactionAPI from '@apis/transactionAPI';

//과거매입 추가 모달
interface Props {
  visible: boolean;
  closeModal: () => void;
}

function AddModal({ visible, closeModal }: Props) {
  const queryClient = useQueryClient();
  const { store } = useStore();
  const [form] = Form.useForm();
  const [vendorModalVisible, openVendorModal, closeVendorModal] = useModal();

  // 과거매입 등록
  const createTransactionMutation = useMutation(transactionAPI.create, {
    onSuccess: () => {
      message.success('성공적으로 등록하였습니다.');
      queryClient.refetchQueries(['getTransactionList'], { active: true });
      form.resetFields();
      closeModal();
    },
  });

  const selectVendor = (record: Vendor) => {
    form.setFieldsValue({
      vendor_id: record.id,
      vendor_name: record.vendor_name,
      vendor_address: record.vendor_address,
      vendor_phone: record.vendor_phone.phone,
      vendor_account_bank: record.vendor_account.bank,
      vendor_account_number: record.vendor_account.account_number,
      vendor_account_holder: record.vendor_account.account_holder,
      subtract_amount: 0,
      unpaid_amount: 0,
    });
    closeVendorModal();
  };

  useEffect(() => {
    if (!visible) return;

    form.setFieldsValue({
      rt_store_id: store.selected?.id as number,
    });
  }, [visible, form, store.selected?.id]);

  return (
    <>
      {/*
       * 거래처 검색 모달
       */}
      <SearchVendorModal
        visible={vendorModalVisible}
        closeModal={closeVendorModal}
        onClickSelect={selectVendor}
      />

      <TurtleContentModal
        title={t('clearing.balance.add')}
        visible={visible}
        onClose={() => {
          form.resetFields();
          closeModal();
        }}
      >
        <Form
          layout="horizontal"
          form={form}
          colon={false}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          onFinish={({
            rt_store_id,
            vendor_id,
            subtract_amount,
            unpaid_amount,
          }) => {
            createTransactionMutation.mutate({
              rt_store_id,
              vendor_id,
              subtract_amount: subtract_amount ?? 0,
              unpaid_amount: unpaid_amount ?? 0,
            });
          }}
        >
          {/*  서버 전달용 데이터 */}
          <Form.Item name="rt_store_id" hidden>
            <Input hidden />
          </Form.Item>

          <Form.Item name="vendor_id" hidden>
            <Input hidden />
          </Form.Item>

          <Form.Item
            label={t('table.vendorName')}
            name="vendor_name"
            rules={[{ required: true, message: '거래처명을 입력해주세요' }]}
          >
            <TurtleFormSearchInput
              readOnly
              onClick={openVendorModal}
              onSearch={openVendorModal}
              placeholder="거래처명을 입력해주세요"
            />
          </Form.Item>

          <Form.Item
            label={t('table.vendorAddress')}
            name="vendor_address"
            required
          >
            <TurtleFormInput placeholder="거래처 주소" disabled />
          </Form.Item>

          <Form.Item
            name="vendor_address_ext"
            label={t('table.vendorEtcAddress')}
          >
            <TurtleFormInput placeholder="기타 주소를 입력해주세요" disabled />
          </Form.Item>

          <Form.Item label={t('table.accountInfo')} required>
            <div css={flexGap}>
              <Form.Item name="vendor_account_bank" noStyle>
                <TurtleFormSelect placeholder="은행" disabled />
              </Form.Item>

              <Form.Item name="vendor_account_number" noStyle>
                <TurtleFormInput placeholder="계좌번호" disabled />
              </Form.Item>

              <Form.Item name="vendor_account_holder" noStyle>
                <TurtleFormInput placeholder="예금주명" disabled />
              </Form.Item>
            </div>
          </Form.Item>

          <TurtleDivider marginBottom={37} marginTop={32} />

          <Form.Item label={t('table.subtractAmount')} name="subtract_amount">
            <TurtleNumberInput step={1000} min={0} placeholder="ex. 7,000" />
          </Form.Item>
          <Form.Item label={t('table.unpaidPayment')} name="unpaid_amount">
            <TurtleNumberInput step={1000} min={0} placeholder="ex. 7,000" />
          </Form.Item>

          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => (
              <div css={marginTop}>
                <PrimaryButton
                  size="large"
                  htmlType="submit"
                  disabled={
                    !getFieldValue('vendor_name') ||
                    (!getFieldValue('subtract_amount') &&
                      !getFieldValue('unpaid_amount'))
                  }
                >
                  {t('button.addTransaction')}
                </PrimaryButton>
              </div>
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

const marginTop = css`
  margin-top: 44px;
`;

export default AddModal;
