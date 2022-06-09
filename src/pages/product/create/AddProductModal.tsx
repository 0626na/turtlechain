import { t } from 'i18next';
import { Divider, Form, Input, message, Row, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import { storeState } from '@store/storeState';
import productAPI, { Product } from '@apis/productAPI';
import {
  TurtleButton,
  TurtleButtonSub,
  TurtleInput,
  TurtleInputPrice,
  TurtleModal,
  TurtleSearchInput,
  TurtleTextArea,
} from '@components/common';
import { SearchVendorModal } from '@components/combine';
import { productCartState } from '@store/productCartState';

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
            vat_price: Math.round(addedProduct.supply_price * 0.1),
          },
          ...cart.successList,
        ],
      }));
      closeModal();
    },
    [cart.successList, setCart, closeModal],
  );

  useEffect(() => {
    form.resetFields();
  }, [visible, form]);

  return (
    <>
      <TurtleModal
        centered
        width="520px"
        title={t('product.add single')}
        visible={visible}
        onCancel={closeModal}
        footer={false}
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

          <TurtleSearchInput // 거래처명 검색 Input
            name="vendor_name"
            label={t('vendor.name')}
            placeholder={t('placeholder.vendor name')}
            onClick={() => {
              setVendorModalVisible(true);
            }}
          />
          <TurtleInput // 거래처 주소 Input
            name="vendor_address"
            label={t('vendor.address')}
            disabled={true}
          />
          <TurtleInput // 거래처 휴대번호 Input
            name="vendor_phone"
            label={t('vendor.store phone')}
            disabled={true}
          />
          <Divider />
          <TurtleInput label="상품명" name="name" required={true} />
          <TurtleInput
            label="거래처 상품명"
            name="vendor_product_name"
            required={true}
          />
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
                <Input disabled />
              </Form.Item>
              <Form.Item>
                <TurtleButtonSub color="blue" onClick={createProductCode}>
                  코드 만들기
                </TurtleButtonSub>
              </Form.Item>
            </Space>
          </Form.Item>
          <TurtleInput label="옵션" name="option" />
          <Form.Item
            name="supply_price"
            label="공급가"
            rules={[{ required: true }]}
          >
            <TurtleInputPrice style={{ width: '100%' }} />
          </Form.Item>
          <TurtleInput
            label="상품 이미지 URL"
            name="image_url"
            required={false}
          />
          <TurtleTextArea // 메모 TextArea
            required={false}
            name="memo"
            label={t('vendor.memo')}
            placeholder={t('placeholder.memo')}
            rows={5}
          />

          <Row justify="end">
            <TurtleButton type="default" htmlType="submit">
              {t('button.add product')}
            </TurtleButton>
          </Row>
        </Form>
      </TurtleModal>

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
