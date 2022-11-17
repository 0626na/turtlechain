import { t } from 'i18next';
import { Form, Input, Row } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import { message } from '@utils/message';
import productAPI from '@apis/productAPI';
import {
  AddButton,
  PrimaryButton,
  TurtleDivider,
  TurtleFormInput,
  TurtleFormSearchInput,
  TurtleNumberInput,
} from '@components/element';
import { SearchVendorModal, TurtleContentModal } from '@components/combine';
import useStore from '@hooks/useStore';
import useProductCart from '@hooks/useProductCart';
import { css } from '@emotion/react';
import useModal from '@hooks/useModal';
import { Vendor } from '@apis/vendorAPI';
import { englishAndNumberPatten, notNumPattern } from '@utils/pattern';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function AddSingleProductModal({ visible, closeModal }: Props) {
  const { store } = useStore();
  const { addProduct } = useProductCart();
  const [form] = Form.useForm();
  const [vendorModalVisible, openVendorModal, closeVendorModal] = useModal();

  const getProductCodeQuery = useQuery(
    'getProductCode', //
    () =>
      productAPI.getCode({
        rt_store_id: store.selected?.id ?? -1,
        vendor_code: form.getFieldValue('vendor_id'),
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

  const getProductCodeDuplicationCheckQuery = useQuery(
    'getProductCodeDuplicationCheck',
    () =>
      productAPI.getProductCodeDuplicationCheck({
        rt_store_id: store.selected?.id ?? -1,
        product_code: form.getFieldValue('product_code'),
      }),
    {
      enabled: false,
      onSuccess: (data) => {
        if (data.data.msg === t('product.notDuplication'))
          message.success(t('product.message.notDuplication'));
        if (data.data.msg === t('product.duplication'))
          message.success(t('product.message.duplication'));
      },
    },
  );

  const checkDuplicationConfirmExecution =
    getProductCodeDuplicationCheckQuery.data?.data.msg !==
    t('product.notDuplication');

  const selectVendor = useCallback(
    (record: Vendor) => {
      form.setFieldsValue({
        ...form.getFieldsValue(),
        vendor_id: record.id,
        vendor_name: record.vendor_name,
        vendor_address: record.vendor_address,
        vendor_phone: record.vendor_phone.phone,
        product_code: undefined,
      });
      closeVendorModal();
    },
    [closeVendorModal, form],
  );

  const checkProductCodeDuplication = useCallback(() => {
    if (!form.getFieldValue('product_code')) {
      message.warn(t('product.message.inputProductCode'));
      return;
    }
    getProductCodeDuplicationCheckQuery.refetch();
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
        title={t('product.addSingle')}
        visible={visible}
        onClose={closeModal}
      >
        <Form
          layout="horizontal"
          form={form}
          colon={false}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          onFinish={(values) => {
            addProduct(values) && closeModal();
          }}
        >
          <Form.Item name="rt_store_id" hidden>
            <Input hidden />
          </Form.Item>
          <Form.Item name="vendor_id" hidden>
            <Input hidden />
          </Form.Item>

          <Form.Item
            name="vendor_name"
            label={t('table.vendorName')}
            rules={[{ required: true }]}
          >
            <TurtleFormSearchInput // 거래처명 검색 Input
              onClick={openVendorModal}
              onSearch={openVendorModal}
              readOnly
              placeholder="거래처명을 입력해주세요"
            />
          </Form.Item>
          <Form.Item
            name="vendor_address"
            label={t('table.vendorAddress')}
            rules={[{ required: true }]}
          >
            <TurtleFormInput disabled placeholder="거래처주소를 입력해주세요" />
          </Form.Item>

          <Form.Item
            label={t('table.otherAddress')}
            rules={[{ required: false }]}
          >
            <TurtleFormInput
              disabled
              value={form.getFieldValue('ws_store_info')?.ext ?? ''}
              placeholder="기타 주소를 입력해주세요"
            />
          </Form.Item>

          <Form.Item
            name="vendor_phone"
            label={t('table.mobile')}
            rules={[{ required: true }]}
          >
            <TurtleFormInput
              disabled
              placeholder="휴대전화 번호를 입력해주세요"
            />
          </Form.Item>

          <TurtleDivider marginTop={32} marginBottom={32} />

          <Form.Item
            name="name"
            label={t('table.productName')}
            rules={[{ required: true }]}
          >
            <TurtleFormInput placeholder="ex.우디 투웨이 후드 집업" />
          </Form.Item>

          <Form.Item
            name="vendor_product_name"
            label={t('table.vendorProductName')}
            rules={[{ required: true }]}
          >
            <TurtleFormInput placeholder="ex.우디 투웨이 후드 집업" />
          </Form.Item>

          <Form.Item
            name="product_code"
            label={t('table.productCode')}
            rules={[{ required: true, message: '상품 바코드 입력해 주세요' }]}
          >
            <TurtleFormInput
              placeholder="코드를 입력해주세요"
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  englishAndNumberPatten,
                  '',
                );
              }}
            />
          </Form.Item>

          <div css={flexLayout}>
            {/* 컴포넌트는 AddButton이지만 기능은 추가가 아닌 새로 입력한 상품바코드와 기존에 등록되어 있는 상품바코드중에 중복이 있는지를 확인하는 기능 */}
            <AddButton onClick={checkProductCodeDuplication}>
              {t('product.duplicateCheckProductCode')}
            </AddButton>
          </div>

          <Form.Item
            name="option"
            label={t('table.option')}
            rules={[{ required: true }]}
          >
            <TurtleFormInput placeholder="ex.블랙,one size" />
          </Form.Item>

          <Form.Item
            name="price"
            label={t('table.price')}
            rules={[{ required: true }]}
          >
            <TurtleNumberInput placeholder="ex.7,000" />
          </Form.Item>

          <Form.Item
            label={t('table.imageUrl')}
            name="image_url"
            rules={[{ required: false }]}
          >
            <TurtleFormInput placeholder="ex.https://kkobugi.co.kr/.." />
          </Form.Item>

          <Form.Item
            name="memo"
            label={t('table.memo')}
            rules={[{ required: false }]}
          >
            <TurtleFormInput placeholder="메모를 입력해주세요." />
          </Form.Item>

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => (
              <Row css={{ marginTop: 60 }}>
                <PrimaryButton
                  size="large"
                  htmlType="submit"
                  disabled={
                    !getFieldValue('vendor_name') ||
                    !getFieldValue('name') ||
                    !getFieldValue('vendor_product_name') ||
                    !getFieldValue('product_code') ||
                    !getFieldValue('option') ||
                    !getFieldValue('price') ||
                    checkDuplicationConfirmExecution //바코드 중복체크를 실행해서 중복없음을 확인했는지
                  }
                >
                  {t('button.addProduct')}
                </PrimaryButton>
              </Row>
            )}
          </Form.Item>
        </Form>
      </TurtleContentModal>
    </>
  );
}

const flexLayout = css`
  display: flex;
  justify-content: end;
  margin-bottom: 16px;
  margin-top: -4px;
`;

export default AddSingleProductModal;
