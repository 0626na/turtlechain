import mistransferAPI, { RefundItem } from '@apis/mistransferAPI';

import {
  SecondaryButton,
  SelectButton,
  TurtleConfirmModal,
  TurtleTableTitle,
  TurtleTag,
  TurtleText,
} from '@components/element';
import { css } from '@emotion/react';
import useModal from '@hooks/useModal';
import useStore from '@hooks/useStore';
import { message } from '@utils/message';
import { Col, Row, Table } from 'antd';
import { t } from 'i18next';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import MistransferAddModal from '../modals/MistransferAddModal';
import { TextWithTooltip } from '@components/combine';

const tagColors = {
  request: 'green',
  pending: 'orange',
  complete: 'cyan',
} as const;

function MistransferTab() {
  const { store } = useStore();
  const [addModalVisible, openAddDetailModal, closeAddDetailModal] = useModal();
  const [selectedRow, setSelectedRow] = useState<RefundItem>();
  const [removeModalVisible, openRemoveModal, closeRemoveModal] = useModal();
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
  const removeMudation = useMutation(mistransferAPI.update, {
    onSuccess: () => {
      getMistransferQuery.refetch();
      message.success(t('message.success delete mistransfer'));
      closeRemoveModal();
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
      {/*
       * 오입금요청 취소모달
       */}
      <TurtleConfirmModal
        title={t('description.really delete')}
        description={[
          t('description.can not go back to the past after the cancellation.'),
        ]}
        okText={t('yes')}
        visible={removeModalVisible}
        loading={removeMudation.isLoading}
        onCancel={closeRemoveModal}
        onOk={() => {
          removeMudation.mutate({
            item_id: selectedRow?.id as number,
            is_inactive: 1,
          });
        }}
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
        onRow={(record) => {
          return {
            onClick: () => {
              setSelectedRow(record);
            },
          };
        }}
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
            width: 100,
            title: t('mistransfer.created date'),
            render: (_, record) => record.created_date,
          },
          {
            ellipsis: true,
            width: 200,
            title: t('table.vendorName'),
            render: (_, record) => record.ws_store_name,
          },
          {
            ellipsis: true,
            width: 200,
            title: t('mistransfer.accountInfo'),
            render: (_, { ws_bank, ws_account_number, ws_account_holder }) =>
              `${ws_bank} ${ws_account_number} ${ws_account_holder}`,
          },
          {
            ellipsis: true,
            width: 200,
            title: (
              <TextWithTooltip
                tooltipContent={[
                  t(
                    'description.displayed in the vendor`s account when transferring money.',
                  ),
                ]}
              >
                {t('mistransfer.recipient print')}
              </TextWithTooltip>
            ),
            render: (_, record) => record.recipient_print,
          },
          {
            ellipsis: true,
            width: 250,
            title: t('mistransfer.refund_memo'),
            render: (_, record) => record.memo,
          },
          {
            ellipsis: true,
            width: 150,
            align: 'right',
            title: t('mistransfer.request price'),
            render: (_, record) => record.transfer_amount.toLocaleString(),
          },
          {
            ellipsis: true,
            align: 'center',
            width: 150,
            render: (_, record) => (
              <>
                {record.status === 'request' && (
                  <SelectButton
                    onClick={() => {
                      openRemoveModal();
                    }}
                  >
                    요청취소
                  </SelectButton>
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
