import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { RequestCreateOrderFormat } from '@apis/orderAPI';
import { TurtleText } from '@components/element';
import { css } from '@emotion/react';
import { PageTitle } from '@layout/page';
import { Button, Col, Divider, Input, Modal, Row } from 'antd';
import { useState } from 'react';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function AddOrderColumnModal({ visible, closeModal }: Props) {
  const [orderFormat, setOrderFormat] = useState<RequestCreateOrderFormat>({
    vendor_name: ['1', '2', '3'],
    vendor_address: ['22'],
    vendor_mobile: ['33', '44'],
    product_name: [],
    product_option: ['55'],
    product_count: ['66', '77', '88', '99'],
    product_price: ['1123', '23123'],
    order_type: ['123'],
    memo: ['jj'],
  });
  return (
    <Modal visible={visible} onCancel={closeModal} width="100vw">
      <Row css={wrapper}>
        <Col>
          <TurtleText css={$title}>발주서 설정</TurtleText>
        </Col>
      </Row>

      <PageTitle
        title="발주서 외부헤더 추가"
        subTitle="외부 헤더명을 추가하면 외부 발주서도 자유롭게 등록할 수 있어요"
      />

      <Row style={{ display: 'flex', justifyContent: 'center' }}>
        {/* 헤더 추가 버튼 */}
        <Row gutter={[14, 16]}>
          <Col>
            <Button
              css={columnHeader}
              onClick={() =>
                setOrderFormat({
                  ...orderFormat,
                  vendor_name: [...orderFormat.vendor_name, ''],
                })
              }
            >
              거래처명
              <PlusCircleOutlined style={{ backgroundColor: '#DDF3F5' }} />
            </Button>
          </Col>
          <Col>
            <Button
              css={columnHeader}
              onClick={() =>
                setOrderFormat({
                  ...orderFormat,
                  vendor_address: [...orderFormat.vendor_address, ''],
                })
              }
            >
              거래처 주소 <PlusCircleOutlined />
            </Button>
          </Col>
          <Col>
            <Button
              css={columnHeader}
              onClick={() =>
                setOrderFormat({
                  ...orderFormat,
                  vendor_mobile: [...orderFormat.vendor_mobile, ''],
                })
              }
            >
              휴대번호 <PlusCircleOutlined />
            </Button>
          </Col>
          <Col>
            <Button
              css={columnHeader}
              onClick={() =>
                setOrderFormat({
                  ...orderFormat,
                  product_name: [...orderFormat.product_name, ''],
                })
              }
            >
              거래처 상품명 <PlusCircleOutlined />
            </Button>
          </Col>
          <Col>
            <Button
              css={columnHeader}
              onClick={() =>
                setOrderFormat({
                  ...orderFormat,
                  product_option: [...orderFormat.product_option, ''],
                })
              }
            >
              옵션 <PlusCircleOutlined />
            </Button>
          </Col>
          <Col>
            <Button
              css={columnHeader}
              onClick={() =>
                setOrderFormat({
                  ...orderFormat,
                  order_type: [...orderFormat.order_type, ''],
                })
              }
            >
              분류 <PlusCircleOutlined />
            </Button>
          </Col>
          <Col>
            <Button
              css={columnHeader}
              onClick={() =>
                setOrderFormat({
                  ...orderFormat,
                  product_count: [...orderFormat.product_count, ''],
                })
              }
            >
              수량 <PlusCircleOutlined />
            </Button>
          </Col>
          <Col>
            <Button
              css={columnHeader}
              onClick={() =>
                setOrderFormat({
                  ...orderFormat,
                  product_price: [...orderFormat.product_price, ''],
                })
              }
            >
              공급가 <PlusCircleOutlined />
            </Button>
          </Col>
          <Col>
            <Button
              css={columnHeader}
              onClick={() =>
                setOrderFormat({
                  ...orderFormat,
                  memo: [...orderFormat.memo, ''],
                })
              }
            >
              메모 <PlusCircleOutlined />
            </Button>
          </Col>
        </Row>
        <Divider />

        {/* 헤더목록 */}
        <Row gutter={[14, 16]}>
          {/* 거래처명 */}
          <Col style={{ display: 'flex', flexDirection: 'column' }}>
            {orderFormat.vendor_name.length !== 0 ? (
              orderFormat.vendor_name.map((name, index) => {
                return (
                  <Input
                    key={index}
                    id={index.toString()}
                    value={name}
                    css={columnContent}
                    onChange={(e) =>
                      setOrderFormat({
                        ...orderFormat,
                        vendor_name: orderFormat.vendor_name.map(
                          (value, index) => {
                            if (index.toString() === e.currentTarget.id) {
                              return e.currentTarget.value;
                            } else return value;
                          },
                        ),
                      })
                    }
                    suffix={
                      <DeleteOutlined
                        id={index.toString()}
                        onClick={(e) =>
                          setOrderFormat({
                            ...orderFormat,
                            vendor_name: orderFormat.vendor_name.filter(
                              (_, index) =>
                                e.currentTarget.id !== index.toString(),
                            ),
                          })
                        }
                      />
                    }
                  />
                );
              })
            ) : (
              <Input css={columnVisibleContent} />
            )}
          </Col>

          {/* 거래처 주소 */}
          <Col style={{ display: 'flex', flexDirection: 'column' }}>
            {orderFormat.vendor_address.length !== 0 ? (
              orderFormat.vendor_address.map((name, index) => (
                <Input
                  key={index}
                  id={index.toString()}
                  value={name}
                  css={columnContent}
                  onChange={(e) =>
                    setOrderFormat({
                      ...orderFormat,
                      vendor_address: orderFormat.vendor_address.map(
                        (value, index) => {
                          if (index.toString() === e.currentTarget.id) {
                            return e.currentTarget.value;
                          } else return value;
                        },
                      ),
                    })
                  }
                  suffix={
                    <DeleteOutlined
                      id={index.toString()}
                      onClick={(e) =>
                        setOrderFormat({
                          ...orderFormat,
                          vendor_address: orderFormat.vendor_address.filter(
                            (_, index) =>
                              e.currentTarget.id !== index.toString(),
                          ),
                        })
                      }
                    />
                  }
                />
              ))
            ) : (
              <Input css={columnVisibleContent} />
            )}
          </Col>

          {/* 휴대번호 */}
          <Col style={{ display: 'flex', flexDirection: 'column' }}>
            {orderFormat.vendor_mobile.length !== 0 ? (
              orderFormat.vendor_mobile.map((name, index) => (
                <Input
                  key={index}
                  id={index.toString()}
                  value={name}
                  css={columnContent}
                  onChange={(e) =>
                    setOrderFormat({
                      ...orderFormat,
                      vendor_mobile: orderFormat.vendor_mobile.map(
                        (value, index) => {
                          if (index.toString() === e.currentTarget.id) {
                            return e.currentTarget.value;
                          } else return value;
                        },
                      ),
                    })
                  }
                  suffix={
                    <DeleteOutlined
                      id={index.toString()}
                      onClick={(e) =>
                        setOrderFormat({
                          ...orderFormat,
                          vendor_mobile: orderFormat.vendor_mobile.filter(
                            (_, index) =>
                              e.currentTarget.id !== index.toString(),
                          ),
                        })
                      }
                    />
                  }
                />
              ))
            ) : (
              <Input css={columnVisibleContent} />
            )}
          </Col>

          {/* 거래처 상품명 */}

          <Col style={{ display: 'flex', flexDirection: 'column' }}>
            {orderFormat.product_name.length !== 0 ? (
              orderFormat.product_name.map((name, index) => (
                <Input
                  key={index}
                  id={index.toString()}
                  value={name}
                  css={columnContent}
                  onChange={(e) =>
                    setOrderFormat({
                      ...orderFormat,
                      product_name: orderFormat.product_name.map(
                        (value, index) => {
                          if (index.toString() === e.currentTarget.id) {
                            return e.currentTarget.value;
                          } else return value;
                        },
                      ),
                    })
                  }
                  suffix={
                    <DeleteOutlined
                      id={index.toString()}
                      onClick={(e) =>
                        setOrderFormat({
                          ...orderFormat,
                          product_name: orderFormat.product_name.filter(
                            (_, index) =>
                              e.currentTarget.id !== index.toString(),
                          ),
                        })
                      }
                    />
                  }
                />
              ))
            ) : (
              <Input css={columnVisibleContent} />
            )}
          </Col>

          {/* 옵션 */}
          <Col style={{ display: 'flex', flexDirection: 'column' }}>
            {orderFormat.product_option.length !== 0 ? (
              orderFormat.product_option.map((name, index) => (
                <Input
                  key={index}
                  id={index.toString()}
                  value={name}
                  css={columnContent}
                  onChange={(e) =>
                    setOrderFormat({
                      ...orderFormat,
                      product_option: orderFormat.product_option.map(
                        (value, index) => {
                          if (index.toString() === e.currentTarget.id) {
                            return e.currentTarget.value;
                          } else return value;
                        },
                      ),
                    })
                  }
                  suffix={
                    <DeleteOutlined
                      id={index.toString()}
                      onClick={(e) =>
                        setOrderFormat({
                          ...orderFormat,
                          product_option: orderFormat.product_option.filter(
                            (_, index) =>
                              e.currentTarget.id !== index.toString(),
                          ),
                        })
                      }
                    />
                  }
                />
              ))
            ) : (
              <Input css={columnVisibleContent} />
            )}
          </Col>

          {/* 분류 */}
          <Col style={{ display: 'flex', flexDirection: 'column' }}>
            {orderFormat.order_type.length !== 0 ? (
              orderFormat.order_type.map((name, index) => (
                <Input
                  key={index}
                  id={index.toString()}
                  value={name}
                  css={columnContent}
                  onChange={(e) =>
                    setOrderFormat({
                      ...orderFormat,
                      order_type: orderFormat.order_type.map((value, index) => {
                        if (index.toString() === e.currentTarget.id) {
                          return e.currentTarget.value;
                        } else return value;
                      }),
                    })
                  }
                  suffix={
                    <DeleteOutlined
                      id={index.toString()}
                      onClick={(e) =>
                        setOrderFormat({
                          ...orderFormat,
                          order_type: orderFormat.order_type.filter(
                            (_, index) =>
                              e.currentTarget.id !== index.toString(),
                          ),
                        })
                      }
                    />
                  }
                />
              ))
            ) : (
              <Input css={columnVisibleContent} />
            )}
          </Col>
          {/* 수량 */}
          <Col style={{ display: 'flex', flexDirection: 'column' }}>
            {orderFormat.product_count.length !== 0 ? (
              orderFormat.product_count.map((name, index) => (
                <Input
                  key={index}
                  id={index.toString()}
                  value={name}
                  css={columnContent}
                  onChange={(e) =>
                    setOrderFormat({
                      ...orderFormat,
                      product_count: orderFormat.product_count.map(
                        (value, index) => {
                          if (index.toString() === e.currentTarget.id) {
                            return e.currentTarget.value;
                          } else return value;
                        },
                      ),
                    })
                  }
                  suffix={
                    <DeleteOutlined
                      id={index.toString()}
                      onClick={(e) =>
                        setOrderFormat({
                          ...orderFormat,
                          product_count: orderFormat.product_count.filter(
                            (_, index) =>
                              e.currentTarget.id !== index.toString(),
                          ),
                        })
                      }
                    />
                  }
                />
              ))
            ) : (
              <Input css={columnVisibleContent} />
            )}
          </Col>
          {/* 공급가 */}
          <Col style={{ display: 'flex', flexDirection: 'column' }}>
            {orderFormat.product_price.length !== 0 ? (
              orderFormat.product_price.map((name, index) => (
                <Input
                  key={index}
                  id={index.toString()}
                  value={name}
                  css={columnContent}
                  onChange={(e) =>
                    setOrderFormat({
                      ...orderFormat,
                      product_price: orderFormat.product_price.map(
                        (value, index) => {
                          if (index.toString() === e.currentTarget.id) {
                            return e.currentTarget.value;
                          } else return value;
                        },
                      ),
                    })
                  }
                  suffix={
                    <DeleteOutlined
                      id={index.toString()}
                      onClick={(e) =>
                        setOrderFormat({
                          ...orderFormat,
                          product_price: orderFormat.product_price.filter(
                            (_, index) =>
                              e.currentTarget.id !== index.toString(),
                          ),
                        })
                      }
                    />
                  }
                />
              ))
            ) : (
              <Input css={columnVisibleContent} />
            )}
          </Col>
          {/* 메모 */}
          <Col style={{ display: 'flex', flexDirection: 'column' }}>
            {orderFormat.memo.length !== 0 ? (
              orderFormat.memo.map((name, index) => (
                <Input
                  key={index}
                  id={index.toString()}
                  value={name}
                  css={columnContent}
                  onChange={(e) =>
                    setOrderFormat({
                      ...orderFormat,
                      memo: orderFormat.memo.map((value, index) => {
                        if (index.toString() === e.currentTarget.id) {
                          return e.currentTarget.value;
                        } else return value;
                      }),
                    })
                  }
                  suffix={
                    <DeleteOutlined
                      id={index.toString()}
                      onClick={(e) =>
                        setOrderFormat({
                          ...orderFormat,
                          memo: orderFormat.memo.filter(
                            (_, index) =>
                              e.currentTarget.id !== index.toString(),
                          ),
                        })
                      }
                    />
                  }
                />
              ))
            ) : (
              <Input css={columnVisibleContent} />
            )}
          </Col>
        </Row>
      </Row>
    </Modal>
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
