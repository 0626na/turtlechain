import { t } from 'i18next';
import { Divider, Form, Input, InputNumber, Row } from 'antd';
import { useCallback, useState } from 'react';
import { pricePattern } from '@utils/pattern';
import { AdjustmentItem } from '@apis/adjustmentAPI';
import {
  TurtleButton,
  TurtleInput,
  TurtleInputNumber,
  TurtleModal,
  TurtleSearchInput,
  TurtleTextArea,
} from '@components/common';
import { SearchProductModal, SearchVendorModal } from '@components/combine';

interface Props {
  visible: boolean;
  closeModal: () => void;
  addItem: (item: AdjustmentItem) => boolean;
}

function AddSingleProductModal({ visible, closeModal, addItem }: Props) {
  const [form] = Form.useForm();
  const [vendorModalVisible, setVendorModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);

  const selectVendor = useCallback(
    (vendor_id, vendor_name, vendor_address, vendor_phone, is_vat_included) => {
      form.setFieldsValue({
        vendor_id,
        vendor_name,
        vendor_address,
        vendor_phone,
        is_vat_included,
        product_id: undefined,
        product_name: undefined,
        product_code: undefined,
        vendor_product_name: undefined,
        product_option: undefined,
        product_price: undefined,
        product_count: undefined,
        type: undefined,
        memo: undefined,
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
      product_price,
    ) => {
      form.setFieldsValue({
        product_id,
        product_name,
        vendor_product_name,
        product_code,
        product_option,
        product_price,
        product_count: 1,
      });
      setProductModalVisible(false);
    },
    [form],
  );

  const onCloseModal = useCallback(() => {
    form.resetFields();
    closeModal();
  }, [form, closeModal]);

  return (
    <>
      <TurtleModal
        centered
        width="520px"
        title={t('adjustment.add reserve product')}
        visible={visible}
        onCancel={onCloseModal}
        footer={false}
        forceRender
      >
        <Form
          layout="horizontal"
          form={form}
          colon={false}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 16 }}
          onFinish={(value) => {
            addItem({
              ...value,
              type: 'reserve',
              warehousing_item_id: 0,
            }) && onCloseModal();
          }}
        >
          <Form.Item name="vendor_id" hidden>
            <Input hidden />
          </Form.Item>
          <Form.Item name="product_id" hidden>
            <Input hidden />
          </Form.Item>
          <Form.Item name="is_vat_included" hidden>
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
            name="product_price"
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
            name="product_count"
            min={1}
          />

          <TurtleTextArea name="memo" label={t('adjustment.memo')} rows={3} />

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
