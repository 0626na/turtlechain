import React from 'react';
import orderAPI, { ResponseCreatePreParsing } from '@apis/orderAPI';
import { TurtleContentModal } from '@components/combine';
import { AnswerButton } from '@components/element';
import useOrderCart from '@hooks/useOrderCart';
import { Col, Row } from 'antd';
import { useMutation } from 'react-query';
import { RcFile } from 'antd/lib/upload';
import moment from 'moment';

interface Props {
  visible: boolean;
  close: () => void;
  open: () => void;
  data: {
    files: RcFile[];
    preParsingResult: ResponseCreatePreParsing;
  };
}

function PreparsingOrderModal({ visible, close, open, data }: Props) {
  const { ready, cart } = useOrderCart();

  //발주서 파싱
  const createOrderExcelParseMutation = useMutation(
    orderAPI.createOrderExcelParsing,
    {
      onSuccess: (parsingData) => {
        ready({
          ...parsingData,
          data: {
            ...parsingData.data,
            successes: parsingData.data.successes.map((item) => ({
              ...item,
              type: 'excel',
            })),
            fails: parsingData.data.fails.map((item) => ({
              ...item,
              type: 'excel',
            })),
          },
        });
      },
    },
  );

  return (
    <>
      <TurtleContentModal
        size="small"
        visible={visible}
        title="발주서 재등록"
        onClose={close}
      >
        <p>
          2차 발주까지 완료된 쇼핑몰은 발주서 등록이 금일은 불가능합니다.
          <br />
          {data.preParsingResult.data.third_order.map((store, index) =>
            data.preParsingResult.data.third_order.length !== index + 1
              ? `${store.rt_store_name}, `
              : `${store.rt_store_name}`,
          )}
          <br />
          <br />위 쇼핑몰을 제외한 나머지 발주서만 등록합니다. <br />
          1차발주:
          {data.preParsingResult.data.first_order.map((store, index) =>
            data.preParsingResult.data.first_order.length !== index + 1
              ? `${store.rt_store_name}, `
              : `${store.rt_store_name}`,
          )}
          <br />
          2차발주:
          {data.preParsingResult.data.second_order.map((store, index) =>
            data.preParsingResult.data.second_order.length !== index + 1
              ? `${store.rt_store_name}, `
              : `${store.rt_store_name}`,
          )}
        </p>

        <Row justify="end">
          <Col style={{ marginRight: 20 }}>
            <AnswerButton type="NO" text="취소" onClick={close} />
          </Col>
          <Col>
            <AnswerButton
              type="YES"
              text="재등록하기"
              disabled={
                data.preParsingResult.data.third_order.length !== 0 &&
                data.preParsingResult.data.first_order.length === 0 &&
                data.preParsingResult.data.second_order.length === 0
              }
              onClick={() => {
                createOrderExcelParseMutation.mutate({
                  files: data.files,
                  request_date: moment(cart.selectedDate).format('YYYY-MM-DD'),
                });
                close();
              }}
            />
          </Col>
        </Row>
      </TurtleContentModal>
    </>
  );
}

export default PreparsingOrderModal;
