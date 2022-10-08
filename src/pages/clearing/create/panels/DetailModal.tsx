import React from 'react';
import { css } from '@emotion/react';
import { TurtleDivider, TurtleIcon } from '@components/element';
import { ClearingInfo } from '@apis/clearingAPI';
import { Col, Divider, Row, Space } from 'antd';

interface Props {
  visible: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose: () => void;
  size?: 'small' | 'middle' | 'large';
  selectedRow: ClearingInfo;
}

function DetailModal({
  visible = false,
  onClose,
  title,
  selectedRow,
  size = 'small',
}: Props) {
  return (
    <>
      {visible && (
        <div css={modalCss.mask}>
          <div css={modalCss.container}>
            <div css={modalCss.header}>
              <TurtleIcon name="modalClose" onClick={onClose} />
            </div>

            <div css={modalTopContentCss.self}>
              <div css={modalTopContentCss.title}>2020-07-19</div>
              <div css={modalTopContentCss.content}>
                <div css={modalTopContentCss.item}>
                  <span>거래처명</span>
                  <span>{selectedRow.vendor_info.vendor_name}</span>
                </div>
                <div css={modalTopContentCss.item}>
                  <span>결제요청 금액</span>
                  <span>
                    {selectedRow.clearing_amount?.toLocaleString() ?? 0}
                  </span>
                </div>
              </div>
            </div>

            <TurtleDivider marginTop={30} marginBottom={40} />

            <div>
              <div css={modalBottomContentCss.title}>상세내역</div>

              <ul css={modalBottomContentCss.content}>
                <li css={modalBottomContentCss.item}>
                  <span>교환/반품</span>
                  <span>
                    -{' '}
                    {selectedRow.overpaid_payment_amount?.toLocaleString() ?? 0}
                  </span>
                </li>
                <li css={modalBottomContentCss.item}>
                  <span>미송입고</span>
                  <span>
                    - {selectedRow.reserve_subtract_amount.toLocaleString()}
                  </span>
                </li>
                <li css={modalBottomContentCss.item}>
                  <span>당일미송</span>
                  <span>
                    {selectedRow.reserve_payment_amount.toLocaleString()}
                  </span>
                </li>
                <li css={modalBottomContentCss.item}>
                  <span>당일입고</span>
                  <span>
                    -
                    {(
                      selectedRow.warehousing_amount +
                      selectedRow.reserve_subtract_amount
                    ).toLocaleString()}
                  </span>
                </li>
                <li css={modalBottomContentCss.item}>
                  <span>미결제</span>
                  <span>- {selectedRow.unpaid_amount.toLocaleString()}</span>
                </li>
              </ul>
            </div>

            {/* <Space
                direction="vertical"
                size={2}
                style={{
                  color: '#DCE0E4',
                }}
              >
                <Row justify="space-between">
                  <Col style={{ marginRight: 59 }}>미결제</Col>
                  <Col>{selectedRow.unpaid_amount.toLocaleString()}</Col>
                </Row>
                <Row justify="space-between">
                  <Col style={{ marginRight: 59 }}>당일 입고</Col>
                  <Col>
                    {(
                      selectedRow.warehousing_amount +
                      selectedRow.reserve_subtract_amount
                    ).toLocaleString()}
                  </Col>
                </Row>
                <Row justify="space-between">
                  <Col style={{ marginRight: 59 }}>당일 미송</Col>
                  <Col>
                    {selectedRow.reserve_payment_amount.toLocaleString()}
                  </Col>
                </Row>
                <Divider
                  style={{
                    borderTopColor: '#5B5D63',
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />
                <Row justify="space-between">
                  <Col style={{ marginRight: 59 }}>매입 차감</Col>
                  <Col>
                    -{' '}
                    {selectedRow.overpaid_payment_amount?.toLocaleString() ?? 0}
                  </Col>
                </Row>

                <Row justify="space-between">
                  <Col style={{ marginRight: 59 }}>미송 차감</Col>
                  <Col>
                    - {selectedRow.reserve_subtract_amount.toLocaleString()}
                  </Col>
                </Row>
              </Space> */}
          </div>
        </div>
      )}
    </>
  );
}

const modalCss = {
  mask: css({
    height: '100vh',
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
    background: 'rgba(0, 0, 0, 0.45)',
  }),

  container: css({
    fontSize: 15,
    lineHeight: 1,
    padding: 32,
    height: 597,
    width: 400,

    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    display: 'flex',
    flexDirection: 'column',

    background: '#fff',
    borderRadius: 4,
  }),

  header: css({
    display: 'flex',
    justifyContent: 'end',
  }),
};

const modalTopContentCss = {
  self: css({
    marginTop: 4,
  }),

  title: css({
    color: '#A1A2A6',
    marginBottom: 40,
  }),

  content: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  }),

  item: css({
    display: 'flex',
    justifyContent: 'space-between',
  }),
};

const modalBottomContentCss = {
  title: css({
    color: '#A1A2A6',
    marginBottom: 24,
  }),

  content: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  }),

  item: css({
    display: 'flex',
    justifyContent: 'space-between',
    'span:last-child': {
      color: 'red',
    },
  }),
};

export default DetailModal;
