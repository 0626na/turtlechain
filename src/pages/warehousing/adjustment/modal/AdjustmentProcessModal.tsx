import adjustmentAPI, { AdjustmentItemShow } from '@apis/adjustmentAPI';
import {
  TurtleConfirmModal,
  TurtleFormSelect,
  TurtleNumberInput,
} from '@components/element';
import { css } from '@emotion/react';
import { Col, Form, message, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

interface Props {
  visible: boolean;
  onClose: () => void;
  selectedRow: AdjustmentItemShow;
}

function AdjustmentProcessModal({ visible, onClose, selectedRow }: Props) {
  const queryClient = useQueryClient();

  const [item, setItem] = useState<AdjustmentItemShow>();

  const updateMutation = useMutation(adjustmentAPI.update, {
    onSuccess: () => {
      queryClient.refetchQueries(['getAdjustmentList'], { active: true });
      message.success('매입조정이 처리되었습니다.');
      onClose();
    },
  });

  useEffect(() => {
    setItem(selectedRow);
  }, [selectedRow]);

  return (
    <TurtleConfirmModal
      visible={visible}
      onCancel={onClose}
      onOk={() => {
        updateMutation.mutate({
          id: item?.id as number,
          process_count: item?.process_count,
          adjustment_process_type: item?.adjustment_process_type,
        });
      }}
      okDisabled={!item?.process_count || !item?.adjustment_process_type}
      loading={updateMutation.isLoading}
      title="매입 조정 처리"
      description={[
        '선택한 내역의 매입조정을 처리합니다.',
        '처리 방식과 수량을 설정해주세요.',
      ]}
    >
      <Form
        css={css`
          margin-top: 24px;
        `}
        colon={false}
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item label="처리방식" css={{ marginBottom: 12 }}>
          <TurtleFormSelect
            placeholder="선택"
            items={[
              { value: 'subtract', name: '차감' },
              { value: 'refund', name: '환불' },
            ]}
            value={item?.adjustment_process_type}
            onChange={(value: any) => {
              setItem((item) => ({
                ...(item as AdjustmentItemShow),
                adjustment_process_type: value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item label="처리수량 / 총 수량">
          <Row align="middle">
            <Col span={20}>
              <Form.Item noStyle>
                <TurtleNumberInput
                  value={item?.process_count}
                  onChange={(value) => {
                    setItem((item) => ({
                      ...(item as AdjustmentItemShow),
                      process_count: value as number,
                    }));
                  }}
                  max={item?.count_left}
                  min={1}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col
              span={2}
              css={css`
                margin-left: 12px;
              `}
            >
              <Form.Item noStyle>
                <span>/&nbsp;{selectedRow?.count_left}</span>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </TurtleConfirmModal>
  );
}

export default AdjustmentProcessModal;
