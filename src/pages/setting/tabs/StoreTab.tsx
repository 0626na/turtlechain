import retailerStoreAPI, { StoreShow } from '@apis/retailerStoreAPI';
import {
  AddButton,
  GridIcon,
  SpecialButton,
  TurtleIcon,
  TurtleTableTitle,
  TurtleTag,
  TurtleText,
} from '@components/element';
import { css } from '@emotion/react';
import useModal from '@hooks/useModal';
import useUser from '@hooks/useUser';

import { phonePattern } from '@utils/pattern';
import { Col, Row, Table } from 'antd';
import { t } from 'i18next';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import StoreCard from '../cards/StoreCard';
import StoreCreateModal from '../modals/StoreCreateModal';
import DetailModal from '../modals/DetailModal';

function StoreTab() {
  const [mode, setMode] = useState<'cardView' | 'listView'>('listView');
  const { user } = useUser();

  const [selectedRow, setSelectedRow] = useState<StoreShow>();
  const [detailModalVisible, openDetailModal, closeDetailModal] = useModal();
  const [addModalVisible, openAddDetailModal, closeAddDetailModal] = useModal();

  const [storeList, setStoreList] = useState<StoreShow[]>();

  const getStoreListQuery = useQuery(
    ['getStoreList'],
    () => retailerStoreAPI.getList({ page: 1, page_size: 400 }),
    {
      enabled: !!user,
      onSuccess: (data) => {
        // 1.폐점,운영 정렬 2. 생성날짜 정렬
        setStoreList([
          ...data.store_list.sort((a, b) => {
            if (!a?.is_closed > !b?.is_closed) return -1;
            if (a?.id > b?.id) return -1;
            return 0;
          }),
        ]);
      },
    },
  );

  const changeMode = () => {
    setMode((mode) => {
      return mode === 'cardView' ? 'listView' : 'cardView';
    });
  };

  return (
    <>
      {/*
       * 쇼핑몰 상세보기 모달
       */}
      <DetailModal
        visible={detailModalVisible}
        closeModal={closeDetailModal}
        selectedRow={selectedRow}
      />

      {/*
       * 쇼핑몰 추가 모달
       */}
      <StoreCreateModal
        visible={addModalVisible}
        closeModal={closeAddDetailModal}
      />

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
              <TurtleText>{t('description.store info')}</TurtleText>
            </Col>
          </Row>
        </Col>

        <Col>
          <SpecialButton
            onClick={() => {
              openAddDetailModal();
            }}
          >
            <TurtleText>{t('description.create store')}</TurtleText>
          </SpecialButton>
        </Col>
      </Row>

      <TurtleTableTitle
        totalCount={storeList?.length ?? 0}
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
            {mode === 'cardView'
              ? t('type.view.listView')
              : t('type.view.cardView')}
          </AddButton>
        }
      />

      {mode === 'cardView' ? (
        <Row gutter={[27, 27]} css={cardsContainer}>
          {storeList?.map((item, idx) => (
            <Col
              key={idx}
              span={8}
              onClick={() => {
                setSelectedRow({ ...item });
                openDetailModal();
              }}
              css={css`
                cursor: pointer;
              `}
            >
              <StoreCard store={item} />
            </Col>
          ))}
        </Row>
      ) : (
        <Table
          size="small"
          loading={getStoreListQuery.isLoading}
          dataSource={storeList}
          rowKey={(record) => record.id}
          onRow={(record) => ({
            onClick: () => {
              setSelectedRow({ ...record });
              openDetailModal();
            },
          })}
          pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
          scroll={{ x: 950, y: 'auto' }}
          columns={[
            {
              ellipsis: true,
              width: 100,
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
              title: t('table.retailerStoreName'),
              render: (_, record) => record.name,
            },
            {
              ellipsis: true,
              title: t('table.mobile'),
              render: (_, record) =>
                record.store_phone[0]?.phone.replace(
                  phonePattern,
                  '$1-$2-$3',
                ) ?? '',
            },
            {
              ellipsis: true,
              title: t('table.paymentAccountInfo'),
              render: (_, record) =>
                `${record.store_account[0]?.bank ?? ''} ${
                  record.store_account[0]?.account_number ?? ''
                } ${record.store_account[0]?.account_holder ?? ''}`,
            },
            {
              ellipsis: true,
              title: t('table.recipientPrint'),
              render: (_, record) => record.recipient_print,
            },
            {
              ellipsis: true,
              width: 140,
              title: t('table.inventory'),
              render: (_, record) =>
                t(`type.inventory.${record.inventory_type}`),
            },
            {
              ellipsis: true,
              title: t('table.transactionEmail'),
              render: (_, record) => record.email,
            },
          ]}
        />
      )}
    </>
  );
}

const cardsContainer = css`
  height: 70vh;
  overflow: auto;
`;

export default StoreTab;
