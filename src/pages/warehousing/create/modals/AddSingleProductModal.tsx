import { t } from 'i18next';
import { Divider, Form, Input, InputNumber, Row } from 'antd';
import React, { useCallback, useEffect } from 'react';
import {
  PrimaryButton,
  TurtleFormInput,
  TurtleFormSearchInput,
  TurtleNumberInput,
} from '@components/element';
import { TurtleContentModal } from '@components/combine';
import useModal from '@hooks/useModal';
import { pricePattern } from '@utils/pattern';
import SearchProductModal from '@components/combine/modal/SearchProductModal';
import { ProductShow } from '@apis/productAPI';
import useWarehousingCart from '@hooks/useWarehousingCart';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function AddSingleProductModal({ visible, closeModal }: Props) {
  const [form] = Form.useForm();
  const { add } = useWarehousingCart();
  const [productModalVisible, openProductModal, closeProductModal] = useModal();

  const selectProduct = useCallback(
    (product: ProductShow) => {
      form.setFieldsValue({
        vendor_id: product.vendor_info.id,
        vendor_name: product.vendor_info.vendor_name,
        vendor_address: product.vendor_info.vendor_address,
        vendor_phone: product.vendor_info.vendor_phone.phone,
        product_id: product.id,
        product_name: product.name,
        product_code: product.product_code,
        vendor_product_name: product.vendor_product_name,
        product_option: product.option,
        price: product.price,
        count: 1,
      });
      closeProductModal();
    },
    [form, closeProductModal],
  );

  useEffect(() => {
    if (visible) return;
    form.resetFields();
  }, [visible, form]);

  return (
    <>
      {/*
       * 상품 검색 모달
       */}
      <SearchProductModal
        visible={productModalVisible}
        closeModal={closeProductModal}
        onClickSelect={selectProduct}
      />
      {/**
       *  메인 모달
       */}
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
            add(values);
            closeModal();
          }}
        >
          <Form.Item name="vendor_id" hidden>
            <Input hidden />
          </Form.Item>
          <Form.Item name="product_id" hidden>
            <Input hidden />
          </Form.Item>

          <Form.Item
            name="product_name"
            label={t('table.productName')}
            rules={[{ required: true }]}
          >
            <TurtleFormSearchInput // 상품 검색 Input
              onClick={openProductModal}
              onSearch={openProductModal}
              readOnly
            />
          </Form.Item>

          <Form.Item
            label={t('table.vendorProductName')}
            name="vendor_product_name"
            rules={[{ required: true }]}
          >
            <TurtleFormInput // 거래처 상품명 Input
              disabled
            />
          </Form.Item>

          <Form.Item
            label={t('table.productCode')}
            name="product_code"
            rules={[{ required: true }]}
          >
            <TurtleFormInput // 상품 바코드 Input
              disabled
            />
          </Form.Item>

          <Form.Item
            label={t('table.option')}
            name="product_option"
            rules={[{ required: false }]}
          >
            <TurtleFormInput // 상품 옵션 Input
              disabled
            />
          </Form.Item>

          <Form.Item
            label={t('table.price')}
            name="price"
            rules={[{ required: true }]}
          >
            <TurtleNumberInput
              style={{ width: '100%' }}
              step={1000}
              min={0}
              formatter={(value) => `${value}`.replace(pricePattern, ',')}
            />
          </Form.Item>

          <Form.Item
            label={t('table.count')}
            name="count"
            rules={[{ required: true }]}
          >
            <InputNumber // 상품 수량 Input
              style={{ width: '100%' }}
              min={1}
            />
          </Form.Item>

          <Divider />

          <Form.Item
            label={t('table.vendorName')}
            name="vendor_name"
            rules={[{ required: true }]}
          >
            <TurtleFormInput // 거래처명 검색 Input
              disabled
            />
          </Form.Item>

          <Form.Item
            name="vendor_address"
            label={t('table.vendorAddress')}
            rules={[{ required: true }]}
          >
            <TurtleFormInput // 거래처 주소 Input
              disabled
            />
          </Form.Item>

          <Form.Item
            name="vendor_phone"
            label={t('table.mobile')}
            rules={[{ required: true }]}
          >
            <TurtleFormInput // 거래처 휴대번호 Input
              disabled
            />
          </Form.Item>

          <Row justify="end">
            <PrimaryButton size="large" htmlType="submit">
              {t('button.addProduct')}
            </PrimaryButton>
          </Row>
        </Form>
      </TurtleContentModal>
    </>
  );
}

export default AddSingleProductModal;
