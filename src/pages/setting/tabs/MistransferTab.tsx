import mistransferAPI from '@apis/mistransferAPI';

import {
  SecondaryButton,
  SelectButton,
  TurtleTableTitle,
  TurtleTag,
  TurtleText,
} from '@components/element';
import { css } from '@emotion/react';
import useModal from '@hooks/useModal';
import useStore from '@hooks/useStore';

import { Col, message, Popconfirm, Row, Table } from 'antd';
import { t } from 'i18next';
import React from 'react';
import { useMutation, useQuery } from 'react-query';
import MistransferAddModal from '../modals/MistransferAddModal';

const tagColors = {
  request: 'green',
  pending: 'orange',
  complete: 'cyan',
} as const;

function MistransferTab() {
  const { store } = useStore();
  const [addModalVisible, openAddDetailModal, closeAddDetailModal] = useModal();

  const getMistransferQuery = useQuery(
    ['getMistransferQuery', store.selected?.id],
    () =>
      mistransferAPI.get({
        rt_store_id: store.selected?.id,
        type: 'mistransfer',
      }),
    {
      enabled: !!store.selected?.id,
    },
  );

  // 요청상태일시 삭제가능.
  const deleteMudation = useMutation(mistransferAPI.update, {
    onSuccess: () => {
      getMistransferQuery.refetch();
      message.success(t('message.success delete mistransfer'));
    },
  });

  return (
    <>
      {/*
       * 오입금 추가 모달
       */}
      <MistransferAddModal
        visible={addModalVisible}
        closeModal={closeAddDetailModal}
      />
      <Row
        justify="space-between"
        css={css`
          margin-bottom: 16px;
        `}
      >
        <Col
          css={css`
            font-size: 20px;
            font-weight: 500;
            color: #242934;
          `}
        >
          오입금 환불내역
        </Col>

        <Col>
          <SecondaryButton
            onClick={() => {
              openAddDetailModal();
            }}
          >
            <TurtleText>오입금 환불요청</TurtleText>
          </SecondaryButton>
        </Col>
      </Row>

      <Table
        size="small"
        loading={getMistransferQuery.isLoading}
        dataSource={getMistransferQuery.data?.data.refund_list}
        title={() => (
          <TurtleTableTitle
            totalCount={getMistransferQuery.data?.data.total_count ?? 0}
          />
        )}
        rowKey={(record) => record.id}
        pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
        scroll={{ x: 1400, y: 'auto' }}
        columns={[
          {
            ellipsis: true,
            width: 100,
            title: t('mistransfer.status.'),
            render: (_, record) => (
              <TurtleTag color={tagColors[record.status]}>
                {t(`mistransfer.status.${record.status}`)}
              </TurtleTag>
            ),
          },
          {
            ellipsis: true,
            width: 150,
            title: t('mistransfer.created date'),
            render: (_, record) => record.created_date,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('table.vendorName'),
            render: (_, record) => record.ws_store_name,
          },
          {
            ellipsis: true,
            width: 250,
            title: t('mistransfer.accountInfo'),
            render: (_, { ws_bank, ws_account_number, ws_account_holder }) =>
              `${ws_bank} ${ws_account_number} ${ws_account_holder}`,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('mistransfer.recipient print'),
            render: (_, record) => record.recipient_print,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('mistransfer.refund_memo'),
            render: (_, record) => record.memo,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('mistransfer.request price'),
            render: (_, record) => record.transfer_amount.toLocaleString(),
          },
          {
            ellipsis: true,
            render: (_, record) => (
              <>
                {record.status === 'request' && (
                  <Popconfirm
                    title={t('description.really delete')}
                    okText={t('yes')}
                    cancelText={`${t('no')}`}
                    onCancel={(e) => {
                      e?.stopPropagation();
                    }}
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      deleteMudation.mutate({
                        item_id: record.id,
                        is_inactive: 1,
                      });
                    }}
                  >
                    <SelectButton>요청취소</SelectButton>
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

export default MistransferTab;
