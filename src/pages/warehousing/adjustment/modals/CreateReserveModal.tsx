import { t } from 'i18next';
import { Form, Input } from 'antd';
import React, { useCallback, useEffect } from 'react';
import {
  PrimaryButton,
  TurtleDivider,
  TurtleFormInput,
  TurtleFormSearchInput,
  TurtleNumberInput,
} from '@components/element';
import { TurtleContentModal } from '@components/combine';
import useModal from '@hooks/useModal';
import { pricePattern } from '@utils/pattern';
import SearchProductModal from '@components/combine/modal/SearchProductModal';
import { ProductShow } from '@apis/productAPI';

import adjustmentAPI from '@apis/adjustmentAPI';
import { useMutation, useQueryClient } from 'react-query';
import { useStore } from '@hooks/index';
import { css } from '@emotion/react';
import { message } from '@utils/message';
interface Props {
  visible: boolean;
  closeModal: () => void;
}

function AddReserveModal({ visible, closeModal }: Props) {
  const queryClient = useQueryClient();

  const { store } = useStore();
  const [form] = Form.useForm();

  const [productModalVisible, openProductModal, closeProductModal] = useModal();

  // 미송 상품 추가 요청
  const createReserveMutation = useMutation(adjustmentAPI.create, {
    onSuccess: () => {
      queryClient.refetchQueries(['getAdjustmentListQuery'], { active: true });
      message.success('미송상품이 성공적으로 등록되었습니다.');

      closeModal();
    },
  });

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

  // 미송 생성
  const handleReserveCreate = (data: {
    vendor_id: number;
    product_id: number;
    count: number;
    price: number;
    memo: string;
  }) => {
    createReserveMutation.mutate({
      item_list: [
        {
          rt_store_id: store.selected?.id as number,
          vendor_id: data.vendor_id,
          product_id: data.product_id,
          count: data.count,
          warehousing_item_id: 0,
          price: data.price,
          type: 'reserve',
          memo: data.memo,
        },
      ],
    });
  };

  // 가격, 수량  === 0 유효성 검사.
  const handlePriceValidationCheck = (_: unknown, value: number) => {
    if (!value) {
      return Promise.reject(new Error('가격을 확인해 주세요.'));
    }

    return Promise.resolve();
  };

  const handleCountValidationCheck = (_: unknown, value: number) => {
    if (!value) {
      return Promise.reject(new Error('수량을 입력해 주세요.'));
    }

    return Promise.resolve();
  };

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
        title={'미송상품 추가'}
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
            handleReserveCreate(values);
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
              placeholder="상품명을 입력해주세요"
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
              placeholder="거래처 상품명을 입력해주세요"
            />
          </Form.Item>

          <Form.Item
            label={t('table.productCode')}
            name="product_code"
            rules={[{ required: true }]}
          >
            <TurtleFormInput // 상품 바코드 Input
              disabled
              placeholder="코드를 입력해주세요"
            />
          </Form.Item>

          <Form.Item
            label={t('table.option')}
            name="product_option"
            rules={[{ required: false }]}
          >
            <TurtleFormInput // 상품 옵션 Input
              disabled
              placeholder="옵션을 입력해주세요"
            />
          </Form.Item>

          <Form.Item shouldUpdate noStyle>
            {() => (
              <Form.Item
                label={t('table.price')}
                name="price"
                rules={[
                  {
                    required: true,
                    validator: handlePriceValidationCheck,
                  },
                ]}
              >
                <TurtleNumberInput
                  formatter={(value) => `${value}`.replace(pricePattern, ',')}
                  placeholder="ex. 7,000"
                />
              </Form.Item>
            )}
          </Form.Item>

          <Form.Item shouldUpdate noStyle>
            {() => (
              <Form.Item
                label={t('table.count')}
                name="count"
                rules={[
                  {
                    required: true,
                    validator: handleCountValidationCheck,
                  },
                ]}
              >
                <TurtleNumberInput step={1} min={1} placeholder="ex. 10" />
              </Form.Item>
            )}
          </Form.Item>

          <Form.Item name="memo" label={t('table.memo')}>
            <TurtleFormInput placeholder="메모를 입력해주세요" />
          </Form.Item>

          <TurtleDivider marginTop={32} marginBottom={32} />

          <Form.Item
            label={t('table.vendorName')}
            name="vendor_name"
            rules={[{ required: true }]}
          >
            <TurtleFormInput // 거래처명 검색 Input
              disabled
              placeholder="거래처명을 입력해주세요"
            />
          </Form.Item>

          <Form.Item
            name="vendor_address"
            label={t('table.vendorAddress')}
            rules={[{ required: true }]}
          >
            <TurtleFormInput // 거래처 주소 Input
              placeholder="거래처주소를 입력해주세요"
              disabled
            />
          </Form.Item>

          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => (
              <div css={marginTop}>
                <PrimaryButton
                  size="large"
                  htmlType="submit"
                  disabled={!getFieldValue('price') || !getFieldValue('count')}
                >
                  {t('button.addReserve')}
                </PrimaryButton>
              </div>
            )}
          </Form.Item>
        </Form>
      </TurtleContentModal>
    </>
  );
}

const marginTop = css`
  margin-top: 60px;
`;

export default AddReserveModal;
