import { t } from 'i18next';
import { Button, Form, message, Switch } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';

import {
  PrimaryButton,
  TurtleDivider,
  TurtleFormInput,
  TurtleFormSearchInput,
  TurtleFormSelect,
} from '@components/element';
import { SearchVendorModal, TurtleContentModal } from '@components/combine';
import useStore from '@hooks/useStore';
import useProductCart from '@hooks/useProductCart';
import vendorAPI from '@apis/vendorAPI';
import useModal from '@hooks/useModal';
import { css } from '@emotion/react';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function AddSingleVendorModal({ visible, closeModal }: Props) {
  const { store } = useStore();
  const { addProduct } = useProductCart();
  const [form] = Form.useForm();
  const [vendorModalVisible, openVendorModal, closeVendorModal] = useModal();

  const getVendorCodeQuery = useQuery(
    'getVendorCode', //
    () =>
      vendorAPI.getCode({
        rt_store_id: store.id!,
        ws_store_id: form.getFieldValue('vendor_id'),
      }),
    {
      enabled: false,
      onSuccess: (data) => {
        form.setFieldsValue({
          ...form.getFieldsValue,
          product_code: data.data,
        });
      },
    },
  );

  const selectVendor = useCallback(
    (vendor_id, vendor_name, vendor_address, vendor_phone) => {
      form.setFieldsValue({
        vendor_id,
        vendor_name,
        vendor_address,
        vendor_phone,
        product_code: undefined,
      });
      closeVendorModal();
    },
    [form],
  );

  const createProductCode = useCallback(() => {
    if (!form.getFieldValue('vendor_id')) {
      message.warn('거래처를 선택해 주세요.');
      return;
    }
    getVendorCodeQuery.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  useEffect(() => {
    if (visible) return;
    form.resetFields();
  }, [visible, form]);

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
        title={t('vendor.addSingle')}
        visible={visible}
        onClose={closeModal}
      >
        <Form
          css={formItemMarginButtom}
          layout="horizontal"
          form={form}
          colon={false}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          onFinish={(values) => {
            addProduct(values) && closeModal();
          }}
        >
          <Form.Item name="vendor_name" label={t('table.vendorName')} required>
            <TurtleFormSearchInput // 거래처명 검색 Input
              readOnly
              onClick={openVendorModal}
              onSearch={openVendorModal}
              placeholder="거래처명을 입력해주세요"
            />
          </Form.Item>

          <Form.Item
            required
            label={t('table.wsStoreNumber')}
            name="wsStore_number"
          >
            <TurtleFormInput
              disabled={true}
              placeholder="매장번호를 입력해주세요"
            />
          </Form.Item>

          <Form.Item name="mobile" label={t('table.mobile')} required>
            <TurtleFormInput
              disabled={true}
              placeholder="휴대전화번호를 입력해주세요"
            />
          </Form.Item>

          <Form.Item label={t('table.vendorAddress')} required>
            <div css={flexGap}>
              <Form.Item name="" noStyle>
                <TurtleFormSelect
                  placeholder="상가"
                  disabled
                  value={'거래처명'}
                  items={[{ value: 'asd', name: 'assd' }]}
                  onChange={() => {
                    console.log(123);
                  }}
                />
              </Form.Item>

              <Form.Item name="field" noStyle>
                <TurtleFormInput placeholder="층" disabled={true} />
              </Form.Item>

              <Form.Item name="field" noStyle>
                <TurtleFormInput placeholder="호" disabled={true} />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item
            name="vendor_ect_address"
            label={t('table.vendorEtcAddress')}
            required
          >
            <TurtleFormInput
              placeholder="기타 주소를 입력해주세요"
              disabled={true}
            />
          </Form.Item>

          <Form.Item label={t('table.accountInfo')} required>
            <div css={flexGap}>
              <Form.Item name="" noStyle>
                <TurtleFormSelect
                  placeholder="은행"
                  disabled
                  value={'거래처명'}
                  items={[{ value: 'asd', name: 'assd' }]}
                  onChange={() => {
                    console.log(123);
                  }}
                />
              </Form.Item>

              <Form.Item name="field" noStyle>
                <TurtleFormInput placeholder="계좌번호" disabled={true} />
              </Form.Item>

              <Form.Item name="field" noStyle>
                <TurtleFormInput placeholder="예금주명" disabled={true} />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item name="vendor_code" label={t('table.vendorCode')} required>
            <TurtleFormInput disabled={true} />
          </Form.Item>
          <div css={flexEnd}>
            <Button css={createCodeBtn} onClick={createProductCode}>
              <span css={createCodeFont}>코드 만들기</span>
            </Button>
          </div>
          <TurtleDivider marginBottom={37} marginTop={32} />
          <Form.Item name="name" label={t('table.vatIncluded')} required>
            <Switch
              css={$switch}
              checked={false}
              onClick={() => {
                // handleVatIncludedUpdate(record);
              }}
            />
          </Form.Item>
          <Form.Item name="ws_store_name" label={t('table.wsStoreName')}>
            <TurtleFormInput placeholder="상호명을 입력해주세요" />
          </Form.Item>
          <Form.Item name="ws_company_num" label={t('table.wsCompanyNum')}>
            <TurtleFormInput placeholder="사업자 번호를입력해주세요" />
          </Form.Item>
          <Form.Item name="company_name" label={t('table.wsOwner')}>
            <TurtleFormInput placeholder="대표자명을 입력해주세요" />
          </Form.Item>
          <Form.Item name="memo" label={t('table.memo')}>
            <TurtleFormInput placeholder="메모를 입력해주세요" />
          </Form.Item>

          <div css={marginTop}>
            <PrimaryButton size="large" htmlType="submit">
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

const formItemMarginButtom = css`
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
