import mistransferAPI from '@apis/mistransferAPI';
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
import useStore from '@hooks/useStore';
import useUser from '@hooks/useUser';

import { phonePattern } from '@utils/pattern';
import { Col, message, Popconfirm, Row, Table } from 'antd';
import { t } from 'i18next';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import AddModal from '../modal/AddModal';
import DetailModal from '../modal/DetailModal';

function MistransferTab() {
  // const [mode, setMode] = useState<'cardView' | 'listView'>('cardView');

  const { store } = useStore();
  const [selectedRow, setSelectedRow] = useState<StoreShow>();
  // const [detailModalVisible, openDetailModal, closeDetailModal] = useModal();
  const [addModalVisible, openAddDetailModal, closeAddDetailModal] = useModal();

  // const getQuery = useQuery(
  //   ['getStoreList'],
  //   retailerStoreAPI.getList,
  //   {
  //     enabled: !!user.id,
  //   },
  // );

  const getQuery = useQuery(
    ['getMistransfer', store.selected?.id],
    () =>
      mistransferAPI.get({
        rt_store_id: store.selected?.id,
        start_date: '',
        end_date: '',
        type: 'mistransfer',
      }),
    {
      enabled: !!store.selected?.id,
    },
  );

  const updateQuery = useMutation('updateMistransfer', mistransferAPI.update, {
    onSuccess: () => {
      getQuery.refetch();
      message.success(t('message.success delete mistransfer'));
    },
  });
  return (
    <>
      {/*
       * 쇼핑몰 상세보기 모달
       */}
      {/* <DetailModal
        visible={detailModalVisible}
        closeModal={closeDetailModal}
        selectedRow={selectedRow}
      /> */}
      {/*
       * 쇼핑몰 추가 모달
       */}
      <AddModal visible={addModalVisible} closeModal={closeAddDetailModal} />
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
          <SpecialButton
            onClick={() => {
              openAddDetailModal();
            }}
          >
            <TurtleText>쇼핑몰 추가하기</TurtleText>
          </SpecialButton>
        </Col>
      </Row>

      <Table
        size="small"
        loading={getQuery.isLoading}
        dataSource={getQuery.data?.data.refund_list}
        title={() => (
          <TurtleTableTitle totalCount={getQuery.data?.data.total_count ?? 0} />
        )}
        rowKey={(record) => record.id}
        onRow={(record) => ({
          onClick: () => {
            // setSelectedRow({ ...record });
            // openDetailModal();
          },
        })}
        pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
        scroll={{ x: 1400, y: 'auto' }}
        columns={[
          {
            ellipsis: true,
            width: 20,
            title: t('table.operatorStatus'),
            render: (_, record) => {
              const { status } = record;
              const color =
                status === 'request'
                  ? 'green'
                  : status === 'pending'
                  ? 'orange'
                  : 'cyan';
              const text = t(`mistransfer.status.${status}`);
              return <TurtleTag color={color}>{text}</TurtleTag>;
            },
          },
          {
            ellipsis: true,
            title: t('mistransfer.created date'),
            render: (_, record) => record.created_date,
          },
          {
            ellipsis: true,
            title: t('vendor.name'),
            render: (_, record) => record.ws_store_name,
          },
          {
            ellipsis: true,
            title: t('vendor.address'),
            render: (_, { ws_bank, ws_account_number, ws_account_holder }) =>
              `${ws_bank} ${ws_account_number} ${ws_account_holder}`,
          },
          {
            ellipsis: true,
            title: t('mistransfer.deposit price'),
            render: (_, record) => record.transfer_amount.toLocaleString(),
          },
          {
            ellipsis: true,
            title: t('mistransfer.recipient print'),
            render: (_, record) => record.recipient_print,
          },
          {
            ellipsis: true,
            title: t('mistransfer.memo'),
            render: (_, record) => record.memo,
          },
          {
            ellipsis: true,
            render: (_, record) => (
              <>
                {record.status === 'request' && (
                  <Popconfirm
                    title={t('description.really delete')}
                    okText={t('yes')}
                    cancelText={t('no')}
                    onCancel={(e) => {
                      e?.stopPropagation();
                    }}
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      updateQuery.mutate({
                        item_id: record.id,
                        is_inactive: 1,
                      });
                    }}
                  >
                    <TurtleIcon name="delete" />
                  </Popconfirm>
                )}
              </>
            ),
          },
        ]}
      />
    </>
  );
}

const cardsContainer = css`
  height: 70vh;
  overflow: auto;
`;

export default MistransferTab;
