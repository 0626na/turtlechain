import {
  AddButton,
  TurtleIcon,
  TurtleTableTitle,
  TurtleText,
} from '@components/element';
import { css } from '@emotion/react';
import useStore from '@hooks/useStore';
import { ReactComponent as Plusicon } from '@icons/plus.svg';
import { Button, Col, Row, Table } from 'antd';
import React, { useState } from 'react';
import StoreCard from '../card/StoreCard';

function StoreTab() {
  const [mode, setMode] = useState<'cardView' | 'listView'>('cardView');
  const { store } = useStore();
  const changeMode = () => {
    setMode((mode) => {
      if (mode === 'cardView') return 'listView';
      return 'cardView';
    });
  };

  return (
    <>
      <Row
        align="middle"
        justify="space-between"
        css={css`
          margin-bottom: 16px;
        `}
      >
        <Col>
          <Row align="middle">
            <Col
              css={css`
                margin-right: 12px;
              `}
            >
              <TurtleIcon name="storeList" />
            </Col>
            <Col
              css={css`
                display: flex;
                align-items: center;
              `}
            >
              <TurtleText css={$title}>쇼핑몰 정보</TurtleText>
            </Col>
          </Row>
        </Col>

        <Col>
          <Button css={button}>
            <Plusicon css={icon} />

            <TurtleText>쇼핑몰 추가하기</TurtleText>
          </Button>
        </Col>
      </Row>

      <TurtleTableTitle
        totalCount={store.list.length}
        rightContent={
          <AddButton
            onClick={() => {
              changeMode();
            }}
          >
            리스트로보기
          </AddButton>
        }
      />

      {mode === 'cardView' ? (
        <div
          css={css`
            height: 600px;
            /* padding-top: 10px; */
            overflow: overlay;

            display: flex;
            /* align-items: center;
            justify-content: center; */
            flex-wrap: wrap;

            gap: 19px;
          `}
        >
          {store.list.map((item) => (
            <StoreCard title={item.name} isOpen={true}>
              <div>내용</div>
            </StoreCard>
          ))}
        </div>
      ) : (
        <Table
          size="small"
          // loading={loading}
          dataSource={[]}
          // rowKey={(record) => record.product_code}
          pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
          scroll={{ x: 1400, y: 'auto' }}
          columns={[
            {
              ellipsis: true,
              width: 50,
              title: '이체내역 수신메일',
              render: (_, record) => <div>df</div>,
            },
            {
              ellipsis: true,
              width: 50,
              title: '이체내역 수신메일',
              render: (_, record) => <div>df</div>,
            },
            {
              ellipsis: true,
              width: 50,
              title: '이체내역 수신메일',
              render: (_, record) => <div>df</div>,
            },
            {
              ellipsis: true,
              width: 50,
              title: '이체내역 수신메일',
              render: (_, record) => <div>df</div>,
            },
            {
              ellipsis: true,
              width: 50,
              title: '이체내역 수신메일',
              render: (_, record) => <div>df</div>,
            },
            {
              ellipsis: true,
              width: 50,
              title: '이체내역 수신메일',
              render: (_, record) => <div>df</div>,
            },
            {
              ellipsis: true,
              width: 50,
              title: '이체내역 수신메일',
              render: (_, record) => <div>df</div>,
            },
          ]}
        />
      )}
    </>
  );
}

const $title = css`
  font-size: 20px;
  font-weight: 500;
  color: #242934;
`;

const button = css`
  width: 160px;
  height: 40px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 40px;
  font-weight: 700;

  color: #fff;
  stroke: #fff;
  background: linear-gradient(90deg, #00be90 0%, #00b3be 77.08%, #00b3be 100%);

  &:hover {
    color: #fff;
    /* stroke: #fff; */
    border-color: linear-gradient(
      90deg,
      #00be90 0%,
      #00b3be 77.08%,
      #00b3be 100%
    );

    background: linear-gradient(
      90deg,
      #009773 0%,
      #008f98 77.08%,
      #008f98 100%
    );
  }

  // active 상태
  &.ant-btn:focus {
    color: #fff;
    stroke: #fff;

    background: linear-gradient(
      90deg,
      #00be90 0%,
      #00b3be 77.08%,
      #00b3be 100%
    );
  }
`;

const icon = css`
  margin-right: 5px;
`;
export default StoreTab;
