import { t } from 'i18next';
import { MutableRefObject, useCallback, useEffect, useState } from 'react';
import { Divider, Form, Input, InputNumber, Row } from 'antd';
import { useSetRecoilState } from 'recoil';
import { pricePattern } from '@utils/pattern';
import { WarehousingItemConnect } from '@apis/warehousingAPI';
import {
  TurtleButton,
  TurtleInput,
  TurtleInputNumber,
  TurtleModal,
  TurtleSearchInput,
} from '@components/common';
import { SearchProductModal, SearchVendorModal } from '@components/combine';
import { warehousingCartState } from '@store/warehousingCartState';

interface Props {
  visible: boolean;
  closeModal: () => void;
  index: MutableRefObject<number>;
}

function AddSingleProductModal({ visible, closeModal, index }: Props) {
  const setCart = useSetRecoilState(warehousingCartState);
  const [form] = Form.useForm();
  const [vendorModalVisible, setVendorModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);

  const selectVendor = useCallback(
    (vendor_id, vendor_name, vendor_address, vendor_phone) => {
      form.setFieldsValue({
        vendor_id,
        vendor_name,
        vendor_address,
        vendor_phone,
        product_id: undefined,
        product_name: undefined,
        product_code: undefined,
        vendor_product_name: undefined,
        product_option: undefined,
        supply_price: undefined,
        vat_price: undefined,
        count: undefined,
      });
      setVendorModalVisible(false);
    },
    [form],
  );

  const selectProduct = useCallback(
    (
      product_id,
      product_name,
      product_code,
      vendor_product_name,
      product_option,
      supply_price,
    ) => {
      form.setFieldsValue({
        product_id,
        product_name,
        vendor_product_name,
        product_code,
        product_option,
        supply_price,
        count: 1,
      });
      setProductModalVisible(false);
    },
    [form],
  );

  // 상품 추가
  const addItem = useCallback(
    (item: WarehousingItemConnect) => {
      setCart((cart) => ({
        ...cart,
        successList: [
          {
            ...item,
            vat_price: Math.round(item.supply_price * 0.1),
            is_reserved: false,
            index: index.current++,
          },
          ...cart.successList,
        ],
      }));
      closeModal();
    },
    [setCart, index, closeModal],
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
        getContainer={false}
        forceRender
      >
        <Form
          layout="horizontal"
          form={form}
          colon={false}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 16 }}
          onFinish={addItem}
        >
          <Form.Item name="vendor_id" hidden>
            <Input hidden />
          </Form.Item>
          <Form.Item name="product_id" hidden>
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
            disabled
          />
          <TurtleInput // 거래처 휴대번호 Input
            name="vendor_phone"
            label={t('vendor.store phone')}
            disabled
          />

          <Divider />

          <TurtleSearchInput // 상품 검색 Input
            name="product_name"
            label={t('product.name')}
            placeholder={t('placeholder.product name')}
            onClick={() => {
              setProductModalVisible(true);
            }}
          />
          <TurtleInput // 거래처 상품명 Input
            label={t('product.vendor product name')}
            name="vendor_product_name"
            disabled
          />
          <TurtleInput // 상품 바코드 Input
            label={t('product.code')}
            name="product_code"
            disabled
          />
          <TurtleInput // 상품 옵션 Input
            label={t('product.option')}
            name="product_option"
            disabled
          />
          <Form.Item // 상품 공급가 Input
            label={t('product.supply price')}
            name="supply_price"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              step={1000}
              min={0}
              formatter={(value) => `${value}`.replace(pricePattern, ',')}
            />
          </Form.Item>
          <TurtleInputNumber // 상품 수량 Input
            label={t('product.count')}
            name="count"
            min={1}
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

      {/* 상품 검색 모달 */}
      <SearchProductModal
        visible={productModalVisible}
        closeModal={() => {
          setProductModalVisible(false);
        }}
        vendorId={form.getFieldValue('vendor_id')}
        onClickSelect={selectProduct}
      />
    </>
  );
}

export default AddSingleProductModal;
