import { t } from 'i18next';
import { Button, Form, Input, message, Switch } from 'antd';
import React, { useEffect, useState } from 'react';

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
  const { isStoreExist } = useStore();

  const [form] = Form.useForm();
  const [vendorModalVisible, openVendorModal, closeVendorModal] = useModal();

  // 선택된 거래처
  const [selectedVendor, selectVendor] = useState<Wholesale>();

  //거래처코드 생성
  const getVendorCodeQuery = useQuery(
    'getVendorCode',
    () =>
      vendorAPI.getCode({
        rt_store_id: store.id ?? -1,
        ws_store_id: selectedVendor?.id ?? -1,
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
      // selectVendor(undefined);
      form.setFieldsValue({
        rt_store_id: store.id,
      });
      navigate('/vendor/list');
    },
  });

  // 거래처 선택후 폼에 채워넣기
  const fillVendor = (vendor: Wholesale) => {
    selectVendor(vendor);
    form.setFieldsValue({
      ...form.getFieldsValue(),
      vendor_code: undefined,
      vendor_account_id: vendor.store_account[0].id,
      vendor_phone_id: vendor.store_phone[0].id,
      ws_store_id: vendor.id,
      vendor_name: vendor.name,
      vendor_address: `${vendor.building} ${vendor.floor}${
        vendor.floor ? '층' : ''
      } ${vendor.col} ${vendor.loc} ${vendor.ext}`,
      memo: '',
      is_vat_included: false,
      owner: vendor.company[0]?.owner,
      biz_num: vendor.company[0]?.biz_num,
      biz_name: vendor.company[0]?.name,
    });
    closeVendorModal();
  };

  // 코드 만들기 Button 클릭
  const clickCreateVendorCode = () => {
    if (!isStoreExist()) {
      return;
    }
    if (!selectedVendor || selectedVendor.id === -1) {
      message.warn('거래처를 선택해 주세요');
      return;
    }
    getVendorCodeQuery.refetch();
  };

  useEffect(() => {
    if (visible) return;
    form.resetFields();
  }, [visible, form]);

  return (
    <>
      {/*
       * 거래처 검색 모달
       */}
      <SearchWsStoreModal
        visible={vendorModalVisible}
        closeModal={closeVendorModal}
        selectRow={fillVendor}
      />

      <TurtleContentModal
        title={t('vendor.addSingle')}
        visible={visible}
        onClose={closeModal}
      >
        <Form
          css={formItemMarginBottom}
          layout="horizontal"
          form={form}
          colon={false}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          // onFinish={(values) => {
          //   addProduct(values) && closeModal();
          // }}
        >
          {/*  서버 전달용 데이터 */}
          <Form.Item name="rt_store_id" hidden>
            <Input hidden />
          </Form.Item>
          <Form.Item name="vendor_name" hidden>
            <Input hidden />
          </Form.Item>
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

          <Form.Item label={t('table.vendorName')} required>
            <TurtleFormSearchInput // 거래처명 검색 Input
              value={selectedVendor?.name}
              readOnly
              onClick={openVendorModal}
              onSearch={openVendorModal}
              placeholder="거래처명을 입력해주세요"
            />
          </Form.Item>

          <Form.Item required label={t('table.wsStoreNumber')}>
            <TurtleFormInput
              value={selectedVendor?.phone}
              disabled={true}
              placeholder="매장번호를 입력해주세요"
            />
          </Form.Item>

          <Form.Item label={t('table.mobile')} required>
            <TurtleFormInput
              value={selectedVendor?.store_phone[0]?.phone}
              disabled={true}
              placeholder="휴대전화번호를 입력해주세요"
            />
          </Form.Item>

          <Form.Item label={t('table.vendorAddress')} required>
            <div css={flexGap}>
              <Form.Item name="building" noStyle>
                <TurtleFormSelect
                  value={selectedVendor?.building!}
                  placeholder="상가"
                  disabled
                  // items={[{ value: 'asd', name: 'assd' }]}
                />
              </Form.Item>

              <Form.Item noStyle>
                <TurtleFormInput
                  value={selectedVendor?.floor}
                  placeholder="층"
                  disabled={true}
                />
              </Form.Item>

              <Form.Item noStyle>
                <TurtleFormInput
                  value={`${selectedVendor?.col} ${selectedVendor?.loc}`}
                  placeholder="호"
                  disabled={true}
                />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item label={t('table.vendorEtcAddress')} required>
            <TurtleFormInput
              value={selectedVendor?.ext}
              placeholder="기타 주소를 입력해주세요"
              disabled={true}
            />
          </Form.Item>

          <Form.Item label={t('table.accountInfo')} required>
            <div css={flexGap}>
              <Form.Item noStyle>
                <TurtleFormSelect
                  value={selectedVendor?.store_account[0]?.bank!}
                  placeholder="은행"
                  disabled
                  // items={[{ value: 'asd', name: 'assd' }]}
                  // onChange={() => {
                  //   console.log(123);
                  // }}
                />
              </Form.Item>

              <Form.Item noStyle>
                <TurtleFormInput
                  value={selectedVendor?.store_account[0]?.account_number}
                  placeholder="계좌번호"
                  disabled={true}
                />
              </Form.Item>

              <Form.Item noStyle>
                <TurtleFormInput
                  value={selectedVendor?.store_account[0]?.account_holder}
                  placeholder="예금주명"
                  disabled={true}
                />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item name="vendorCode" label={t('table.vendorCode')} required>
            <TurtleFormInput disabled={true} />
          </Form.Item>
          <div css={flexEnd}>
            <Button css={createCodeBtn} onClick={clickCreateVendorCode}>
              <span css={createCodeFont}>코드 만들기</span>
            </Button>
          </div>
          <TurtleDivider marginBottom={37} marginTop={32} />
          <Form.Item label={t('table.vatIncluded')} required>
            <Switch
              css={$switch}
              checked={false}
              onClick={() => {
                // handleVatIncludedUpdate(record);
              }}
            />
          </Form.Item>
          <Form.Item name="wsStoreName" label={t('table.wsStoreName')}>
            <TurtleFormInput placeholder="상호명을 입력해주세요" />
          </Form.Item>
          <Form.Item name="wsCompanyNumber" label={t('table.wsCompanyNum')}>
            <TurtleFormInput placeholder="사업자 번호를입력해주세요" />
          </Form.Item>
          <Form.Item name="companyName" label={t('table.wsOwner')}>
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
`;

const createCodeFont = css`
  font-weight: 700;
  color: #6b6d73;
  opacity: 1; // 거래처 선택시 0.5
`;

export default AddSingleVendorModal;
