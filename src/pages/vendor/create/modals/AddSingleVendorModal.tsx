import { t } from 'i18next';
import { Button, Form, Input, message, Switch } from 'antd';
import React, { useEffect } from 'react';

import {
  PrimaryButton,
  TurtleDivider,
  TurtleFormInput,
  TurtleFormSearchInput,
  TurtleFormSelect,
} from '@components/element';
import { TurtleContentModal } from '@components/combine';

import vendorAPI, { Wholesale } from '@apis/vendorAPI';
import useModal from '@hooks/useModal';
import { css } from '@emotion/react';
import SearchWsStoreModal from './SearchWsStoreModal';
import useStore from '@hooks/useStore';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function AddSingleVendorModal({ visible, closeModal }: Props) {
  const navigate = useNavigate();
  const { store } = useStore();
  const { isStoreSelected } = useStore();

  const [form] = Form.useForm();
  const [vendorModalVisible, openVendorModal, closeVendorModal] = useModal();

  // 선택된 거래처

  //거래처코드 생성
  const getVendorCodeQuery = useQuery(
    'getVendorCode',
    () =>
      vendorAPI.getCode({
        rt_store_id: store.selected?.id as number,
        ws_store_id: form.getFieldValue('ws_store_id'),
      }),
    {
      enabled: false,
      onSuccess: (data) => {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          vendor_code: data.data,
        });
      },
    },
  );

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
  const HandleFieldFillin = (vendor: Wholesale) => {
    console.log(vendor);
    form.setFieldsValue({
      ...form.getFieldsValue(),

      ws_store_id: vendor.id,
      vendor_name: vendor.name,
      store_phone: vendor.phone,

      vendor_phone_id: vendor.store_phone[0].id,
      vendor_phone: vendor.store_phone[0].phone,

      vendor_address: `${vendor.building} ${vendor.floor}${
        vendor.floor ? '층' : ''
      } ${vendor.col} ${vendor.loc} ${vendor.ext}`,
      vendor_address_buliding: vendor.building,
      vendor_address_floor: vendor.floor,
      vendor_address_col: vendor.col,
      vendor_address_loc: vendor.loc,
      vendor_address_ext: vendor.ext,

      vendor_account_id: vendor.store_account[0].id,
      bank: vendor.store_account[0].bank,
      account_holder: vendor.store_account[0].account_holder,
      account_number: vendor.store_account[0].account_number,

      is_vat_included: false,
      biz_name: vendor.company[0]?.name,
      biz_num: vendor.company[0]?.biz_num,
      owner: vendor.company[0]?.owner,
      memo: '',
    });
  };

  // 코드 만들기 Button 클릭
  const clickCreateVendorCode = () => {
    if (!isStoreSelected()) {
      return;
    }

    console.log(form.getFieldValue('vendor_name'));
    if (!form.getFieldValue('vendor_name')) {
      message.warn('거래처를 선택해 주세요');
      return;
    }

    getVendorCodeQuery.refetch();
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
      <SearchWsStoreModal
        visible={vendorModalVisible}
        closeModal={closeVendorModal}
        onFieldFillin={HandleFieldFillin}
      />

      <TurtleContentModal
        title={t('vendor.addSingle')}
        visible={visible}
        onClose={() => {
          form.resetFields();
          closeModal();
        }}
      >
        <Form
          css={formItemMarginBottom}
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
          {/* <Form.Item name="vendor_name" hidden>
            <Input hidden />
          </Form.Item> */}
          <Form.Item name="vendor_address" hidden>
            <Input hidden />
          </Form.Item>
          <Form.Item name="vendor_account_id" hidden>
            <Input hidden />
          </Form.Item>
          <Form.Item name="vendor_phone_id" hidden>
            <Input hidden />
          </Form.Item>
          <Form.Item name="ws_store_id" hidden>
            <Input hidden />
          </Form.Item>

          <Form.Item
            label={t('table.vendorName')}
            name="vendor_name"
            rules={[{ required: true }]}
          >
            <TurtleFormSearchInput
              readOnly
              onClick={openVendorModal}
              onSearch={openVendorModal}
              placeholder="거래처명을 입력해주세요"
            />
          </Form.Item>

          <Form.Item name="store_phone" label={t('table.wsStoreNumber')}>
            <TurtleFormInput disabled placeholder="매장번호를 입력해주세요" />
          </Form.Item>

          <Form.Item label={t('table.mobile')} name="vendor_phone" required>
            <TurtleFormInput
              disabled
              placeholder="휴대전화번호를 입력해주세요"
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

          <Form.Item
            label={t('table.vendorCode')}
            name="vendor_code"
            rules={[{ required: true }]}
          >
            <TurtleFormInput placeholder="거래처코드를 입력해주세요" disabled />
          </Form.Item>

          <div css={flexEnd}>
            <Button css={createCodeBtn} onClick={clickCreateVendorCode}>
              <span css={createCodeFont}>코드 만들기</span>
            </Button>
          </div>

          <TurtleDivider marginBottom={37} marginTop={32} />

          <Form.Item
            name="is_vat_included"
            label={t('table.vatIncluded')}
            valuePropName="checked"
            required
          >
            <Switch css={$switch} />
          </Form.Item>

          <Form.Item name="biz_name" label={t('table.wsStoreName')}>
            <TurtleFormInput placeholder="상호명을 입력해주세요" />
          </Form.Item>

          <Form.Item name="biz_num" label={t('table.wsCompanyNum')}>
            <TurtleFormInput placeholder="사업자 번호를입력해주세요" />
          </Form.Item>

          <Form.Item name="owner" label={t('table.wsOwner')}>
            <TurtleFormInput placeholder="대표자명을 입력해주세요" />
          </Form.Item>

          <Form.Item name="memo" label={t('table.memo')}>
            <TurtleFormInput placeholder="메모를 입력해주세요" />
          </Form.Item>

          <div css={marginTop}>
            <PrimaryButton
              size="large"
              htmlType="submit"
              onClick={() => {
                form.validateFields().then(() => {
                  console.log(form.getFieldsValue());
                  createVendorMutation.mutate([{ ...form.getFieldsValue() }]);
                });
              }}
            >
              {t('button.addVendor')}
            </PrimaryButton>
          </div>
        </Form>
      </TurtleContentModal>
    </>
  );
}

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

const formItemMarginBottom = css`
  .ant-form-item {
    margin-bottom: 16px;
  }
`;

const flexEnd = css`
  display: flex;
  justify-content: end;
`;

const flexGap = css`
  display: flex;
  gap: 4px;
`;

const marginTop = css`
  margin-top: 44px;
`;

const createCodeBtn = css`
  background: #f0f3f6;
  width: 100px;
  height: 36px;

  &:hover {
    background-color: #f0f3f6;
  }

  &.ant-btn:focus {
    background-color: #f0f3f6;
  }
`;

const createCodeFont = css`
  font-weight: 700;
  color: #6b6d73;
  opacity: 1; // 거래처 선택시 0.5
`;

export default AddSingleVendorModal;
