import { t } from 'i18next';
import { Button, Divider, Form, Input, message, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import productAPI from '@apis/productAPI';
import {
  PrimaryButton,
  TurtleFormInput,
  TurtleFormSearchInput,
  TurtlePriceInput,
} from '@components/element';
import { SearchVendorModal, TurtleContentModal } from '@components/combine';
import useStore from '@hooks/useStore';
import useProductCart from '@hooks/useProductCart';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function AddSingleProductModal({ visible, closeModal }: Props) {
  const { store } = useStore();
  const { addProduct } = useProductCart();
  const [form] = Form.useForm();
  const [vendorModalVisible, setVendorModalVisible] = useState(false);

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

  const openVendorModal = useCallback(() => {
    setVendorModalVisible(true);
  }, []);

  const closeVendorModal = useCallback(() => {
    setVendorModalVisible(false);
  }, []);

  const selectVendor = useCallback(
    (vendor_id, vendor_name, vendor_address, vendor_phone) => {
      form.setFieldsValue({
        vendor_id,
        vendor_name,
        vendor_address,
        vendor_phone,
        product_code: undefined,
      });
      setVendorModalVisible(false);
    },
    [form],
  );

  const createProductCode = useCallback(() => {
    if (!form.getFieldValue('vendor_id')) {
      message.warn('거래처를 선택해 주세요.');
      return;
    }
    getProductCodeQuery.refetch();
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
            />
          </Form.Item>

          <Form.Item
            name="vendor_address"
            label={t('table.vendorAddress')}
            rules={[{ required: true }]}
          >
            <TurtleFormInput disabled={true} />
          </Form.Item>

          <Form.Item
            name="vendor_phone"
            label={t('table.mobile')}
            rules={[{ required: true }]}
          >
            <TurtleFormInput disabled={true} />
          </Form.Item>

          <Divider />

          <Form.Item
            name="name"
            label={t('table.productName')}
            rules={[{ required: true }]}
          >
            <TurtleFormInput />
          </Form.Item>

          <Form.Item
            name="vendor_product_name"
            label={t('table.vendorProductName')}
            rules={[{ required: true }]}
          >
            <TurtleFormInput />
          </Form.Item>

          <Form.Item
            name="product_code"
            label={t('table.productCode')}
            rules={[{ required: true, message: '상품 바코드 입력해 주세요' }]}
          >
            <TurtleFormInput disabled />
          </Form.Item>

          <Form.Item>
            <Button onClick={createProductCode}>코드 만들기</Button>
          </Form.Item>

          <Form.Item
            name="option"
            label={t('table.option')}
            rules={[{ required: true }]}
          >
            <TurtleFormInput />
          </Form.Item>

          <Form.Item
            name="price"
            label={t('table.price')}
            rules={[{ required: true }]}
          >
            <TurtlePriceInput style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label={t('table.imageUrl')}
            name="image_url"
            rules={[{ required: false }]}
          >
            <TurtleFormInput />
          </Form.Item>

          <Form.Item
            name="memo"
            label={t('table.memo')}
            rules={[{ required: false }]}
          >
            <Input.TextArea rows={5} />
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
