import {
  DeleteOutlined,
  PlusCircleOutlined,
  PlusCircleTwoTone,
} from '@ant-design/icons';
import orderAPI, { RequestCreateOrderFormat } from '@apis/orderAPI';
import { TurtleContentModal } from '@components/combine';
import {
  PrimaryButton,
  TurtleDivider,
  TurtleFormInput,
  TurtleIcon,
  TurtleText,
} from '@components/element';
import AddColumnButton from '@components/element/button/AddColumnButton';
import ColumnTitleInput from '@components/element/button/ColumnTitleInput';
import PlusIcon from '@components/element/icon/PlusIcon';
import TurtleStack from '@components/element/TurtleStack';
import { css } from '@emotion/react';
import useOrderCart, { IorderColumn } from '@hooks/useOrderCart';
import { PageTitle } from '@layout/page';
import { message } from '@utils/message';
import { Button, Col, Divider, Input, Modal, Row } from 'antd';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

interface Props {
  visible: boolean;
  closeModal: () => void;
}
/**
 *  발주서 헤더 설정 모달
 */
function AddOrderColumnModal({ visible, closeModal }: Props) {
  const {
    orderFormat,
    setOrderFormat,
    addNewOrderColumn,
    changeOrderColumn,
    deleteOrderColumn,
  } = useOrderCart();

  const getOrderFormatQuery = useQuery(
    'getOrderFormatQuery',
    () => orderAPI.getOrderFormat(),
    {
      onSuccess: (data) =>
        setOrderFormat({
          vendor_name: data.data.vendor_name ?? [],
          vendor_address: data.data.vendor_address ?? [],
          vendor_mobile: data.data.vendor_mobile ?? [],
          product_name: data.data.product_name ?? [],
          product_option: data.data.product_option ?? [],
          product_count: data.data.product_count ?? [],
          product_price: data.data.product_price ?? [],
          order_type: data.data.order_type ?? [],
          memo: data.data.memo ?? [],
        }),
    },
  );
  const createOrderFormatMutation = useMutation(orderAPI.createOrderFormat, {
    onSuccess: (data) => {
      if (data.msg === 'success')
        message.success(t('message.create new format'));
      closeModal();
    },
  });

  const columnDataOutput = (column: IorderColumn) => {
    return orderFormat[column].map((name, index) => (
      <ColumnTitleInput
        key={index}
        id={String(index)}
        value={name}
        onChange={(e) =>
          changeOrderColumn(column, e.currentTarget.id, e.currentTarget.value)
        }
        onDelete={() => deleteOrderColumn(column, name)}
      />
    ));
  };

  useEffect(() => {
    if (!visible) return;
    getOrderFormatQuery.refetch();
  }, [visible]);

  return (
    <TurtleContentModal
      title={t('button.orderColumnSetting')}
      size="large"
      visible={visible}
      onClose={closeModal}
    >
      {/* 헤더와 전체 margin 맞춤 */}
      <div
        css={css`
          margin-left: -7px;
        `}
      >
        {/* 타이틀 및 설명 */}
        <div>
          <span
            css={css`
              font-weight: 500;
              font-size: 20px;
            `}
          >
            {t('title.orderHeaderSettingSubtitle')}
          </span>
          <p
            css={css`
              margin-top: 7px;
              font-size: 13px;
              font-weight: 400;
              color: #6b6d73;
            `}
          >
            {t(
              'description.is there a header name that you are using separately? If you add a header name here, you can register an Excel file without any problems even if it is different from the header name of the turtlechain order form',
            )}
          </p>
        </div>
        {/* 종방향 정렬 container */}
        <div
          css={css`
            display: flex;
            flex-direction: column;
          `}
        >
          {/* 컬럼 추가 버튼목록 */}
          <div
            css={css`
              margin-top: 24px;
              gap: 10px;
              display: flex;
            `}
          >
            <AddColumnButton
              required={true}
              text={t('button.vendorName')}
              onClick={() => addNewOrderColumn('vendor_name')}
            />
            <AddColumnButton
              required={true}
              text={t('button.vendorAddress')}
              onClick={() => addNewOrderColumn('vendor_address')}
            />
            <AddColumnButton
              required={false}
              text={t('button.vendorMobile')}
              onClick={() => addNewOrderColumn('vendor_mobile')}
            />
            <AddColumnButton
              required={true}
              text={t('button.productName')}
              onClick={() => addNewOrderColumn('product_name')}
            />
            <AddColumnButton
              required={false}
              text={t('button.productOption')}
              onClick={() => addNewOrderColumn('product_option')}
            />
            <AddColumnButton
              required={false}
              text={t('button.orderType')}
              onClick={() => addNewOrderColumn('order_type')}
            />
            <AddColumnButton
              required={false}
              text={t('button.productCount')}
              onClick={() => addNewOrderColumn('product_count')}
            />
            <AddColumnButton
              required={false}
              text={t('button.productPrice')}
              onClick={() => addNewOrderColumn('product_price')}
            />
            <AddColumnButton
              required={false}
              text={t('button.memo')}
              onClick={() => addNewOrderColumn('memo')}
            />
          </div>
          {/* 경계선 */}
          <TurtleDivider color="#dce0e4" marginTop={12} />

          {/* 저장된 칼럼명 */}
          <div
            css={css`
              display: flex;
              height: 600px;
              flex-direction: column;
              justify-content: space-between;
            `}
          >
            {/* 칼럼명 목록 container */}
            <div
              css={css`
                display: flex;
                gap: 10px;
                overflow-y: auto;
              `}
            >
              {/* 거래처명 */}
              <TurtleStack>
                {orderFormat.vendor_name.length !== 0 &&
                  columnDataOutput('vendor_name')}
              </TurtleStack>

              {/* 거래처 주소 */}
              <TurtleStack>
                {orderFormat.vendor_address.length !== 0 &&
                  columnDataOutput('vendor_address')}
              </TurtleStack>

              {/* 휴대전화 번호 */}
              <TurtleStack>
                {orderFormat.vendor_mobile.length !== 0 &&
                  columnDataOutput('vendor_mobile')}
              </TurtleStack>

              {/* 거래처 상품명 */}
              <TurtleStack>
                {orderFormat.product_name.length !== 0 &&
                  columnDataOutput('product_name')}
              </TurtleStack>

              {/* 옵션 */}
              <TurtleStack>
                {orderFormat.product_option.length !== 0 &&
                  columnDataOutput('product_option')}
              </TurtleStack>

              {/* 분류 */}
              <TurtleStack>
                {orderFormat.order_type.length !== 0 &&
                  columnDataOutput('order_type')}
              </TurtleStack>

              {/* 수량 */}
              <TurtleStack>
                {orderFormat.product_count.length !== 0 &&
                  columnDataOutput('product_count')}
              </TurtleStack>

              {/* 가격 */}
              <TurtleStack>
                {orderFormat.product_price.length !== 0 &&
                  columnDataOutput('product_price')}
              </TurtleStack>

              {/* 메모 */}
              <TurtleStack>
                {orderFormat.memo.length !== 0 && columnDataOutput('memo')}
              </TurtleStack>
            </div>

            {/* 저장 버튼 */}
            <div
              css={css`
                display: flex;

                justify-self: end;
                justify-content: flex-end;
              `}
            >
              <PrimaryButton
                onClick={() => createOrderFormatMutation.mutate(orderFormat)}
              >
                {t('button.saving')}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </TurtleContentModal>
  );
}

const $title = css`
  font-size: 20px;
  font-weight: 500;
  color: #242934;
`;

const wrapper = css`
  padding: 12px 36px 12px 36px;
`;

const columnHeader = css`
  background-color: #f7f8f9;
  width: 160px;
  height: 40px;
`;

const columnContent = css`
  width: 160px;
  height: 40px;
  border-radius: 14px;
  margin-bottom: 10px;
`;

const columnVisibleContent = css`
  width: 160px;
  height: 40px;
  border-radius: 14px;
  visibility: hidden;
`;

export default AddOrderColumnModal;
