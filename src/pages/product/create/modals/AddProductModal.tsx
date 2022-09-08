import { t } from 'i18next';
import { Button, Divider, Form, Input, message, Row, Space } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import { storeState } from '@store/storeState';
import productAPI, { Product } from '@apis/productAPI';
import {
  TurtleFormInput,
  TurtleFormSearchInput,
  TurtlePriceInput,
} from '@components/element';
import { productCartState } from '@store/productCartState';
import { SearchVendorModal, TurtleContentModal } from '@components/combine';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function AddSingleProductModal({ visible, closeModal }: Props) {
  const store = useRecoilValue(storeState);
  const [cart, setCart] = useRecoilState(productCartState);
  const [form] = Form.useForm();
  const [vendorModalVisible, setVendorModalVisible] = useState(false);

  const getProductCodeQuery = useQuery(
    'getProductCode', //
    () =>
      productAPI.getCode({
        rt_store_id: store.id!,
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

  // 상품 추가
  const addProduct = useCallback(
    (addedProduct: Product) => {
      if (
        cart.successList.find(
          (product) => product.product_code === addedProduct.product_code,
        )
      ) {
        message.warn(t('message.already exist product'));
        return;
      }
      setCart((cart) => ({
        ...cart,
        successList: [
          {
            ...addedProduct,
            price: addedProduct.price,
            need_update: false,
          },
          ...cart.successList,
        ],
      }));
      closeModal();
    },
    [cart.successList, setCart, closeModal],
  );

  useEffect(() => {
    if (visible) return;
    form.resetFields();
  }, [visible, form]);

  return (
    <>
      <TurtleContentModal
        title={t('product.add single')}
        visible={visible}
        onClose={closeModal}
      >
        <Form
          layout="horizontal"
          form={form}
          colon={false}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 16 }}
          onFinish={addProduct}
        >
          <Form.Item name="rt_store_id" hidden>
            <Input hidden />
          </Form.Item>

          <Form.Item name="vendor_id" hidden>
            <Input hidden />
          </Form.Item>

          <Form.Item
            name="vendor_name"
            label={t('vendor.name')}
            rules={[{ required: true }]}
          >
            <TurtleFormSearchInput // 거래처명 검색 Input
              name="vendor_name"
              placeholder={t('placeholder.vendor name')}
              onClick={() => {
                setVendorModalVisible(true);
              }}
            />
          </Form.Item>

          <Form.Item
            name="vendor_address"
            label={t('vendor.address')}
            rules={[{ required: true }]}
          >
            <TurtleFormInput disabled={true} />
          </Form.Item>

          <Form.Item
            name="vendor_phone"
            label={t('vendor.store phone')}
            rules={[{ required: true }]}
          >
            <TurtleFormInput disabled={true} />
          </Form.Item>

          <Divider />

          <Form.Item name="name" label="상품명" rules={[{ required: true }]}>
            <TurtleFormInput />
          </Form.Item>

          <Form.Item
            label="거래처 상품명"
            name="vendor_product_name"
            rules={[{ required: true }]}
          >
            <TurtleFormInput />
          </Form.Item>

          <Form.Item // 거래처 코드 Input
            required
            label={t('product.code')}
            style={{ marginBottom: 0 }}
          >
            <Space>
              <Form.Item
                name="product_code"
                rules={[
                  { required: true, message: '상품 바코드 입력해 주세요' },
                ]}
              >
                <TurtleFormInput disabled />
              </Form.Item>
              <Form.Item>
                <Button onClick={createProductCode}>코드 만들기</Button>
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item name="option" label="옵션">
            <TurtleFormInput />
          </Form.Item>

          <Form.Item name="price" label="가격" rules={[{ required: true }]}>
            <TurtlePriceInput style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="상품 이미지 URL"
            name="image_url"
            rules={[{ required: true }]}
          >
            <TurtleFormInput required={false} />
          </Form.Item>

          <Form.Item
            name="memo"
            label={t('vendor.memo')}
            rules={[{ required: false }]}
          >
            <Input.TextArea // 메모 TextArea
              placeholder={t('placeholder.memo')}
              rows={5}
            />
          </Form.Item>

          <Row justify="end">
            <Button type="default" htmlType="submit">
              {t('button.add product')}
            </Button>
          </Row>
        </Form>
      </TurtleContentModal>

      {/* 거래처 검색 모달 */}
      <SearchVendorModal
        visible={vendorModalVisible}
        closeModal={() => {
          setVendorModalVisible(false);
        }}
        onClickSelect={selectVendor}
      />
    </>
  );
}

export default AddSingleProductModal;
