import productAPI, { ProductShow } from '@apis/productAPI';
import { TurtleContentModal } from '@components/combine';
import {
  PrimaryButton,
  TurtleFormInput,
  TurtleNumberInput,
} from '@components/element';
import { message } from '@utils/message';
import { Form, Input } from 'antd';
import { t } from 'i18next';
import React, { useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow: ProductShow;
}

function UpdateProductModal({ visible, closeModal, selectedRow }: Props) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // 상품 수정 요청
  const updateProductQuery = useMutation('updateProduct', productAPI.update, {
    onSuccess: () => {
      message.success(t('message.success update product'));
      queryClient.invalidateQueries('getProductListQuery');
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
      need_update: false,
    });
  }, [selectedRow, visible, form]);

  return (
    <TurtleContentModal
      title={t('title.update product')}
      visible={visible}
      onClose={closeModal}
    >
      <Form
        layout="horizontal"
        form={form}
        colon={false}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
      >
        <Form.Item name="id" hidden>
          <Input hidden />
        </Form.Item>

        <Form.Item label={t('table.vendorName')} name="vendor_name" required>
          <TurtleFormInput disabled placeholder="" />
        </Form.Item>

        <Form.Item
          label={t('table.vendorAddress')}
          name="vendor_address"
          required
        >
          <TurtleFormInput disabled />
        </Form.Item>

        {/* <Divider style={{ borderTopColor: 'rgba(0, 0, 0, 0.06)' }} /> */}
        <Form.Item label={t('table.productName')} name="name" required>
          <TurtleFormInput disabled />
        </Form.Item>

        <Form.Item
          label={t('table.vendorProductName')}
          name="vendor_product_name"
          required
        >
          <TurtleFormInput disabled />
        </Form.Item>

        <Form.Item label={t('table.productCode')} name="product_code" required>
          <TurtleFormInput disabled />
        </Form.Item>

        <Form.Item label={t('table.option')} name="option" required>
          <TurtleFormInput />
        </Form.Item>

        <Form.Item label={t('table.price')} name="price" required>
          <TurtleNumberInput />
        </Form.Item>

        <Form.Item label={t('table.imageUrl')} name="image_url" required>
          <TurtleFormInput />
        </Form.Item>

        <PrimaryButton // 수정하기 Button
          size="large"
          htmlType="submit"
          onClick={() => {
            form.validateFields().then((value) => {
              updateProductQuery.mutate({ ...value, need_update: true });
            });
          }}
          loading={updateProductQuery.isLoading}
        >
          {t('button.updateProduct')}
        </PrimaryButton>
      </Form>
    </TurtleContentModal>
  );
}

export default UpdateProductModal;
