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
import { css } from '@emotion/react';

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
        title={t('title.add warehousing')}
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

          {/* 상품명 */}
          <Form.Item
            name="product_name"
            label={t('table.productName')}
            rules={[{ required: true }]}
          >
            <TurtleFormSearchInput // 상품 검색 Input
              onClick={openProductModal}
              onSearch={openProductModal}
              placeholder={t('placeholder.input product name')}
              readOnly
            />
          </Form.Item>
          {/* 거래처 상품명 */}
          <Form.Item
            label={t('table.vendorProductName')}
            name="vendor_product_name"
            rules={[{ required: true }]}
          >
            <TurtleFormInput // 거래처 상품명 Input
              disabled
              placeholder={t('placeholder.input vendor product name')}
            />
          </Form.Item>

          {/* 상품 바코드 */}
          <Form.Item
            label={t('table.productCode')}
            name="product_code"
            rules={[{ required: true }]}
          >
            <TurtleFormInput // 상품 바코드 Input
              disabled
              placeholder={t('placeholder.input product code')}
            />
          </Form.Item>

          {/* 옵션 */}
          <Form.Item
            label={t('table.option')}
            name="product_option"
            rules={[{ required: false }]}
          >
            <TurtleFormInput // 상품 옵션 Input
              disabled
              placeholder={t('placeholder.input option')}
            />
          </Form.Item>

          {/* 가격 */}
          <Form.Item
            label={t('table.price')}
            name="price"
            rules={[{ required: true }]}
          >
            <TurtleNumberInput
              formatter={(value) => `${value}`.replace(pricePattern, ',')}
              placeholder={t('placeholder.ex. price example')}
            />
          </Form.Item>

          {/* 수량 */}
          <Form.Item
            label={t('table.count')}
            name="count"
            rules={[{ required: true }]}
          >
            <TurtleNumberInput
              min={1}
              placeholder={t('placeholder.ex. count example')}
            />
          </Form.Item>

          <Divider />

          {/* 거래처명 */}
          <Form.Item
            label={t('table.vendorName')}
            name="vendor_name"
            rules={[{ required: true }]}
          >
            <TurtleFormInput // 거래처명 검색 Input
              disabled
              placeholder={t('placeholder.input vendor name')}
            />
          </Form.Item>

          {/* 거래처 주소 */}
          <Form.Item
            name="vendor_address"
            label={t('table.vendorAddress')}
            rules={[{ required: true }]}
          >
            <TurtleFormInput // 거래처 주소 Input
              disabled
              placeholder={t('placeholder.input vendor address')}
            />
          </Form.Item>

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => (
              <Row css={marginTop}>
                <PrimaryButton
                  disabled={
                    !getFieldValue('product_name') ||
                    !getFieldValue('count') ||
                    !getFieldValue('price')
                  }
                  size="large"
                  htmlType="submit"
                >
                  {t('button.addWarehousing')}
                </PrimaryButton>
              </Row>
            )}
          </Form.Item>
        </Form>
      </TurtleContentModal>
    </>
  );
}

const marginTop = css({
  marginTop: 60,
});
export default AddSingleProductModal;
