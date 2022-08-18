import { t } from 'i18next';
import { Divider, Form, Input, message, Popconfirm, Row } from 'antd';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import productAPI, { ProductShow } from '@apis/productAPI';
import {
  TurtleButton,
  TurtleInput,
  TurtleInputPrice,
  TurtleModal,
  TurtleTextArea,
} from '@components/common';

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow?: ProductShow;
}

function UpdateProductModal({ visible, closeModal, selectedRow }: Props) {
  const [form] = Form.useForm();

  // 상품 수정 요청
  const updateProductQuery = useMutation('updateProduct', productAPI.update, {
    onSuccess: () => {
      message.success('성공적으로 수정하였습니다.');
      closeModal();
    },
  });

  // 모달 렌더링 될 때 상품정보 채워주기
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: selectedRow?.id,
      name: selectedRow?.name,
      vendor_product_name: selectedRow?.vendor_product_name,
      product_code: selectedRow?.product_code,
      option: selectedRow?.option,
      price: selectedRow?.price,
      image_url: selectedRow?.image_url,
      memo: selectedRow?.memo,
      vendor_name: selectedRow?.vendor_info.vendor_name,
      vendor_address: selectedRow?.vendor_info.vendor_address,
      vendor_phone: selectedRow?.vendor_info.vendor_phone.phone,
      need_update: false,
    });
  }, [selectedRow, visible, form]);

  return (
    <TurtleModal
      centered
      width="520px"
      title={t('product.update info')}
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
      >
        <Form.Item name="id" hidden>
          <Input hidden />
        </Form.Item>

        <TurtleInput // 거래처명 Input
          name="vendor_name"
          label={t('vendor.name')}
          disabled={true}
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
        <Divider style={{ borderTopColor: 'rgba(0, 0, 0, 0.06)' }} />
        <TurtleInput // 상품명 Input
          label={t('product.name')}
          name="name"
          required={true}
        />
        <TurtleInput // 거래처 상품명 Input
          label={t('product.vendor product name')}
          name="vendor_product_name"
          required={true}
          disabled={true}
        />
        <TurtleInput // 상품 바코드 Input
          label={t('product.code')}
          name="product_code"
          disabled={true}
        />
        <TurtleInput // 옵션 Input
          label={t('product.option')}
          name="option"
        />
        <Form.Item
          name="price"
          label={t('product.price')}
          rules={[{ required: true }]}
        >
          <TurtleInputPrice style={{ width: '100%' }} />
        </Form.Item>
        <TurtleInput
          label={t('product.image url')}
          name="image_url"
          required={false}
        />
        <TurtleTextArea
          required={false}
          label={t('vendor.memo')}
          name="memo"
          placeholder={t('placeholder.memo')}
          rows={5}
        />
      </Form>

      <Row justify="end">
        <Popconfirm
          title={t('description.really update')}
          okText={t('yes')}
          cancelText={t('no')}
          onConfirm={() => {
            form.validateFields().then((value) => {
              updateProductQuery.mutate({ ...value, need_update: true });
            });
          }}
        >
          <TurtleButton // 수정하기 Button
            type="primary"
            loading={updateProductQuery.isLoading}
          >
            {t('button.update')}
          </TurtleButton>
        </Popconfirm>
      </Row>
    </TurtleModal>
  );
}

export default UpdateProductModal;
