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
import useOrderCart from '@hooks/useOrderCart';
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

function AddOrderColumnModal({ visible, closeModal }: Props) {
  const { orderFormat, setOrderFormat } = useOrderCart();
  const [mutateSwitch, setMutateSwitch] = useState(0);
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
        message.success('양식 등록이 완료되었습니다.');
      closeModal();
    },
  });

  useEffect(() => {
    if (mutateSwitch !== 0) createOrderFormatMutation.mutate(orderFormat);
  }, [mutateSwitch]);

  useEffect(() => {
    if (!visible) getOrderFormatQuery.refetch();
  }, [visible]);

  return (
    <TurtleContentModal
      title="발주서 설정"
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
            {t('order.setting.title')}
          </span>
          <p
            css={css`
              margin-top: 7px;
              font-size: 13px;
              font-weight: 400;
              color: #6b6d73;
            `}
          >
            {t('order.setting.description')}
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
              text="거래처명"
              onClick={() => {
                setOrderFormat({
                  ...orderFormat,
                  vendor_name: [...orderFormat.vendor_name, ''],
                });
              }}
            />
            <AddColumnButton
              required={true}
              text="거래처 주소"
              onClick={() => {
                setOrderFormat({
                  ...orderFormat,
                  vendor_address: [...orderFormat.vendor_address, ''],
                });
              }}
            />
            <AddColumnButton
              required={false}
              text="휴대전화 번호"
              onClick={() => {
                setOrderFormat({
                  ...orderFormat,
                  vendor_mobile: [...orderFormat.vendor_mobile, ''],
                });
              }}
            />
            <AddColumnButton
              required={true}
              text="거래처 상품명"
              onClick={() => {
                setOrderFormat({
                  ...orderFormat,
                  product_name: [...orderFormat.product_name, ''],
                });
              }}
            />
            <AddColumnButton
              required={false}
              text="옵션"
              onClick={() => {
                setOrderFormat({
                  ...orderFormat,
                  product_option: [...orderFormat.product_option, ''],
                });
              }}
            />
            <AddColumnButton
              required={false}
              text="분류"
              onClick={() => {
                setOrderFormat({
                  ...orderFormat,
                  order_type: [...orderFormat.order_type, ''],
                });
              }}
            />
            <AddColumnButton
              required={true}
              text="수량"
              onClick={() => {
                setOrderFormat({
                  ...orderFormat,
                  product_count: [...orderFormat.product_count, ''],
                });
              }}
            />
            <AddColumnButton
              required={false}
              text="가격"
              onClick={() => {
                setOrderFormat({
                  ...orderFormat,
                  product_price: [...orderFormat.product_price, ''],
                });
              }}
            />
            <AddColumnButton
              required={false}
              text="메모"
              onClick={() => {
                setOrderFormat({
                  ...orderFormat,
                  memo: [...orderFormat.memo, ''],
                });
              }}
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
                  orderFormat.vendor_name.map((name, index) => {
                    return (
                      <ColumnTitleInput
                        key={index}
                        id={String(index)}
                        value={name}
                        onChange={(e) =>
                          setOrderFormat({
                            ...orderFormat,
                            vendor_name: orderFormat.vendor_name.map(
                              (value, index) => {
                                if (String(index) === e.currentTarget.id)
                                  return e.currentTarget.value;
                                return value;
                              },
                            ),
                          })
                        }
                        onDelete={() => {
                          setOrderFormat({
                            ...orderFormat,
                            vendor_name: orderFormat.vendor_name.filter(
                              (vendorName) => vendorName !== name,
                            ),
                          });
                        }}
                      />
                    );
                  })}
              </TurtleStack>

              {/* 거래처 주소 */}
              <TurtleStack>
                {orderFormat.vendor_address.length !== 0 &&
                  orderFormat.vendor_address.map((address, index) => (
                    <ColumnTitleInput
                      key={index}
                      id={String(index)}
                      value={address}
                      onChange={(e) =>
                        setOrderFormat({
                          ...orderFormat,
                          vendor_address: orderFormat.vendor_address.map(
                            (value, index) => {
                              if (String(index) === e.currentTarget.id)
                                return e.currentTarget.value;
                              return value;
                            },
                          ),
                        })
                      }
                      onDelete={() =>
                        setOrderFormat({
                          ...orderFormat,
                          vendor_address: orderFormat.vendor_address.filter(
                            (vendorAddress) => vendorAddress !== address,
                          ),
                        })
                      }
                    />
                  ))}
              </TurtleStack>

              {/* 휴대전화 번호 */}
              <TurtleStack>
                {orderFormat.vendor_mobile.length !== 0 &&
                  orderFormat.vendor_mobile.map((mobile, index) => (
                    <ColumnTitleInput
                      value={mobile}
                      id={String(index)}
                      key={index}
                      onChange={(e) =>
                        setOrderFormat({
                          ...orderFormat,
                          vendor_mobile: orderFormat.vendor_mobile.map(
                            (value, index) => {
                              if (String(index) === e.currentTarget.id)
                                return e.currentTarget.value;
                              return value;
                            },
                          ),
                        })
                      }
                      onDelete={() =>
                        setOrderFormat({
                          ...orderFormat,
                          vendor_mobile: orderFormat.vendor_mobile.filter(
                            (vendorMobile) => vendorMobile !== mobile,
                          ),
                        })
                      }
                    />
                  ))}
              </TurtleStack>

              {/* 거래처 상품명 */}
              <TurtleStack>
                {orderFormat.product_name.length !== 0 &&
                  orderFormat.product_name.map((product, index) => (
                    <ColumnTitleInput
                      value={product}
                      id={String(index)}
                      key={index}
                      onChange={(e) =>
                        setOrderFormat({
                          ...orderFormat,
                          product_name: orderFormat.product_name.map(
                            (value, index) => {
                              if (String(index) === e.currentTarget.id)
                                return e.currentTarget.value;
                              return value;
                            },
                          ),
                        })
                      }
                      onDelete={() =>
                        setOrderFormat({
                          ...orderFormat,
                          product_name: orderFormat.product_name.filter(
                            (vendorProduct) => vendorProduct !== product,
                          ),
                        })
                      }
                    />
                  ))}
              </TurtleStack>

              {/* 옵션 */}
              <TurtleStack>
                {orderFormat.product_option.length !== 0 &&
                  orderFormat.product_option.map((option, index) => (
                    <ColumnTitleInput
                      value={option}
                      id={String(index)}
                      key={index}
                      onChange={(e) =>
                        setOrderFormat({
                          ...orderFormat,
                          product_option: orderFormat.product_option.map(
                            (value, index) => {
                              if (String(index) === e.currentTarget.id)
                                return e.currentTarget.value;
                              return value;
                            },
                          ),
                        })
                      }
                      onDelete={() =>
                        setOrderFormat({
                          ...orderFormat,
                          product_option: orderFormat.product_option.filter(
                            (vendorProduct) => vendorProduct !== option,
                          ),
                        })
                      }
                    />
                  ))}
              </TurtleStack>

              {/* 분류 */}
              <TurtleStack>
                {orderFormat.order_type.length !== 0 &&
                  orderFormat.order_type.map((orderType, index) => (
                    <ColumnTitleInput
                      value={orderType}
                      id={String(index)}
                      key={index}
                      onChange={(e) =>
                        setOrderFormat({
                          ...orderFormat,
                          order_type: orderFormat.order_type.map(
                            (value, index) => {
                              if (String(index) === e.currentTarget.id)
                                return e.currentTarget.value;
                              return value;
                            },
                          ),
                        })
                      }
                      onDelete={() =>
                        setOrderFormat({
                          ...orderFormat,
                          order_type: orderFormat.order_type.filter(
                            (type) => type !== orderType,
                          ),
                        })
                      }
                    />
                  ))}
              </TurtleStack>

              {/* 수량 */}
              <TurtleStack>
                {orderFormat.product_count.length !== 0 &&
                  orderFormat.product_count.map((count, index) => (
                    <ColumnTitleInput
                      value={count}
                      id={String(index)}
                      key={index}
                      onChange={(e) =>
                        setOrderFormat({
                          ...orderFormat,
                          product_count: orderFormat.product_count.map(
                            (value, index) => {
                              if (String(index) === e.currentTarget.id)
                                return e.currentTarget.value;
                              return value;
                            },
                          ),
                        })
                      }
                      onDelete={() =>
                        setOrderFormat({
                          ...orderFormat,
                          product_count: orderFormat.product_count.filter(
                            (productCount) => productCount !== count,
                          ),
                        })
                      }
                    />
                  ))}
              </TurtleStack>

              {/* 가격 */}
              <TurtleStack>
                {orderFormat.product_price.length !== 0 &&
                  orderFormat.product_price.map((price, index) => (
                    <ColumnTitleInput
                      value={price}
                      id={String(index)}
                      key={index}
                      onChange={(e) =>
                        setOrderFormat({
                          ...orderFormat,
                          product_price: orderFormat.product_price.map(
                            (value, index) => {
                              if (String(index) === e.currentTarget.id)
                                return e.currentTarget.value;
                              return value;
                            },
                          ),
                        })
                      }
                      onDelete={() =>
                        setOrderFormat({
                          ...orderFormat,
                          product_price: orderFormat.product_price.filter(
                            (productPrice) => productPrice !== price,
                          ),
                        })
                      }
                    />
                  ))}
              </TurtleStack>

              {/* 메모 */}
              <TurtleStack>
                {orderFormat.memo.length !== 0 &&
                  orderFormat.memo.map((memo, index) => (
                    <ColumnTitleInput
                      value={memo}
                      id={String(index)}
                      key={index}
                      onChange={(e) =>
                        setOrderFormat({
                          ...orderFormat,
                          memo: orderFormat.memo.map((value, index) => {
                            if (String(index) === e.currentTarget.id)
                              return e.currentTarget.value;
                            return value;
                          }),
                        })
                      }
                      onDelete={() =>
                        setOrderFormat({
                          ...orderFormat,
                          memo: orderFormat.memo.filter(
                            (vendorMemo) => vendorMemo !== memo,
                          ),
                        })
                      }
                    />
                  ))}
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
                onClick={() => {
                  setOrderFormat({
                    vendor_name: orderFormat.vendor_name.filter(
                      (name) => name !== '',
                    ),
                    vendor_address: orderFormat.vendor_address.filter(
                      (address) => address !== '',
                    ),
                    vendor_mobile: orderFormat.vendor_mobile.filter(
                      (mobile) => mobile !== '',
                    ),
                    order_type: orderFormat.order_type.filter(
                      (type) => type !== '',
                    ),
                    product_count: orderFormat.product_count.filter(
                      (count) => count !== '',
                    ),
                    product_name: orderFormat.product_name.filter(
                      (name) => name !== '',
                    ),
                    product_option: orderFormat.product_option.filter(
                      (option) => option !== '',
                    ),
                    product_price: orderFormat.product_price.filter(
                      (price) => price !== '',
                    ),
                    memo: orderFormat.memo.filter((memo) => memo !== ''),
                  });
                  setMutateSwitch((prev) => prev + 1);
                }}
              >
                저장하기
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
