import retailerStoreAPI from '@apis/retailerStoreAPI';
import {
  AddButton,
  GridIcon,
  TurtleIcon,
  TurtleTableTitle,
  TurtleTag,
  TurtleText,
} from '@components/element';
import { css } from '@emotion/react';
import useUser from '@hooks/useUser';

import { ReactComponent as Plusicon } from '@icons/plus.svg';
import { phonePattern } from '@utils/pattern';
import { Button, Col, Row, Table } from 'antd';
import { t } from 'i18next';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import StoreCard from '../card/StoreCard';

function StoreTab() {
  const [mode, setMode] = useState<'cardView' | 'listView'>('cardView');
  const { user } = useUser();

  const getStoreListQuery = useQuery(
    ['getStoreList'],
    retailerStoreAPI.getList,
    {
      enabled: !!user.id,
    },
  );

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
                font-size: 20px;
                font-weight: 500;
                color: #242934;
              `}
            >
              <TurtleText>쇼핑몰 정보</TurtleText>
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
        totalCount={getStoreListQuery.data?.store_list.length ?? 0}
        rightContent={
          <AddButton
            icon={
              mode === 'cardView' ? (
                <TurtleIcon name="listView" />
              ) : (
                <GridIcon value="#6B6D73" />
              )
            }
            onClick={() => {
              changeMode();
            }}
          >
            {mode === 'cardView' ? '리스트로 보기' : '카드뷰로 보기'}
          </AddButton>
        }
      />

      {mode === 'cardView' ? (
        <Row gutter={[27, 27]} css={cardsContainer}>
          {getStoreListQuery.data?.store_list.map((item, idx) => (
            <Col key={idx} span={8}>
              <StoreCard store={item} />
            </Col>
          ))}
        </Row>
      ) : (
        <Table
          size="small"
          loading={getStoreListQuery.isLoading}
          dataSource={getStoreListQuery.data?.store_list}
          rowKey={(record) => record.id}
          pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
          scroll={{ x: 1400, y: 'auto' }}
          columns={[
            {
              ellipsis: true,
              width: 20,
              title: t('table.operatorStatus'),
              render: (_, record) => {
                const { is_closed } = record;
                const color = is_closed ? 'gray' : 'skyblue';
                const str = is_closed ? t('table.closed') : t('table.open');
                return <TurtleTag color={color}>{str}</TurtleTag>;
              },
            },
            {
              ellipsis: true,
              width: 50,
              title: t('table.retailerStoreName'),
              render: (_, record) => record.name,
            },
            {
              ellipsis: true,
              width: 25,
              title: t('table.mobile'),
              render: (_, record) =>
                record.store_phone[0]?.phone.replace(
                  phonePattern,
                  '$1-$2-$3',
                ) ?? '',
            },
            {
              ellipsis: true,
              width: 50,
              title: t('table.paymentAccountInfo'),
              render: (_, record) =>
                `${record.store_account[0]?.bank ?? ''} ${
                  record.store_account[0]?.account_number ?? ''
                } ${record.store_account[0]?.account_holder ?? ''}`,
            },
            {
              ellipsis: true,
              width: 50,
              title: t('table.recipientPrint'),
              render: (_, record) => record.recipient_print,
            },
            {
              ellipsis: true,
              width: 25,
              title: t('table.inventory'),
              render: (_, record) => t(`inventory.${record.inventory_type}.`),
            },
            {
              ellipsis: true,
              width: 50,
              title: t('table.transactionEmail'),
              render: (_, record) => record.email,
            },
          ]}
        />
      )}
    </>
  );
}

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

const cardsContainer = css`
  height: 70vh;
  overflow: auto;
`;

export default StoreTab;
