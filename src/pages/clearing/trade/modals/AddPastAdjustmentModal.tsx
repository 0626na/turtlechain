import { t } from 'i18next';
import { Form, Input, message } from 'antd';
import React, { useEffect } from 'react';

import {
  PrimaryButton,
  TurtleDivider,
  TurtleFormInput,
  TurtleFormSearchInput,
  TurtleFormSelect,
} from '@components/element';
import { TurtleContentModal } from '@components/combine';

import vendorAPI from '@apis/vendorAPI';
import useModal from '@hooks/useModal';
import { css } from '@emotion/react';
import SearchVendorModal from '@components/combine/modal/SearchVendorModal';
import useStore from '@hooks/useStore';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function AddPastAdjustmentModal({ visible, closeModal }: Props) {
  const navigate = useNavigate();
  const { store } = useStore();
  // const { isStoreSelected } = useStore();

  const [form] = Form.useForm();
  const [vendorModalVisible, openVendorModal, closeVendorModal] = useModal();

  // 선택된 거래처

  // 거래처 등록
  const createVendorMutation = useMutation(vendorAPI.create, {
    onSuccess: (data) => {
      if (data.data.fail_count > 0) {
        message.error('이미 등록된 거래처입니다.');
        return;
      }
      message.success('성공적으로 등록하였습니다.');
      form.resetFields();
      navigate('/vendor/list');
    },
  });

  // 거래처 선택후 폼에 채워넣기
  // const HandleFieldFillin = (vendor: Wholesale) => {
  //   form.setFieldsValue({
  //     ...form.getFieldsValue(),

  //     ws_store_id: vendor.id,
  //     vendor_name: vendor.name,
  //     store_phone: vendor.phone,

  //     vendor_phone_id: vendor.store_phone[0].id,
  //     vendor_phone: vendor.store_phone[0].phone,

  //     vendor_address: `${vendor.building} ${vendor.floor}${
  //       vendor.floor ? '층' : ''
  //     } ${vendor.col} ${vendor.loc} ${vendor.ext}`,
  //     vendor_address_buliding: vendor.building,
  //     vendor_address_floor: vendor.floor,
  //     vendor_address_col: vendor.col,
  //     vendor_address_loc: vendor.loc,
  //     vendor_address_ext: vendor.ext,

  //     vendor_account_id: vendor.store_account[0].id,
  //     bank: vendor.store_account[0].bank,
  //     account_holder: vendor.store_account[0].account_holder,
  //     account_number: vendor.store_account[0].account_number,

  //     is_vat_included: false,
  //     biz_name: vendor.company[0]?.name,
  //     biz_num: vendor.company[0]?.biz_num,
  //     owner: vendor.company[0]?.owner,
  //     memo: '',
  //   });
  // };

  const selectVendor = (
    vendor_id: number,
    vendor_name: string,
    vendor_address: string,
    vendor_phone: string,
    is_vat_included: boolean,
  ) => {
    form.setFieldsValue({
      vendor_id,
      vendor_name,
      vendor_address,
      vendor_phone,
      product_code: undefined,
    });
    closeVendorModal();
  };

  useEffect(() => {
    if (visible) return;

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
        title={t('pastAdjustment.create')}
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

          <Form.Item label={t('table.vendorAddress')} required>
            <div css={flexGap}>
              <Form.Item name="vendor_address_buliding" noStyle>
                <TurtleFormSelect placeholder="상가" disabled />
              </Form.Item>

              <Form.Item name="vendor_address_floor" noStyle>
                <TurtleFormInput placeholder="층" disabled />
              </Form.Item>

              <Form.Item name="vendor_address_col" noStyle>
                <TurtleFormInput placeholder="열" disabled />
              </Form.Item>

              <Form.Item name="vendor_address_loc" noStyle>
                <TurtleFormInput placeholder="호" disabled />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item
            name="vendor_address_ext"
            label={t('table.vendorEtcAddress')}
          >
            <TurtleFormInput placeholder="기타 주소를 입력해주세요" disabled />
          </Form.Item>

          <Form.Item label={t('table.accountInfo')} required>
            <div css={flexGap}>
              <Form.Item name="bank" noStyle>
                <TurtleFormSelect placeholder="은행" disabled />
              </Form.Item>

              <Form.Item name="account_number" noStyle>
                <TurtleFormInput placeholder="계좌번호" disabled />
              </Form.Item>

              <Form.Item name="account_holder" noStyle>
                <TurtleFormInput placeholder="예금주명" disabled />
              </Form.Item>
            </div>
          </Form.Item>

          <TurtleDivider marginBottom={37} marginTop={32} />

          <Form.Item
            name="owner"
            label={'사용할 금액'}
            rules={[{ required: true }]}
          >
            <TurtleFormInput placeholder="ex. 7,000" />
          </Form.Item>

          <Form.Item
            name="memo"
            label={t('미결제 금액')}
            rules={[{ required: true }]}
          >
            <TurtleFormInput placeholder="ex. 7,000" />
          </Form.Item>

          <div css={marginTop}>
            <PrimaryButton
              size="large"
              htmlType="submit"
              onClick={() => {
                form.validateFields().then(() => {
                  createVendorMutation.mutate([{ ...form.getFieldsValue() }]);
                });
              }}
            >
              과거매입 추가하기
            </PrimaryButton>
          </div>
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

export default AddPastAdjustmentModal;
