import adjustmentAPI, { AdjustmentItemShow } from '@apis/adjustmentAPI';
import {
  TurtleConfirmModal,
  TurtleFormSelect,
  TurtleNumberInput,
} from '@components/element';
import { css } from '@emotion/react';
import { Col, Form, Row } from 'antd';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { message } from '@utils/message';
interface Props {
  visible: boolean;
  onClose: () => void;
  selectedRow: AdjustmentItemShow;
}

function ProcessModal({ visible, onClose, selectedRow }: Props) {
  const queryClient = useQueryClient();
  const [item, setItem] = useState<AdjustmentItemShow>();
  const updateMutation = useMutation(adjustmentAPI.update, {
    onSuccess: () => {
      queryClient.refetchQueries(['getAdjustmentListQuery'], { active: true });
      message.success('성공적으로 업데이트 되었습니다.');

      onClose();
    },
  });

  useEffect(() => {
    setItem({ ...selectedRow, process_count: selectedRow?.count_left });
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
      okDisabled={item?.process_count === 0 || !item?.adjustment_process_type}
      loading={updateMutation.isLoading}
      title={`${t(`adjustment.process type.${selectedRow?.type}`)} 처리`}
      description={['처리 방식과 수량을 설정해주세요.']}
    >
      <Form
        css={css`
          margin-top: 24px;
        `}
        colon={false}
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label="처리방식"
          name="adjustment_process_type"
          css={{ marginBottom: 12 }}
        >
          <TurtleFormSelect
            placeholder="선택"
            items={[
              { value: 'subtract', name: '차감' },
              { value: 'refund', name: '환불' },
            ]}
            onChange={(value: string) => {
              setItem((item) => ({
                ...(item as AdjustmentItemShow),
                adjustment_process_type: value as 'subtract' | 'refund',
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

export default ProcessModal;
